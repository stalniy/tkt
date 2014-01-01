## OOP syntax sugar

If you like to write your view models/models in classical OOP style then this part of documentation is for you!
This library provides simple and clear OOP support.
As everybody know everything extend Object in JavaScript, so it's logically that if we want to create a class-like object (constructor-function) we also extend Object.

For example
```js
var Section = Object.extend({
  initialize: function () {
    this.isVisible = ko.observable(false);
  },

  hide: function () {
    this.isVisible(false);
  },

  show: function () {
    this.isVisible(true);
  }
});

var section = new Section();

section.show();
```

If you need to extend section functionality it can be done easily:
```js
var Page = Section.extend({
  show: function () {
    this.load().then(function () {
      Section.prototype.show.call(this);
    }.bind(this));
  },

  load: function () {
    // get data from server
  }
})
```

### Mixins

Very often application has objects which behaves very similarly but logically they are not connected.
In such cases mixins can help. For example, if you have RESTful models (e.g. [jquery.rest](https://github.com/jpillora/jquery.rest))
it will be nice to have a general way how to work with them (shared CRUD functionality).
In this case you can create Resourceful mixin and then include it into different view models.
For example:

```js
var Resourceful = {
  setUp: function () {
    this.isLocked = ko.observable(false);

    this.lock   = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
  },

  lock: function () {
    return this.isLocked(true);
  },

  unlock: function () {
    return this.isLocked(false);
  },

  edit: function (item) {
    return this.lock()._edit(item).always(this.unlock);
  },

  build: function () {
    return this.lock()._build(item).always(this.unlock);
  }
};

// schema variable is schema of restful models (see jquery.rest)
var Product = Object.extend({
  include: [ Resourceful ],

  resources: {
    products: schema.products
  },

  initialize: function () {
    this.name = ko.observable();
    this.categoryId = ko.observable();
  },

  _updateAttributes: function (product) {
    this.id = product.id;
    this.name(product.name)
      .categoryId(product.categoryId);
  },

  _edit: function (product) {
    return this.resources.products.read(product.id).done(this._updateAttributes.bind(this))
  },

  _build: function () {
    // build new product
  }
})

```

It's possible to specify several mixins and if they have methods with the same name then will be used the method of first one.
Each mixin can have `setUp` method which is invoked for each instance of a class when it's created.