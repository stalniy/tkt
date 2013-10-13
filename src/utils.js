var tkt = {
  isValueBlank: function (value) {
    return typeof value === 'undefined'                 ||
      typeof value === 'string' && value.trim() === ""  ||
      typeof value === 'object' && tkt.isObjectEmpty(value) ||
      Array.isArray(value) && (value.length === 0 || typeof value[0] === 'undefined');
  },

  isObjectEmpty: function (object) {
    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  },

  capitalize: function (str) {
    return String(str || "").toUpperCase().substr(0, 1) + str.toLowerCase().substr(1);
  },

  camelize: function (str) {
    return str.replace(/[_-](\w)/g, function (match, letter) {
      return letter.toUpperCase();
    });
  },

  underscore: function (str) {
    return str.charAt(0).toLowerCase() + str.substr(1).replace(/[A-Z]/g, function (match) {
      return '_' + match;
    }).toLowerCase();
  }
};


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