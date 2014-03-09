(function (ko) {
  var templateBinding = ko.bindingHandlers.template;

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
      params = ko.toJS(params);
      var name = params.name;

      if (name) {
        delete params.name;
      }

      params = { name: name, data: params };
    }

    return params;
  }
})(ko);