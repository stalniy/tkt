if(!Array.isArray) {
  Array.isArray = function (object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  };
}

if (!String.prototype.trim) {
  var leading = /^\s+/, trailing = /\s+$/;
  String.prototype.trim = function () {
    return this.replace(leading, '').replace(trailing, '');
  };
}

if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length != 1) {
      throw new Error('Object.create implementation only accepts one parameter.');
    }

    function F(){}
    F.prototype = o;
    F.prototype.constructor = F;

    return new F();
  };
}
