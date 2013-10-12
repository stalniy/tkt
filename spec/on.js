describe("'on' binding", function () {
  var domNode;
  var scope;
  var childScope;
  var noop = function (){};

  beforeEach(function () {
    domNode = $('<div><a data-id="1" title="test" data-name="test">test</a></div>');
    scope = { runHandler: noop };
    childScope = { runChildHandler: noop };
    spyOn(scope, 'runHandler');
    spyOn(childScope, 'runChildHandler');
  })

  it ("delegates events", function () {
    applyBindingTo(domNode, { 'click a': 'runHandler' }, scope);
    domNode.find('a').trigger('click');
    expect(scope.runHandler).toHaveBeenCalled();
  })

  it ("handles events", function () {
    applyBindingTo(domNode, { click: 'runHandler' }, scope);
    domNode.find('a').trigger('click');
    expect(scope.runHandler).toHaveBeenCalled();
  })

  it ("passes current and parent contexts into handler by default", function () {
    applyBindingTo(domNode, { 'click a': 'runChildHandler' });
    domNode.find('a').trigger('click');
    expect(childScope.runChildHandler).toHaveBeenCalledWith(childScope, scope);
  })

  it ("throws exception if method can't be found", function () {
    applyBindingTo(domNode, { 'click a': 'nonExistingMethod' });
    expect(function () {
      domNode.find('a').trigger('click');
    }).toThrow()
  })

  describe("when event handler is called", function () {
    var eventPreventDefault;
    beforeEach(function () {
      ko.bindingHandlers.on.valueDefs.custom = function (element, context, event) {
        eventPreventDefault = spyOn(event, 'preventDefault');
        return true;
      };
      applyBindingTo(domNode, { 'click a': 'runHandler', custom: true });
    })

    afterEach(function () {
      eventPreventDefault = null
      delete ko.bindingHandlers.on.valueDefs.custom;
    })

    it ("prevents default action by default", function () {
      domNode.find('a').trigger('click');
      expect(eventPreventDefault).toHaveBeenCalled();
    })

    it ("doesn't prevent default action if handler returns true", function () {
      childScope.runHandler = function () { return true };
      domNode.find('a').trigger('click');
      expect(eventPreventDefault).not.toHaveBeenCalled();
    })

  })

  describe("when node is removed", function () {
    beforeEach(function () {
      applyBindingTo(domNode, { 'click a': 'runHandler' });
    })

    it ("removes event handlers", function () {
      ko.cleanNode(domNode.get(0));
      domNode.find('a').trigger('click');
      expect(scope.runHandler).not.toHaveBeenCalled();
    })

    it ("removes only handlers which were added by 'on' binding", function () {
      var handler = jasmine.createSpy('customEventHandler')
      domNode.on('click', handler);
      ko.cleanNode(domNode.get(0));
      domNode.find('a').trigger('click');
      expect(handler).toHaveBeenCalled();
    })
  })

  describe("when 'data' option is specified", function () {
    it ("passes data attribute into handler", function () {
      applyBindingTo(domNode, { 'click a': 'runChildHandler', data: 'id' });
      var id = domNode.find('a').trigger('click').data('id');
      expect(childScope.runChildHandler).toHaveBeenCalledWith(id);
    })

    it ("passes regular attribute into handler if data attribute doesn't exist", function () {
      applyBindingTo(domNode, { 'click a': 'runChildHandler', data: 'title' });
      var title = domNode.find('a').trigger('click').attr('title');
      expect(childScope.runChildHandler).toHaveBeenCalledWith(title);
    })

    it ("passes all data attributes if data equals '*'", function () {
      applyBindingTo(domNode, { 'click a': 'runChildHandler', data: '*' });
      var data = domNode.find('a').trigger('click').data();
      expect(childScope.runChildHandler).toHaveBeenCalledWith(data);
    })

  })

  describe ("when lookups for specified method", function () {
    it ("checks parent context", function () {
      scope.customMethod = noop;
      spyOn(scope, 'customMethod');

      applyBindingTo(domNode, { 'click a': 'customMethod' });
      domNode.find('a').trigger('click');
      expect(scope.customMethod).toHaveBeenCalled();
    })

    it ("calls method from first occurrence", function () {
      childScope.runHandler = noop;
      spyOn(childScope, 'runHandler');

      applyBindingTo(domNode, { 'click a': 'runHandler' });
      domNode.find('a').trigger('click');
      expect(childScope.runHandler).toHaveBeenCalled();
    })
  })

  function applyBindingTo(domNode, binding, context) {
    ko.applyBindingsToNode(domNode.get(0), { on: binding }, context || buildContext(childScope, scope));
  }

  function buildContext(context, parentContext) {
    var $parent = new ko.bindingContext(parentContext);
    return $parent.createChildContext(context);
  }
})
