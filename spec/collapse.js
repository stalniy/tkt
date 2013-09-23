sharedExamplesFor("callback option", function () {
  it("is evaluated with proper context", function () {
    var vm = this.vm;
    this.method = function () { expect(this).toBe(vm) };
  })

  it("accepts 3 arguments", function () {
    var domNode = this.domNode;
    this.method = function ($firstChild, parentViewModel, $domNode) {
      expect($firstChild.get(0)).toBe(domNode.firstChild);
      expect(parentViewModel).toBe(undefined);
      expect($domNode.get(0)).toBe(domNode);
    };
  })
});

describe("Collapse binding", function () {
  var domNode;
  beforeEach(function () {
    domNode = document.createElement('div');
    domNode.appendChild(document.createElement('span'));
  })

  it ("hides element if 'when' is false", function () {
    ko.applyBindingsToNode(domNode, { collapse: { when: false } });
    expect(domNode).not.toBeVisible();
  })


  describe("when inScopeOf is specified", function () {
    var observable;
    beforeEach(function () {
      observable = ko.observable(true);
    })

    it ("requires from 'when' option to be an observable", function () {
      expect(function () {
        ko.applyBindingsToNode(domNode, { collapse: { when: true, inScopeOf: 'active_items' } });
      }).toThrow();
    })

    it ("registers disposal callback", function () {
      spyOn(ko.utils.domNodeDisposal, 'addDisposeCallback').andCallThrough();
      ko.applyBindingsToNode(domNode, { collapse: { when: observable, inScopeOf: 'active_items' } });
      expect(ko.utils.domNodeDisposal.addDisposeCallback).toHaveBeenCalled();
    })

    it ("updates active observable when another collapse is triggered on another node", function () {
      var anotherNode = document.createElement('div');
      var anotherObservable = ko.observable(false);

      ko.applyBindingsToNode(domNode, { collapse: { when: observable, inScopeOf: 'active_items' } });
      ko.applyBindingsToNode(anotherNode, { collapse: { when: anotherObservable, inScopeOf: 'active_items' } });

      anotherObservable(true);
      expect(observable()).toBe(false);
    })
  })

  describe("'call' option", function () {
    beforeEach(function () {
      this.vm = {};
      this.method = null;
      this.domNode = domNode;
    })

    afterEach(function () {
      ko.applyBindingsToNode(domNode, { collapse: { when: true, 'call': this.method } }, this.vm);
    })

    it("evaluates when binding updates", function () {
      this.method = function () { expect(domNode).not.toBeVisible() };
    })

    itBehavesLike("callback option")
  })

  describe("'then' option", function () {
    beforeEach(function () {
      this.vm = {};
      this.method = null;
      this.domNode = domNode;
    })

    afterEach(function () {
      ko.applyBindingsToNode(domNode, { collapse: { when: true, then: this.method, duration: 100 } }, this.vm);
    })

    it("evaluates when after element becomes visible", function () {
      this.method = function () { expect(domNode).toBeVisible() };
      setTimeout(this.method, 110);
    })

    itBehavesLike("callback option")
  })
});
