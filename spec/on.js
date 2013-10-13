describe("'on' binding", function () {
  var domNode;
  var scope;
  var childScope;
  var noop = function (){};

  beforeEach(function () {
    domNode = $('<div>' +
      '<a data-id="1" title="test1" data-name="test1">test 1</a>' +
      '<a data-id="2" title="test2" data-name="test2">test 2</a>' +
    '</div>');
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

  describe("when 'collected' option is specified", function () {
    it ("collects specified attributes if specified key is pressed", function () {
      applyBindingTo(domNode, { 'click a': 'runHandler', collected: 'data-id using shiftKey' });
      var links = triggerEventWithPressed('shiftKey');

      expect(scope.runHandler.mostRecentCall.args).toEqual([ links.first().attr('data-id'), links.eq(1).attr('data-id')]);
    })

    it ("collects attributes and add or remove their suffix", function () {
      applyBindingTo(domNode, { 'click a': 'runHandler', collected: 'title using ctrlKey and toggle with desc' });
      var links = triggerEventWithPressed('ctrlKey');
      links.first().trigger(clickEventWithPressed('ctrlKey'));

      expect(scope.runHandler.mostRecentCall.args).toEqual([ links.first().attr('title') + '-desc', links.eq(1).attr('title')]);
    })

    it ("collects attributes and toggles their suffix", function () {
      applyBindingTo(domNode, { 'click a': 'runHandler', collected: 'title using altKey and toggle with asc or desc' });
      var links = triggerEventWithPressed('altKey');
      links.eq(1).trigger(clickEventWithPressed('altKey'));

      expect(scope.runHandler.mostRecentCall.args).toEqual([ links.first().attr('title') + '-asc', links.eq(1).attr('title') + '-desc']);
    })

    it ("resets collected attributes if specified key isn't pressed", function () {
      applyBindingTo(domNode, { 'click a': 'runHandler', collected: 'title using altKey' });
      var links = triggerEventWithPressed('altKey');
      links.eq(1).trigger(clickEventWithPressed('shiftKey'));

      expect(scope.runHandler.mostRecentCall.args).toEqual([ links.eq(1).attr('title') ]);
    })

    function triggerEventWithPressed(keyName) {
      var links = domNode.find('a');
      links.first().trigger(clickEventWithPressed(keyName));
      links.eq(1).trigger(clickEventWithPressed(keyName));
      return links;
    }

    function clickEventWithPressed(keyName) {
      var event = $.Event("click");
      event[keyName] = true;
      return event;
    }
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
    ko.applyBindingsToNode(domNode.get(0), { on: binding, contextify: !context }, context || scope);
  }

  ko.bindingHandlers.contextify = {
    init: function (element, valueAccessor, allBindingsAccessor, scope, context) {
      if (valueAccessor()) {
        var childContext = context.createChildContext(childScope);

        $(element).children().each(function () {
          ko.applyBindings(childContext, this);
        });
        return { controlsDescendantBindings: true };
      }
    }
  };
})
