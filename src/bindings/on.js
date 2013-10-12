(function (ko, $) {
  var domData = ko.utils.domData;

  ko.bindingHandlers.on = {
    init: function (element, valueAccessor, allBindings, viewModel) {
      var config = valueAccessor(), domNode = $(element);

      for (var rule in config) {
        if (config.hasOwnProperty(rule)) {
          var handler = createEventHandlerFor(config, rule);
          rule = rule.split(/\s+/, 2);
          if (rule[1]) {
            domNode.on(rule[0], rule[1], handler);
            ko.utils.domNodeDisposal.addDisposeCallback(domNode[0], removeEventHandlers);
          }
        }
      }
    }
  };

  function createValueDefFrom(config) {
    var def;
    if (config.to) {
      def = [ config.to ]
    } else if (config.on) {
      def = ['attr', config.on]
    } else if (config.data || config.fromData) {
      def = ['data', (config.data || config.fromData)]
    }
    return def;
  }

  function assembleValueFor(node, valueDef) {
    var domNode = $(node), value;
    if (valueDef) {
      value = domNode[valueDef.shift()].apply(domNode, valueDef);
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
      var element  = event.currentTarget;
      var context  = ko.contextFor(this);
      var scopes   = context.$parents.slice(0);
      var position = domData.get(element, 'contextHandlerPosition');

      if (!position) {
        position = _.lookupContextWithMethodPosition(context, methodName);
        domData.set(element, 'contextHandlerPosition', position);
      }
      scopes.unshift(context.$data);

      var scope = scopes[position], result;
      if (config.passContext) {
        result = scope[methodName].call(scope, context.$data, context.$parent);
      } else {
        result = scope[methodName].call(scope, assembleValueFor(this, valueDef), context, event);
      }

      if (result !== true) { event.preventDefault() }
    };
  }

  function removeEventHandlers(element) {
    $(element).off();
  }
})(ko, jQuery);
