Simple and useful
===

There are several simple bindings which allows to make your markup more readable.

### Hidden

Hidden binding is just a reversed version of standard `visible` binding. So, instead of writing:
```html
<div data-bind="visible: !hasRows()">There is no rows</div>
```
you can write:
```html
<div data-bind="hidden: hasRows">There is no rows</div>
```
Which is more clean and readable.

### Css

It was added in case to support older version of knockout (< 2.2) in which `css` binding doesn't allow to pass string as an argument. It allows to return classes for an element dynamically based on different conditions:
```html
<table>
<thead>
  <tr>
    <th data-bind="css: classForField('name')">Name</th>
    <th data-bind="css: classForField('price')">Price</th>
  </tr>
</thead>
....
</table>
```
And view model:
```js
var vm = {
  classForField: function (name) {
    if (something1 && somethingelse) {
      return 'active';
    }
    return 'disabled';
  }
};
```

### HTML

`html` binding is a bit customized, now it accepts option `withContext: true` which means that current viewmodel should be applied on the updated html each time when html is changed.
```html
<div data-bind="html: content, withContext: true"></div>
```
and view model:
```js
var vm = {
  name: ko.observable('test'),
  content: ko.observable(),
  requestContent: function () {
    $.ajax(url).done(function (template) {
      // template: <div data-bind="text: name"></div>
      vm.content(template);
    });
  }
};
vm.requestContent();
```

### Stop applying bindings

In cases when you want to preserve a part of html from applying bindings you can use `stopBinding`.
```html
<div data-bind="stopBinding: true"> my content which shouldn't use current context</div>
```

### Partial

`partial` binding implements more readable interface for `template` binding. For example:
```html
<div data-bind="partial: { name: 'my.template', var1: 1, var2: 2 }"></div>
```
have the same effect as:
```html
<div data-bind="template: { name: 'my.template', data: { var1: 1, var2: 2 } }"></div>
```