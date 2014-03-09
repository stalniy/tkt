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
    var params = { name: 'test', var1: true, var2: 'here' };
    ko.applyBindingsToNode(this.element, { partial: params });

    expect(this.bindingMethod.mostRecentCall.args[1]()).toEqual({
      name: params.name,
      data: { var1: params.var1, var2: params.var2 }
    });
  })

});

describe('"Partial" binding', function () {

  beforeEach(function () {
    this.element = document.createElement('div');
    document.body.appendChild(this.element);

    var templateBinding = ko.bindingHandlers.template;
    spyOn(templateBinding, 'init');
    spyOn(templateBinding, 'update');
  })

  describe('when is initialized', function () {
    beforeEach(function () {
      this.bindingMethod = ko.bindingHandlers.template.init;
    })

    includeExamplesFor('partial binding method');
  })

  describe('when is updated', function () {
    beforeEach(function () {
      this.bindingMethod = ko.bindingHandlers.template.update;
    })

    includeExamplesFor('partial binding method');
  })

});