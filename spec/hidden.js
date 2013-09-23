describe("hidden binding", function () {
  var domNode;
  beforeEach(function () {
    domNode = document.createElement('div');
  })

  it ("delegates everything to 'visible' binding", function () {
    spyOn(ko.bindingHandlers.visible, 'update');
    ko.applyBindingsToNode(domNode, { hidden: true });
    expect(ko.bindingHandlers.visible.update).toHaveBeenCalled();
  })

  it ("iverses value and pass it to 'visible' binding", function () {
    spyOn(ko.bindingHandlers.visible, 'update');
    ko.applyBindingsToNode(domNode, { hidden: true });
    expect(ko.bindingHandlers.visible.update.mostRecentCall.args[1]()).toBe(false);
  })

})
