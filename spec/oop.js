describe("OOP syntax sugar", function () {
  it ("defines 'extend' method for Object", function () {
    expect(Object.extend).toBeDefined()
  })

  describe("when extends new object", function () {
    var Child;
    beforeEach(function () {
      Child = Object.extend({
        testMethod: function () {}
      });
    })

    it ("can generate instances", function () {
      expect(new Child).toBeInstanceOf(Child);
    })

    it ("has defined 'constructor' property inside prototype", function () {
      expect(Child.prototype.constructor).toBe(Child);
    })

    it ("has defined 'extend' method", function () {
      expect(Child.extend).toBe(Object.extend);
    })

    it ("defines 'include' method", function () {
      expect(Child.include).toBeDefined();
    })

    it ("can mix objects' functionality using 'include' method", function () {
      Child.include({ newMethod: function (){} });

      expect(new Child().newMethod).toBeDefined();
    })

    it ("can be extended", function () {
      var Descendant = Child.extend({});
      expect(new Descendant().testMethod).toBe(new Child().testMethod);
    })

    it ("can be initialized by custom 'initialize' method", function () {
      var initializer = jasmine.createSpy("initialize method");
      var Descendant = Child.extend({
        initialize: initializer
      });
      var instance = new Descendant;
      expect(initializer).toHaveBeenCalled()
    })

    it ("initializes by parent 'initialize' method if doesn't have own one", function () {
      var parentInitializer = jasmine.createSpy("parent initializer");
      var Parent = Object.extend({ initialize: parentInitializer });
      var Child  = Parent.extend({ myCustomMethod: function(){} });

      var instance = new Child();
      expect(parentInitializer).toHaveBeenCalled();
    })
  })

  describe("when 'include' property is specified", function () {
    var mixin, anotherMixin, oneMoreMixin, Child;
    beforeEach(function () {
      mixin = {
        setUp      : jasmine.createSpy("setUp method of mixin"),
        testMethod : jasmine.createSpy("method of mixin")
      };

      anotherMixin = {
        setUp      : jasmine.createSpy("setUp method of anotherMixin"),
        testMethod : jasmine.createSpy("method of anotherMixin")
      };

      oneMoreMixin = {
        method: jasmine.createSpy("method of oneMoreMixin")
      };

      Child = Object.extend({
        include: [ mixin, anotherMixin, oneMoreMixin ],

        method : function () {}
      });
    })

    it ("mixes all objects from this directive", function () {
      expect(new Child().testMethod).toBeDefined();
    })

    it ("defines setUpMixins method", function () {
      expect(new Child().setUpMixins).toBeDefined();
    })

    it ("calls setUp method of each mixin when setUpMixins is called", function () {
      var instance = new Child;

      instance.setUpMixins();
      expect(mixin.setUp).toHaveBeenCalled();
      expect(anotherMixin.setUp).toHaveBeenCalled();
    })

    it ("uses method of the first mixin if few of them has methods with the same name", function () {
      expect(new Child().testMethod).toBe(mixin.testMethod);
    })

    it ("doesn't let mixins override own methods", function () {
      expect(new Child().method).not.toBe(oneMoreMixin.method);
    })
  })
})