(function (ko) {
  var cssBindingUpdate = ko.bindingHandlers.css.update;
  var classesKey = '_tkt_css_classes';

  ko.bindingHandlers.css.update = function (element, valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor());
    if (typeof value == "object") {
      cssBindingUpdate(element, valueAccessor);
    } else {
      value = String(value || '');
      ko.utils.toggleDomNodeCssClass(element, element[classesKey], false);
      element[classesKey] = value;
      ko.utils.toggleDomNodeCssClass(element, value, true);
    }
  };
})(ko);