(function (ko) {
  ko.bindingHandlers.actAs = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingsContext) {
      var data = readValue(valueAccessor), binding = ko.bindingHandlers.actAs;

      if (data.behaviors.length > 0) {
        var deps = collectDependenciesFor(viewModel, data);

        binding.beforeRequire(deps, element, viewModel);
        binding.require(deps, function () {
          applyBehaviorsTo(viewModel, arguments);
          applyOptionsTo(viewModel, data.options);

          ko.applyBindingsToDescendants(bindingsContext, element);
          binding.afterRequire(deps, element, viewModel);
        });
        return { controlsDescendantBindings: true }
      } else if (data.options) {
        applyOptionsTo(viewModel, data.options);
      }
    },

    require: function (depsList) {
      throw "not implemented";
    },

    beforeRequire: function (deps, element) {
      element.style.display = 'none';
    },

    afterRequire: function (deps, element) {
      element.style.display = '';
    }
  };

  function readValue(valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor()),
      data = { behaviors: [], options: {} };

    if (typeof value === 'string') {
      data.behaviors = value.split(',');
    } else {
      ko.utils.extend(data.options, value);
      if (value.type) {
        data.behaviors = value.type.split(',');
        delete data.options.type;
      }
    }

    return data;
  }

  function applyOptionsTo(viewModel, options) {
    viewModel.applyOptions && viewModel.applyOptions(options);
  }

  function applyBehaviorsTo(viewModel, behaviors) {
    for (var i = 0, c = behaviors.length; i < c; i++) {
      var behavior = behaviors[i];
      ko.utils.extend(viewModel, behavior);
      behavior.apply && behavior.apply(viewModel);
    }
  }

  function collectDependenciesFor(viewModel, data) {
    if (!viewModel.getType) {
      throw new Error("View model should implement 'getType' method. Unable to resolve dependecies: " + data.behaviors);
    }

    var depType = viewModel.getType().toLowerCase() + '/', deps = [];
    for (var i = 0, c = data.behaviors.length; i < c; i++) {
      deps.push(depType + tkt.underscore(data.behaviors[i].trim()));
    }
    return deps;
  }
})(ko);
