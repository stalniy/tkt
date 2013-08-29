describe("Css binding which applies to children", function () {
  beforeEach(function () {
    this.domNode = document.createElement('div');
    this.domNode.innerHTML = [
      '<span data-name="column1">text-1</span>',
      '<span data-name="column2">text-2</span>',
    ].join('');
  })

  it ("applies css binding to each child node", function () {
    ko.applyBindingsToNode(this.domNode, { setChildrenCss: { child: true } });
    expect(this.domNode.childNodes).toContainCssClass('child');
  })

  describe("when uses view model method", function () {
    var viewModel = {
      classForChild: function (childName) {
        return 'child-' + childName
      }
    };

    it ("sets css classes based on return value", function () {
      var children  = this.domNode.childNodes;
      ko.applyBindingsToNode(this.domNode, { setChildrenCss: viewModel.classForChild }, viewModel);
      expect(children[0]).toContainCssClass('child-column1');
      expect(children[1]).toContainCssClass('child-column2');
    })

    it ("allows to override elementToValue method", function () {
      var children  = this.domNode.childNodes;
      var oldMethod = ko.bindingHandlers.setChildrenCss.elementToValue;

      ko.bindingHandlers.setChildrenCss.elementToValue = function (element) { return element.innerHTML };
      ko.applyBindingsToNode(this.domNode, { setChildrenCss: viewModel.classForChild }, viewModel);
      expect(children[0]).toContainCssClass('child-' + children[0].innerHTML);
      expect(children[1]).toContainCssClass('child-' + children[1].innerHTML);

      ko.bindingHandlers.setChildrenCss.elementToValue = oldMethod;
    })
  })

})