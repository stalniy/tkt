(function (ko, $) {
  var domData = ko.utils.domData;
  var contextPositionKey = '_tkt_context_index';
  var handlersNamespace  = '._tkt_on_event_handler';
  var collectedValuesKey = '_tkt_collected_values';
  var collectedDefsKey   = '_tkt_collected_defs';

  var binding = {
    init: function (element, valueAccessor, allBindings, viewModel) {
      var config = valueAccessor(), domNode = $(element), handler;

      for (var rule in config) {
        if (config.hasOwnProperty(rule) && !(rule in binding.valueDefs) && typeof config[rule] === 'string') {
          handler = createEventHandlerFor(config, rule);
          rule = rule.split(/\s+/, 2);
          domNode.on(rule[0] + handlersNamespace, rule[1], handler);
        }
      }
      ko.utils.domNodeDisposal.addDisposeCallback(domNode[0], removeEventHandlers);
    },

    valueDefs: {

      collected: function (element, context, event) {
        var config = domData.get(event.delegateTarget, collectedDefsKey);
        var value  = this.config[this.name];

        if (!config) {
          var config = parseCollectedConfig(value);
          domData.set(event.delegateTarget, collectedDefsKey, config);
        }

        var domNode = $(element);
        var collectedValues = domData.get(event.delegateTarget, collectedValuesKey);
        var newValue = domNode.attr(config.attr);

        if (!collectedValues || !event[config.key]) {
          collectedValues = [];
        }

        toggleValueIn(collectedValues, newValue, config.toggle);
        domData.set(event.delegateTarget, collectedValuesKey, collectedValues);

        return collectedValues;
      },

      data: function (element, context, event) {
        var domNode = $(element);
        var value = this.config[this.name];

        if (value === '*') {
          var data = domNode.data();

          if (data.bind) {
            delete data.bind;
          }
          return data;
        }
        return domNode.data(value) || domNode.attr(value);
      },

      'default': function (element, context, event) {
        return [ context.$data, context.$parent ];
      }
    },

    options: {
      toggleValueSeparator: '-'
    }
  };

  ko.utils.arrayForEach('with,to,by,of,from,as,on,in,at'.split(','), function (word) {
    binding.valueDefs[word] = binding.valueDefs.data;
  });


  ko.bindingHandlers.on = binding;


  function detectBuilderFrom(config) {
    var defs = binding.valueDefs;
    for (var defName in defs) {
      if (defs.hasOwnProperty(defName) && defName in config) {
        return {
          buildFrom : defs[defName],
          name      : defName,
          config    : config
        }
      }
    }

    return {
      name      : 'default',
      buildFrom : binding.valueDefs['default'],
      config    : config
    };
  }

  function createEventHandlerFor(config, rule) {
    var
      methodName = config[rule],
      builder = detectBuilderFrom(config);

    config = rule = null;

    var eventHandler = function (event) {
      if ('ignore' in builder.config && $(event.target).closest(builder.config.ignore).size() > 0) {
        return;
      }

      var element  = event.currentTarget;
      var context  = ko.contextFor(this);
      var scopes   = context.$parents.slice(0);
      var positionCacheKey = event.type + methodName + contextPositionKey;
      var position = domData.get(element, positionCacheKey);

      scopes.unshift(context.$data);
      if (!position) {
        position = getPositionOfContextWith(methodName, scopes);
        domData.set(element, positionCacheKey, position);
      }

      var scope = scopes[position];
      var value = builder.buildFrom(element, context, event);
      var result = scope[methodName].apply(scope, value.push && value.pop ? value : [ value ]);

      if (result !== true) {
        event.preventDefault();
      }

      if (builder.config.bubble === false) {
        event.stopPropagation();
      }
    };

    if (builder.config.delay) {
      var timerId;
      var originalEventHandler = eventHandler;

      eventHandler = function (event) {
        clearTimeout(timerId);
        timerId = setTimeout(originalEventHandler.bind(this, event), builder.config.delay);
      };
    }

    return eventHandler;
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

  function parseCollectedConfig(value) {
    var parsedValue = value.trim().match(/^(\S+)\s+using\s+(\w+)(?:\s+and\s+toggle\s+with\s+(\w+)(?:\s+or\s+(\w+))?)?$/i);

    if (!parsedValue) {
      throw new Error("'on' binding: invalid definition of 'collected' option.");
    }
    return {
      attr   : parsedValue[1],
      key    : parsedValue[2],
      toggle : parsedValue[3] ? parsedValue.slice(3) : null
    };
  }

  function toggleValueIn(array, value, toggleSuffixes) {
    var toggleSeparator = binding.options.toggleValueSeparator;
    var currentValueIndex = -1, count = array.length, currentValue;

    while (++currentValueIndex < count && String(array[currentValueIndex]).indexOf(value) !== 0);

    currentValue = array[currentValueIndex];
    toggleSuffixes = toggleSuffixes || [];

    if (currentValue) {
      currentValue = currentValue.split(toggleSeparator);
      var currentSuffix    = currentValue[1] || '';
      var lastToggleSuffix = toggleSuffixes[1] || '';

      currentValue[1] = currentSuffix === lastToggleSuffix ? toggleSuffixes[0] : lastToggleSuffix;
      if (!currentValue[1]) {
        currentValue.pop();
      }
      array[currentValueIndex] = currentValue.join(toggleSeparator);
    } else {
      currentValue = toggleSuffixes[1] ? value + toggleSeparator + toggleSuffixes[0] : value;
      array.push(currentValue);
    }
  }
})(ko, jQuery);
