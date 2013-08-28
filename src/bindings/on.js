require(['ko', 'jquery', 'utils'], function (ko, $, utils) {
  function createValueDefFrom(config) {
    var def;
    if (config.to) {
      def = [config.to]
    } else if (config.on) {
      def = ['attr', config.on]
    } else if (config.data) {
      def = ['data', config.data]
    }
    return def;
  }

  function assembleValueFor(node, valueDef) {
    var domNode = $(node), value;
    if (valueDef) {
      value = domNode[valueDef[0]].apply(domNode, valueDef.slice(1));
    } else {
      value = domNode.data();
      if (value.bind) {
        delete value.bind;
      }
    }
    return value;
  }

  function createEventHandlerFor(config, rule) {
    var
      methodName = config[rule],
      valueDef   = createValueDefFrom(config);

    return function (event) {
      var
        context = ko.contextFor(this),
        method  = utils.lookupMethodIn(context, methodName),
        result  = method(assembleValueFor(this, valueDef), context.$data, event);

      if (result !== true) { event.preventDefault() }
    };
  }

  ko.bindingHandlers.on = {
    init: function (element, valueAccessor, allBindings, viewModel) {
      var config = valueAccessor(), domNode = $(element);

      for (var rule in config) {
        if (config.hasOwnProperty(rule)) {
          var handler = createEventHandlerFor(config, rule);
          rule = rule.split(/\s+/, 2);
          if (rule[1]) {
            domNode.on(rule[0], rule[1], handler);
          } else {
            domNode.on(rule[0], handler);
          }
          ko.utils.domNodeDisposal.addDisposeCallback(domNode[0], utils.removeEventHandlers);
        }
      }
    }
  };
});
