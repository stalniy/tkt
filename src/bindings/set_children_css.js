(function (ko) {
  var cssBinding = ko.bindingHandlers.css;

  ko.bindingHandlers.setChildrenCss = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var rules = valueAccessor(), updater;

      if (rules.call) {
        var value, accessor = function () { return rules.call(viewModel, value) };
        updater = function (child) {
          value = ko.bindingHandlers.setChildrenCss.elementToValue(child);
          cssBinding.update(child, accessor);
        };
      } else {
        updater = function (child) { cssBinding.update(child, valueAccessor) };
      }

      ko.utils.arrayForEach(element.childNodes, function (child) {
        if (child.nodeType === 1) {
          updater(child);
        }
      });
    },

    elementToValue: function (element) {
      return element.getAttribute('data-name');
    }
  };
})(ko);