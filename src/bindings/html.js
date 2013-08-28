require(['ko'], function (ko) {
  ko.bindingHandlers.html = (function (oldHtml) {
    return {
      init: oldHtml.init,
      update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
        var allBindings = allBindingsAccessor(), context = allBindings.bindContext;

        if (context) {
          ko.utils.setHtml(element, '<div></div>');
          element = element.firstChild;
        }
        oldHtml.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext);
        context && ko.applyBindings(bindingsContext, element);
      }
    }
  })(ko.bindingHandlers.html);
});
