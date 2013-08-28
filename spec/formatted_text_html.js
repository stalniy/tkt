sharedExamplesFor("text formatter", function () {
  var bindings = {};

  describe("when process price", function () {
    beforeEach(function () {
      bindings.showAs = 'price';
      bindings[this.bindingName] = 10.37;
    })

    it ("shows value with precision 2 and currency $ by default", function () {
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('$10.37');
    })

    it ("shows value with specified precision", function () {
      ko.applyBindingsToNode(this.domNode, ko.utils.extend({ precision: 1 }, bindings));
      expect(this.domNode).toContainText('$10.4')
    })

    it ("shows value with specified currency", function () {
      ko.applyBindingsToNode(this.domNode, ko.utils.extend({ priceSign: '#' }, bindings));
      expect(this.domNode).toContainText('#10.37')
    })

    it ("shows currency after the price", function () {
      ko.applyBindingsToNode(this.domNode, ko.utils.extend({ priceSign: 'USD', priceBefore: true }, bindings));
      expect(this.domNode).toContainText('10.37 USD')
    })

    it ("shows price with negative values", function () {
      bindings[this.bindingName] = -10.37;
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('- $10.37')
    })

  })

  describe("when process options", function () {
    beforeEach(function () {
      bindings.showAs = 'options';
      bindings.values = { processing: 'Processing', closed: "Closed" };
    })

    it ("shows options label", function () {
      bindings[this.bindingName] = 'processing';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText(bindings.values.processing);
    })

    it ("shows value if label is not found", function () {
      bindings[this.bindingName] = 'unknown_state';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('unknown_state');
    })

  })

  describe("when process noneIfEmtpy", function () {
    beforeEach(function () {
      bindings.showAs = 'noneIfEmpty';
    })

    it ("just shows value if value is truthy", function () {
      bindings[this.bindingName] = 'just a normal string';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText(bindings[this.bindingName]);
    })

    it ("shows 'None' if value is falsy", function () {
      bindings[this.bindingName] = null;
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('None');
    })

    it ("allows to specify message for falsy values", function () {
      bindings[this.bindingName] = null;
      ko.applyBindingsToNode(this.domNode, ko.utils.extend({ none: 'Empty Value' }, bindings));
      expect(this.domNode).toContainText('Empty Value');
    })

  })

  describe("when process float number", function () {
    beforeEach(function () {
      bindings.showAs = 'float';
    })

    it ("shows 0 if value isn't a number", function () {
      bindings[this.bindingName] = 'not a number';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('0.00');
    })

    it ("replaces commas with dots", function () {
      bindings[this.bindingName] = '11,10';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('11.10');
    })

    it ("removes spaces", function () {
      bindings[this.bindingName] = '1 1 1, 12';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('111.12');
    })

    it ("allows to specify precision", function () {
      bindings[this.bindingName] = 115.3274;
      ko.applyBindingsToNode(this.domNode, ko.utils.extend({ precision: 3 }, bindings));
      expect(this.domNode).toContainText('115.327');
    })
  })

  describe("when process integer number", function () {
    beforeEach(function () {
      bindings.showAs = 'int';
    })

    it ("parse value as integer", function () {
      bindings[this.bindingName] = 11.37;
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('11');
    })

    it ("shows 0 if value isn't a number", function () {
      bindings[this.bindingName] = 'not a number';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('0');
    })

    it ("allows to specify number base", function () {
      bindings[this.bindingName] = 25;
      ko.applyBindingsToNode(this.domNode, ko.utils.extend({ intBase: 16 }, bindings));
      expect(this.domNode).toContainText('37');
    })

  })

  describe("when process number", function () {
    beforeEach(function () {
      bindings.showAs = 'number';
    })

    it ("shows 0 if value isn't a number", function () {
      bindings[this.bindingName] = 'not a number';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('0');
    })

    it ("shows a number", function () {
      bindings[this.bindingName] = '115.32';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('115.32');
    })
  })

  describe("when process percentage", function () {
    beforeEach(function () {
      bindings.showAs = 'percentage';
    })

    it ("shows passed value if value isn't a number", function () {
      bindings[this.bindingName] = 'No Data';
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('No Data');
    })

    it ("adds percent sign next to the value", function () {
      bindings[this.bindingName] = 32.33;
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('32.33%');
    })

    // itBehavesLike("float number formatter")
  })

  describe("when process boolean", function () {
    beforeEach(function () {
      bindings.showAs = 'bool';
    })

    it ("shows 'Yes' if value is truthy", function () {
      bindings[this.bindingName] = true;
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('Yes');
    })

    it ("shows 'No' if value is falsy", function () {
      bindings[this.bindingName] = 0;
      ko.applyBindingsToNode(this.domNode, bindings);
      expect(this.domNode).toContainText('No');
    })
  })

  it ("allows to add custom formats", function () {
    var binding = ko.bindingHandlers[this.bindingName];
    binding.addFormat('test', function (value) { return '*' + value + '*' });
    bindings[this.bindingName] = 'string';
    bindings.showAs = 'test';
    ko.applyBindingsToNode(this.domNode, bindings);
    expect(this.domNode).toContainText('*string*');
    binding.removeFormat('test');
  })

});

describe("Content formatting for html and text bindings", function () {
  beforeEach(function () {
    this.domNode = document.createElement('div');
  })

  describe("html binding", function () {
    beforeEach(function () {
      this.bindingName = 'html';
    })

    itBehavesLike("text formatter")

    describe("when process boolIcon", function () {
      it ("shows span with class 'icon-check' if value is truthy", function () {
        ko.applyBindingsToNode(this.domNode, { html: true, showAs: 'boolIcon' });
        expect(this.domNode).toContainHtml('<span class="icon-check"></span>');
      })

      it ("shows span with class 'icon-remove' if value is falsy", function () {
        ko.applyBindingsToNode(this.domNode, { html: false, showAs: 'boolIcon' });
        expect(this.domNode).toContainHtml('<span class="icon-remove"></span>');
      })
    })
  })

  describe('text binding', function () {
    beforeEach(function () {
      this.bindingName = 'text';
    })

    itBehavesLike("text formatter")

    it ("doesn't process boolIcon format", function () {
      ko.applyBindingsToNode(this.domNode, { text: true, showAs: 'boolIcon' });
      expect(this.domNode).toContainText('<span class="icon-check"></span>')
    })
  })

});
