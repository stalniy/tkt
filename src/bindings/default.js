require(['ko', 'jquery'], function (ko, $) {
  ko.bindingHandlers.stopBinding = {
    init: function () {
      return { controlsDescendantBindings : true }
    }
  };

  ko.bindingHandlers.change = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var method = valueAccessor(),
        newValueAccessor = function () {
          return {
            change: method
          }
        };

      return ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, viewModel)
    }
  };

  (function (_super) {
    var html = {}, counter = 0;

    function getElementId(element) {
      if (!element.__ko__updateIfNotNull_id) {
        element.__ko__updateIfNotNull_id = ++counter
      }

      return element.__ko__updateIfNotNull_id;
    }

    ko.bindingHandlers.updateIfNotNull = {
      init: function (element, valueAccessor) {
        var id = getElementId(element);

        var result = _super.init.apply(this, arguments);
        if (typeof html[id] != "undefined") {
          return result;
        }
      },

      update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
        var id = getElementId(element),
          hasInitiatedHtml = !(typeof html[id] == "undefined" || html[id] === null);

        if (ko.utils.unwrapObservable(valueAccessor()) !== null) {
          _super.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext);
        } else if (hasInitiatedHtml) {
          _super.update(element, function () { return html[id] }, allBindingsAccessor, viewModel, bindingsContext);
        }

        if (!hasInitiatedHtml) {
          // remember initiated html
          html[id] = element.innerHTML;
        }
      }
    };
  })(ko.bindingHandlers.html);

  ko.bindingHandlers.notVisible = {
    update: function (element, valueAccessor) {
      var value = !ko.utils.unwrapObservable(valueAccessor());
      ko.bindingHandlers.visible.update(element, function () { return value });
    }
  };
});
