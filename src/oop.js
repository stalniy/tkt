(function (tkt) {
  Object.extend = classExtend;

  function classExtend(defs) {
    var
      parent = this.prototype,
      initializer = this,
      constructor = defs.initialize || function () { initializer.apply(this, arguments) },
      prototype   = Object.create(parent)
    ;

    if (defs.initialize) {
      delete defs.initialize;
    }

    if (defs.include) {
      includeMixinsIn(prototype, defs.include);
      delete defs.include;
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

  function includeMixinsIn(proto, mixins) {
    mixinIfUndefined(proto, mixins).setUpMixins = function () {
      var i = mixins.length;

      while (i--) {
        mixins[i].setUp && mixins[i].setUp.call(this);
      }
    };
    return proto;
  }

  function mixinIfUndefined(object, mixins) {
    for (var i = 0, count = mixins.length; i < count; i++) {
      tkt.mixinIfUndefined(object, mixins[i]);
    }
    return object;
  }
})(tkt);