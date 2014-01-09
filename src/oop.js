(function (tkt) {
  Object.extend = classExtend;

  function classExtend(defs) {
    var
      parent = this.prototype,
      initializer = defs.initialize || this,
      prototype = Object.create(parent),
      constructor = function () {
        if (this._invokeMixins) {
          this._invokeMixins('setUp');
        }
        initializer.apply(this, arguments);
      }
    ;

    if (defs.include) {
      var mixins = defs.include;
      mixinIfUndefined(prototype, mixins);
      delete defs.include;
      prototype._invokeMixins = function (method) {
        if (parent._invokeMixins) {
          parent._invokeMixins.call(this, method);
        }

        var i = mixins.length;

        while (i--) {
          mixins[i][method] && mixins[i][method].call(this);
        }
      };
    }

    constructor.prototype = tkt.mixin(prototype, defs);
    constructor.prototype.constructor = constructor;
    constructor.extend  = classExtend;
    constructor.include = classInclude;

    return constructor;
  }

  function classInclude() {
    mixinIfUndefined(this.prototype, arguments);
    return this;
  }

  function mixinIfUndefined(object, mixins) {
    for (var i = 0, count = mixins.length; i < count; i++) {
      tkt.mixinIfUndefined(object, mixins[i]);
    }
    return object;
  }
})(tkt);
