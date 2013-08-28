require(['ko', 'utils', 'jquery'], function (ko, utils, $) {
  function readValue(valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor()),
      data = { behaviors: [], options: {} };

    if (typeof value === 'string') {
      data.behaviors = value.split(',');
    } else {
      utils.extend(data.options, value);
      if (value.type) {
        data.behaviors = value.type.split(',');
        delete data.options.type;
      }
    }
    var i = data.behaviors.length;
    while (i--) {
      data.behaviors[i] = utils.trim(data.behaviors[i]);
    }

    return data;
  }

  function applyOptionsTo(viewModel, options) {
    viewModel.applyOptions && viewModel.applyOptions(options);
  }

  function applyBehaviorsTo(viewModel, behaviors) {
    for (var i = 0, c = behaviors.length; i < c; i++) {
      var behavior = behaviors[i];
      $.extend(viewModel, behavior);
      behavior.apply && behavior.apply(viewModel);
    }
  }

  function collectDependenciesFor(viewModel, data) {
    if (!viewModel.getType) {
      throw new Error("View model should implement 'getType' method. Unable to resolve dependecies: " + data.behaviors);
    }

    var depType = '@' + viewModel.getType().toLowerCase() + '/',
      deps = [];

    for (var i = 0, c = data.behaviors.length; i < c; i++) {
      deps.push(depType + utils.underscore(data.behaviors[i]));
    }
    return deps;
  }

  ko.bindingHandlers.actAs = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
      var data = readValue(valueAccessor),
        domNode = $(element);

      if (data.behaviors.length > 0) {
        var deps = collectDependenciesFor(viewModel, data);
        var isNodeWasVisible = domNode.is(':visible');
        isNodeWasVisible && domNode.hide();

        require(deps, function () {
          applyBehaviorsTo(viewModel, arguments);
          applyOptionsTo(viewModel, data.options);

          ko.applyBindingsToDescendants(bindingsContext, element);
          isNodeWasVisible && domNode.fadeIn('fast').css('display', '');
        });
        return { controlsDescendantBindings: true }
      } else if (data.options) {
        applyOptionsTo(viewModel, data.options);
      }
    }
  };
});
