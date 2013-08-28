function (ko) {
  var unwrap = ko.utils.unwrapObservable;
  var formats = {
    price: function (v, options) {
      var sign = unwrap(options.priceSign) || "$";
      v = Number(v) || 0;

      if (v < 0) {
        v *= -1;
        sign = '- ' + sign;
      }

      return sign + v.toFixed('precision' in options ? options.precision : 2);
    },

    options: function (id, options) {
      var value = options.values[id];
      return id in options.values ? value : id;
    },

    noneIfEmpty: function (v, options) {
      return String(v || options.none || 'None');
    },

    float: function (v, options) {
      return parseFloat(String(v).replace(/,/g, '.').replace(/\s+/g, '')) || 0;
    },

    'int': function (v, options) {
      return parseInt(v, options.intBase || 10);
    },

    number: function (v) {
      return +v || 0;
    },

    percentage: function (v, options) {
      if (!isNaN(+v)) {
        return this.floatNumber(v).toFixed('precision' in options ? options.precision : 2) + '%'
      } else {
        return v
      }
    },

    boolIcon: function (v) {
      return '<span class="icon-' + (v ? 'check' : 'remove' ) + '"></span>';
    },

    bool: function (v) {
      return v ? 'Yes' : 'No';
    }
  };

  function addFormat(name, formatter) {
    formats[name] = formatter;
    return this;
  }

  function addFormaterIn(_super) {
    return {
      addFormat: addFormat,

      update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
        var bindings = allBindingsAccessor(), format = unwrap(bindings.showAs);

        if (formats[format]) {
          valueAccessor = formats[format].bind(formats, unwrap(valueAccessor()), bindings);
        }
        _super.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext);
      }
    }
  }

  var bindings = ['text', 'html'];
  ko.utils.arrayForEach(bindings, function (bindingName) {
    ko.bindingHandlers[bindingHandlers] = addFormaterIn(ko.bindingHandlers[bindingHandlers]);
  });
})(ko);
