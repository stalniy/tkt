(function (ko, $) {
  var unwrap = ko.utils.unwrapObservable;
  var scopes = {}, scopeCounter = {};

  ko.bindingHandlers.collapse = {
    init: function (node, accessor) {
      var options  = accessor(), domNode  = $(node);

      if (!unwrap(options.when)) {
        domNode.hide();
      }
      if (options.inScopeOf) {
        if (!ko.isObservable(options.when)) {
          throw new Error("Option 'when' should be an observable if 'inScopeOf' is specified");
        }
        toggleExpandedObservable(options);
        scopeCounter[options.inScopeOf] = scopeCounter[options.inScopeOf] || 0;
        scopeCounter[options.inScopeOf]++;
        ko.utils.domNodeDisposal.addDisposeCallback(node, function () {
          if (--scopeCounter[options.inScopeOf] === 0) {
            delete scopes[options.inScopeOf];
            delete scopeCounter[options.inScopeOf];
          }
        });
      }
    },

    update: function(node, accessor, allBindings, viewModel) {
      var domNode = $(node), options = accessor();
      var isOpened = unwrap(options.when);

      options.duration = options.duration || 300;

      if (typeof options.call == 'function' && isOpened) {
        callbackFor(viewModel, options.call).call(node);
      }

      if (typeof options.then == 'function') {
        options.then = callbackFor(viewModel, options.then);
      }

      if ('inScopeOf' in options && isOpened) {
        toggleExpandedObservable(options);
      }
      collapse(domNode, options);
    }
  };

  function callbackFor(viewModel, method) {
    return function () {
      var node = $(this), parentViewModel = ko.contextFor(node.get(0)).$parent;
      method.call(viewModel, node.children(':first-child'), parentViewModel, node);
    };
  }

  function toggleExpandedObservable(options) {
    var activeObservable = scopes[options.inScopeOf];
    if (activeObservable && ko.isObservable(activeObservable) && activeObservable != options.when) {
      activeObservable(false);
    }
    scopes[options.inScopeOf] = options.when;
  }

  function collapse(domNode, options) {
    domNode.stop(true, true);
    if (unwrap(options.when)) {
      domNode.slideDown(options.duration, options.then);
    } else if (domNode.is(':visible')) {
      domNode.slideUp(options.duration, options.then);
    }
  }
})(ko, jQuery);
