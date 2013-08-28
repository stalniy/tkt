require(['ko'], function (ko) {
  var cssBinding = ko.bindingHandlers.css;

  ko.bindingHandlers.cssForChildren = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var rules = ko.utils.unwrapObservable(valueAccessor());
      var children = ko.utils.arrayFilter(element.childNodes, function (child) {
        return child.nodeType == 1;
      });

      var updater;
      if (rules.call) {
        rules = rules.bind(viewModel);
        updater = function (child) {
          var nodeName = child.getAttribute('data-name');
          cssBinding.update(child, function () { return rules(nodeName) });
        };
      } else {
        updater = function (child) { cssBinding.update(child, valueAccessor) };
      }
      ko.utils.arrayForEach(children, updater);
    }
  };
});
