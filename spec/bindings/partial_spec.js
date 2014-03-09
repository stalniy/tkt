sharedExamplesFor('partial binding method', function () {
  it ('passes arguments as is into template binding methods if passed value is primitive', function () {
    ko.applyBindingsToNode(this.element, { partial: 'test' });
    expect(this.bindingMethod.mostRecentCall.args[1]()).toBe('test');
  })

  it ('passes arguments as is into template binding methods if passed value is primitive observable', function () {
    var partial = ko.observable();
    ko.applyBindingsToNode(this.element, { partial: partial });

    expect(this.bindingMethod.mostRecentCall.args[1]()).toBe(partial);
  })

  it ('converts passed object for template binding', function () {
    var fn = function () {};
    var params = { name: 'test', var1: true, var2: 'here', 'if': true, afterRender: fn };
    ko.applyBindingsToNode(this.element, { partial: params });

    expect(this.bindingMethod.mostRecentCall.args[1]()).toEqual({
      name: params.name,
      data: { var1: params.var1, var2: params.var2 },
      'if': true,
      afterRender: fn
    });
  })

});

describe('"Partial" binding', function () {
  var templateBinding;

  beforeEach(function () {
    this.element = document.createElement('div');
    document.body.appendChild(this.element);

    templateBinding = ko.bindingHandlers.template;
    spyOn(templateBinding, 'init');
    spyOn(templateBinding, 'update');
  })

  describe('when "init" method is called', function () {
    beforeEach(function () {
      this.bindingMethod = ko.bindingHandlers.template.init;
    })

    includeExamplesFor('partial binding method');

    it ('receives the same arguments as "update" method', function () {
      var params = { name: 'test', var1: 1, var2: 2 };
      ko.applyBindingsToNode(this.element, { partial: params });

      expect(templateBinding.init.mostRecentCall.args[1]()).toEqual(templateBinding.update.mostRecentCall.args[1]());
    })
  })

  describe('when "update" method is called', function () {
    beforeEach(function () {
      this.bindingMethod = ko.bindingHandlers.template.update;
    })

    includeExamplesFor('partial binding method');
  })

});