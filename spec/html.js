describe("enhanced html binding", function () {
  var domNode;
  beforeEach(function () {
    domNode = document.createElement('div');
  })

  it ("updates html of dom node", function () {
    ko.applyBindingsToNode(domNode, { html: '<strong>updated</strong>' });
    expect(domNode.firstChild.nodeName.toLowerCase()).toEqual('strong');
  })

  it ("doesn't process data bindings in descendants", function () {
    ko.applyBindingsToNode(domNode, { html: '<strong data-bind="text: \'updated\'"></strong>' });
    expect(domNode.firstChild.innerHTML).toEqual('');
  })

  it ("pass data binding's context into nested html if 'withContext' binding is specified", function () {
    ko.applyBindingsToNode(domNode, { html: '<strong data-bind="text: \'updated\'"></strong>', withContext: true });
    expect(domNode.firstChild.innerHTML).toEqual('updated');
  })

});