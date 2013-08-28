(function (htmlBinding) {
  htmlBinding.update = (function (_super) {
    return function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
      var bindings = allBindingsAccessor();

      _super.apply(this, arguments);
      if (bindings.withContext) {
        ko.applyBindingsToDescendants(bindingsContext, element);
      }
    }
  })(htmlBinding.update);
})(ko.bindingHandlers.html);
