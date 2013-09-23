(function (ko) {
  ko.bindingHandlers.hidden = {
    update: function (element, valueAccessor, allBindingsAccessor, scope) {
      var newAccessor = function () {
        return !ko.utils.unwrapObservable(valueAccessor());
      };

      ko.bindingHandlers.visible.update(element, newAccessor, allBindingsAccessor, scope);
    }
  };
})(ko);
