Binding "on": event delegation
===

This binding was created in case to use a power of delegated events. It uses `jQuery.on` method and have almost the same syntax.
For example, we have a huge list of items and we want to have an ability to remove items from it. The simplest solution is to apply `click` binding on anchor tag inside each item. But when list is very big such approach will create a big amount of event handlers which are actually odd because identical. So, it had better apply only one binding on parent element and listen to events' bubbling.
It's possible to do using `on` binding:
```html
<ul data-bind="on:{ 'click .remove': 'removeItem' }, foreach: hugeList">
  <li>
    <span data-bind="text: name"></span>
    <a href="#" class="remove">remove</a>
  </li>
</ul>
```
`removeItem` method will be searched over all contexts starting from `$data`. So, it means that out parent view model should have method `removeItem`.
```js
var vm = {
  hugeList: ko.observableArray(
    { id: 1, name: 'test' },
............................
    { id: 200, name: 'test 200' }
  ),

  removeItem: function (item) {
    this.hugeList.remove(item);
  }
};
```
In case when method isn't found an exception will be raised.

### Custom arguments

By default `on` binding passes current and parent contexts into called method (`$data` and `$parent`). But this can be easily changed. For example, we want to pass `data-id` attribute into our event handler:
```html
<ul data-bind="on:{ 'click .remove': 'removeItemBy', data: 'id' }, foreach: hugeList">
  <li>
    <span data-bind="text: name"></span>
    <a href="#" class="remove" data-bind="attr:{ 'data-id': id }">remove</a>
  </li>
</ul>
```
In this case we pass only one argument which will be taken from `data-id` attribute. Actually binding will first check data attribute if such exists it will be used but if not, it checks regular attribute (in our case `id`).

It's also possible to pass all data attributes as an object into method. In this case you need to pass asterisk into `data` option.
```html
<ul data-bind="on:{ 'click li': 'doSomethingWith', data: '*' }, foreach: hugeList">
.................
</ul>
```

There is one more predefined option for passing custom attributes into event handler, it's called `collected`. Useful in cases when you need to collect some data with help of `shiftKey`, `ctrlKey` or `altKey`. For example, sorting by multiple fields:
```html
<table>
  <thead>
    <tr data-bind="on:{ '[data-name]': 'orderBy', collected: 'data-name using shiftKey and toggle with asc or desc'">
      <th data-name="name">Name</th>
      <th data-name="price">Price</th>
      <th data-name="createdAt">Created at</th>
    </tr>
  </thead>
  <tbody>.....</tbody>
</table>
```
So, in this case our event handler will be called with different number of arguments. If user holds `shiftKey` all clicked th's `data-name` attributes will be collected with toggled suffixes (`-asc` or `-desc`). So, when user just clicks on `th` and doesn't hold `shiftKey` method will be called only with one argument (`name-asc` or `name-desc`, `price-ask` or `price-desc`, etc).

Value for `collected` option has special template: `#{attributeName} using #{buttonName} and toggle with #{one} or #{another}`. Section `and toggle with ...` is optional and may be omitted; also `or #{another}` part may be omitted and in this case suffix will be added or removed.  In case if you want to change value-suffix separator just change an option in binding:
```js
ko.bindingHandlers.on.options.toggleValueSeparator = "_";
```

It's also possible to add your own options. For example:
```js
ko.bindingHanders.on.valueDefs.custom = function (element, context, event) {
  console.log(this.value); // passed option value

  return // one argument or if you want to pass few return an array
};
```
So, option's definition is just a function which receives 3 arguments: domNode element which triggers event, binding context and event object. `this.value` holds a passed into option value. So, our custom option can be used like this:
```html
<ul data-bind="on:{ 'click li': 'doSomething', custom: 'my value' }, foreach: hugeList">
........................
</ul>
```