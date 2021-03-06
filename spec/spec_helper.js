(function (jasmine, $) {
  function domNodeText(node) {
    return 'textContent' in node ? node.textContent : node.innerText;
  }

  jasmine.Matchers.prototype.toContainText = function (expectedText) {
    var actualText = domNodeText(this.actual);
    var cleanedActualText = actualText.replace(/\r\n/g, "\n");
    this.actual = cleanedActualText;    // Fix explanatory message
    return cleanedActualText === expectedText;
  };

  jasmine.Matchers.prototype.toContainHtml = function (expectedHtml) {
    var cleanedHtml = this.actual.innerHTML.toLowerCase().replace(/\r\n/g, "");
    // IE < 9 strips whitespace immediately following comment nodes. Normalize by doing the same on all browsers.
    cleanedHtml = cleanedHtml.replace(/(<!--.*?-->)\s*/g, "$1");
    expectedHtml = expectedHtml.replace(/(<!--.*?-->)\s*/g, "$1");
    // Also remove __ko__ expando properties (for DOM data) - most browsers hide these anyway but IE < 9 includes them in innerHTML
    cleanedHtml = cleanedHtml.replace(/ __ko__\d+=\"(ko\d+|null)\"/g, "");
    this.actual = cleanedHtml;      // Fix explanatory message
    return cleanedHtml === expectedHtml;
  };

  jasmine.Matchers.prototype.toBeVisible = function () {
    var notText = this.isNot ? " not" : "";
    this.message = function () {
      return "Expected node to be " + notText + " visible";
    };
    return this.actual.offsetWidth !== 0 && this.actual.offsetHeight !== 0;
  };

  jasmine.Matchers.prototype.toContainCssClass = function (expectedClass) {
    if (this.actual.length && !this.actual.nodeType) {
      var cssClasses = ko.utils.arrayMap(this.actual, function (node) { return node.className });
    } else {
      var cssClasses = [ this.actual.className ];
    }
    this.actual = cssClasses;
    var result = cssClasses.length > 0;
    ko.utils.arrayForEach(cssClasses, function (klass) {
      result = result && (' ' + klass + ' ').indexOf(' ' + expectedClass + ' ') !== -1
    });
    return result;
  };

  jasmine.Matchers.prototype.toBeInstanceOf = function (object) {
    return this.actual instanceof object;
  };

  var sharedExamples = {};

  $.extend(window, {
    sharedExamplesFor: function (name, executor) {
      sharedExamples[name] = executor;
    },

    itBehavesLike: function (sharedExampleName) {
      jasmine.getEnv().describe("behaves like " + sharedExampleName, sharedExamples[sharedExampleName]);
    },

    includeExamplesFor: function (sharedExampleName) {
      var suite = jasmine.getEnv().currentSuite;
      sharedExamples[sharedExampleName].call(suite);
    }
  });

  window.context = window.describe;
  window.includeExamples = window.includeExamplesFor;
})(jasmine, jQuery);
