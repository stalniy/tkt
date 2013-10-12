(function (ko, $) {
  var domData = ko.utils.domData;
  var contextPositionKey = '_tkt_context_index';
  var handlersNamespace  = '._tkt_event_handler';

  var binding = {
    init: function (element, valueAccessor, allBindings, viewModel) {
      var config = valueAccessor(), domNode = $(element), handler;

      for (var rule in config) {
        if (config.hasOwnProperty(rule) && !(rule in binding.valueDefs)) {
          handler = createEventHandlerFor(config, rule);
          rule = rule.split(/\s+/, 2);
          domNode.on(rule[0] + handlersNamespace, rule[1], handler);
        }
      }
      ko.utils.domNodeDisposal.addDisposeCallback(domNode[0], removeEventHandlers);
    },

    valueDefs: {

      data: function (element, context, event) {
        var domNode = $(element);

        if (this.value === '*') {
          var data = domNode.data();

          if (data.bind) {
            delete data.bind;
          }
          return data;
        }
        return domNode.data(this.value) || domNode.attr(this.value);
      },

      'default': function (element, context, event) {
        return [ context.$data, context.$parent ];
      }
    }
  };

  ko.utils.arrayForEach('with,to,by,of,from,as,on,in,at'.split(','), function (word) {
    binding.valueDefs[word] = binding.valueDefs.data;
  });


  ko.bindingHandlers.on = binding;


  var defaultValueBuilder = { buildFrom: binding.valueDefs['default'] };

  function detectBuilderFrom(config) {
    var defs = binding.valueDefs;
    for (var defName in defs) {
      if (defs.hasOwnProperty(defName) && defName in config) {
        return {
          buildFrom : defs[defName],
          value     : config[defName]
        }
      }
    }

    return defaultValueBuilder;
  }

  function createEventHandlerFor(config, rule) {
    var
      methodName = config[rule],
      builder = detectBuilderFrom(config);

    config = rule = null;

    return function (event) {
      var element  = event.currentTarget;
      var context  = ko.contextFor(this);
      var scopes   = context.$parents.slice(0);
      var position = domData.get(element, contextPositionKey);

      scopes.unshift(context.$data);
      if (!position) {
        position = getPositionOfContextWith(methodName, scopes);
        domData.set(element, contextPositionKey, position);
      }

      var scope = scopes[position];
      var value = builder.buildFrom(element, context, event);
      var result = scope[methodName].apply(scope, value.push && value.pop ? value : [ value ]);

      if (result !== true) {
        event.preventDefault();
      }
    };
  }

  function removeEventHandlers(element) {
    $(element).off(handlersNamespace);
  }

  function getPositionOfContextWith(methodName, scopes) {
    var i = 0, count = scopes.length, scope;

    do {
      scope = scopes[i];
    } while (!(scope[methodName] && scope[methodName].apply) && ++i < count);

    if (i === count) {
      throw new Error('Unknown method "' + methodName + '" in context');
    }
    return i;
  }
})(ko, jQuery);
