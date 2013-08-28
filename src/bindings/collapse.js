require(['ko', 'jquery', 'utils'], function (ko, $, utils) {
  function callbackFor(viewModel, method) {
    return function () {
      var node = $(this), parentViewModel = ko.contextFor(node.get(0)).$parent;
      method.call(viewModel, node.children(':first-child'), parentViewModel, node);
    };
  }

  var scopes = {};
  function setExpandedObservable(options) {
    scopes[options.inScopeOf] = options.when;
  }

  function getExpandedObservable(options) {
    return scopes[options.inScopeOf];
  }

  function toggleExpandedObservable(options) {
    var activeObservable = getExpandedObservable(options);
    if (activeObservable && ko.isObservable(activeObservable) && activeObservable != options.when) {
      activeObservable(false);
    }
    setExpandedObservable(options);
  }

  function collapse(domNode, options) {
    domNode.stop(true, true);
    if (options.when) {
      domNode.slideDown(options.duration, options.then);
    } else if (domNode.is(':visible')) {
      domNode.slideUp(options.duration, options.then);
    }
  }

  ko.bindingHandlers.slideVisible = {
    init: function (node, accessor, allBindings, viewModel) {
      var
        options  = accessor(),
        isOpened = ko.utils.unwrapObservable(options.when),
        domNode  = $(node);

      if (!isOpened) {
        domNode.hide();
      } else if (options.inScopeOf) {
        setExpandedObservable(options);
      }
    },

    update: function(node, accessor, allBindings, viewModel) {
      var
        domNode = $(node),
        realOptions = accessor(),
        options = ko.utils.extend(ko.toJS(realOptions), {
          duration: 300
        });

      if (options.when && typeof options.call == 'function') {
        callbackFor(viewModel, options.call).call(node);
      }

      if (typeof options.then == 'function') {
        options.then = callbackFor(viewModel, options.then);
      }

      if (options.inScopeOf && options.when) {
        toggleExpandedObservable(realOptions);
      }
      collapse(domNode, options);
    }
  };
});
