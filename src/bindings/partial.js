(function (ko) {
  var templateBinding = ko.bindingHandlers.template;
  var reservedOptions = 'name afterRender afterAdd beforeRemove as if foreach'.split(' ');

  ko.bindingHandlers.partial = {
    init: function (element, valueAccessor) {
      var params = extractArguments(valueAccessor());
      valueAccessor = function () { return params };

      return templateBinding.init.apply(this, arguments);
    },

    update: function (element, valueAccessor) {
      var params = extractArguments(valueAccessor());
      valueAccessor = function () { return params };

      return templateBinding.update.apply(this, arguments);
    }
  };

  function extractArguments(params) {
    if (typeof params === 'object' && params !== null) {
      var templateParams = {};
      params = tkt.mixin({}, params);
      ko.utils.arrayForEach(reservedOptions, function (option) {
        if (option in params) {
          templateParams[option] = params[option];
          delete params[option];
        }
      });

      templateParams.data = params;
      params = templateParams;
    }

    return params;
  }

  ko.virtualElements.allowedBindings.partial = true;
})(ko);