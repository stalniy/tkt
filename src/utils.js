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
    return str.replace(/[ _-](\w)/g, function (match, letter) {
      return letter.toUpperCase();
    });
  },

  underscore: function (str) {
    return str.charAt(0).toLowerCase() + str.substr(1).replace(/[A-Z]/g, function (match) {
      return '_' + match;
    }).toLowerCase();
  },

  mixin: function (it, from, filter) {
    for (var prop in from) {
      if (from.hasOwnProperty(prop)) {
        if (!filter || filter(from[prop], prop)) {
          it[prop] = from[prop];
        }
      }
    }
    return it;
  },

  mixinAll: function (target) {
    for (var i = 1, count = arguments.length; i < count; i++) {
      tkt.mixin(target, arguments[i]);
    }
    return target;
  },

  mixinIfUndefined: function (it, from) {
    return tkt.mixin(it, from, function (value, prop) {
      return !(prop in it);
    });
  },

  mixinPublic: function (it, from) {
    return tkt.mixin(it, from, function (value, prop) {
      return prop.charAt(0) !== '_';
    });
  },

  valueLocationIn: function (object, path) {
    var segments = path.split('.'),
        cursor = object,
        segment;

    for (var i = 0, c = segments.length - 1; i < c; ++i) {
      segment = segments[i];
      cursor = cursor[segment] = cursor[segment] || {};
    }

    return {
      cursor : cursor,
      field  : segments[i]
    }
  }
};