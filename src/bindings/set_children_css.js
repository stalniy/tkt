(function (ko, $) {
  var cssBinding = ko.bindingHandlers.css;

  var binding = {
    options: {
      childIdentifierAttribute: 'data-name'
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var rules = valueAccessor(), updater;

      if (rules.call) {
        var value;
        var accessor = function () {
          return rules.call(viewModel, value)
        };
        updater = function (childElement) {
          value = binding.identifierOf(childElement);
          cssBinding.update(childElement, accessor);
        };
      } else {
        updater = function (childElement) {
          cssBinding.update(childElement, valueAccessor)
        };
      }

      $(['[', binding.options.childIdentifierAttribute , ']'].join(''), element).each(function (i, childElement) {
        updater(childElement);
      });
    },

    identifierOf: function (element) {
      return element.getAttribute(binding.options.childIdentifierAttribute);
    }
  };

  ko.bindingHandlers.setChildrenCss = binding;
})(ko, $);