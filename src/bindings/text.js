require(['ko', 'jquery'], function (ko, $) {
  var viewFormats = {
    price: function (v, sign) {
      sign = sign || "$";
      v = Number(v) || 0;

      if (v < 0) {
        v *= -1;
        sign = '- ' + sign;
      }

      return sign + v.toFixed(2);
    },
    datetime: function (v, pattern) {
      if (!v) {
        return '-';
      }
      var value = jQuery.trim(v).match(/^(\d{4})-(\d{2})-(\d{1,2})T(\d{1,2}):(\d{2})/i),
        date, time;
      if (value) {
        date = [value[2], value[3], value[1]],
        time = value.slice(4);

        return date.reverse().join('-') + ' ' + time.join(':');
      }
      return v;
    },
    hash: function (v, options, element) {
      var values = {};
      jQuery(element).parent().find('select[data-bind] option').each(function () {
        values[this.value] = jQuery(this).text();
        return values;
      });

      return values[v] ? values[v] : v;
    },
    noneIfEmpty: function (v, text, element) {
      if (v.push) {
        v = v.join(", ");
      }
      return String(v || text || 'None');
    },
    floatNumber: function (v) {
      return parseFloat(String(v).replace(/,/g, '.').replace(/\s+/g, '')) || 0;
    },
    number: function (v) {
      return Number(v) || 0;
    },
    percentage: function (v) {
      if (Number(v)) {
        return viewFormats.floatNumber(v).toFixed(2) + '%'
      } else {
        return v
      }
    },
    booleanValue: function (v) {
      return '<span class="icon-' + (v ? 'check' : 'remove' ) + '"></span>';
    },
    yesNo: function (v) {
      return v ? 'Yes' : 'No';
    }
  };
  ko.bindingHandlers.text = (function(oldText) {
    return {
      update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
        var bindings = allBindingsAccessor(), textFormat = bindings.textFormat,
          formatType = textFormat && (textFormat.type || textFormat),
          accessor   = valueAccessor(),
          value = ko.utils.unwrapObservable(accessor);

        if (viewFormats[formatType]) {
          value = viewFormats[formatType].bind(this, value, textFormat.options, element);
          if (formatType == 'booleanValue') {
            ko.bindingHandlers.html.update(element, value, allBindingsAccessor, viewModel, bindingsContext);
          } else {
            oldText.update(element, value);
          }
        } else {
          oldText.update(element, valueAccessor);
        }

        if (accessor && accessor.useFormat) {
          accessor.useFormat(formatType);
        }
      }
    }
  })(ko.bindingHandlers.text);
});
