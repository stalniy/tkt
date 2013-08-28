require(['ko'], function (ko) {
  ko.bindingHandlers.attrIf = {
      update: function (element, valueAccessor, allBindingsAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());
        if (ko.utils.unwrapObservable(binding._if)) {
          ko.bindingHandlers.attr.update(element, valueAccessor, allBindingsAccessor);
        } else {
          for (var attr in binding) {
            if (binding.hasOwnProperty(attr) && attr.charAt(0) != '_') {
              element.removeAttribute(attr);
            }
          }
        }
      }
  };
});
