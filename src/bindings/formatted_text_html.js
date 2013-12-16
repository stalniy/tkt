(function (ko, tkt) {
  var unwrap = ko.utils.unwrapObservable;
  var formats = {
    price: function (v, options) {
      var sign = unwrap(options.priceSign) || "$";
      var value = (Number(v) || 0).toFixed('precision' in options ? options.precision : 2);

      if (options.priceBefore) {
        value += ' ' + sign;
      } else {
        value = value < 0 ? '- ' + sign + (value * -1) : sign + value;
      }
      return value;
    },

    options: function (id, options) {
      var value = options.values[id];
      return id in options.values ? value : id;
    },

    noneIfEmpty: function (v, options) {
      return String(v || options.none || 'None');
    },

    'float': function (v, options) {
      var value = parseFloat(String(v).replace(/,/g, '.').replace(/\s+/g, '')) || 0;
      return value.toFixed('precision' in options ? options.precision : 2);
    },

    'int': function (v, options) {
      return parseInt(v, options.intBase || 10) || 0;
    },

    number: function (v) {
      return Number(v) || 0;
    },

    percentage: function (v, options) {
      if (!isNaN(+v)) {
        return this['float'](v, options) + '%'
      } else {
        return v
      }
    },

    boolIcon: function (v) {
      return '<span class="icon-' + (v ? 'check' : 'unckeck' ) + '"></span>';
    },

    bool: function (v) {
      return v ? 'Yes' : 'No';
    }
  };

  function addDataFormat(name, formatter) {
    formats[name] = formatter;
    return this;
  };

  function removeDataFormat(name) {
    if (formats[name]) {
      delete formats[name];
    }
  };

  tkt.options.formatBindingName = 'showAs';

  tkt.addFormaterIn = function (binding) {
    binding.addDataFormat = addDataFormat;
    binding.removeDataFormat = removeDataFormat;
    binding.update = (function (_super) {
      return function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
        var bindings = allBindingsAccessor ? allBindingsAccessor() : {}, format = unwrap(bindings[tkt.options.formatBindingName]);

        if (formats[format]) {
          valueAccessor = formats[format].bind(formats, unwrap(valueAccessor()), bindings);
        }
        _super(element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext);
      }
    })(binding.update);
  };

  var bindings = ['text', 'html'];
  ko.utils.arrayForEach(bindings, function (bindingName) {
    tkt.addFormaterIn(ko.bindingHandlers[bindingName]);
  });
})(ko, tkt);
