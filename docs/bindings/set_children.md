Binding "setChildrenCss"
===

This bindings allows to apply css binding to children of an element. It just helps to make your html more clean and decreases amount of bindings (each binding is a computed observable). For Example:
```html
<ul data-bind="setChildrenCss: classForField">
  <li data-name="field1">field 1</li>
  <li data-name="field2">field 2</li>
  <li data-name="field3">field 3</li>
</ul>
```
Method `clasForField` will be called for each `li` element and will receive value of `data-name` attribute as argument. Useful in combination with `on` binding:
```html
<table>
<thead>
  <tr data-bind="on:{ 'click th': 'orderBy', collected: 'data-name using shiftKey and toggle with desc' }, setChildrenCss: classForSortedField">
    <th data-name="name">Name</th>
    <th data-name="price">Price</th>
    <th data-name="createdAt">Created at</th>
  </tr>
</thead>
<tbody>....</tbody>
</table>
```
By default binding passes `data-name` attribute into specified method but this can be changed globally, for example:
```js
ko.bindingHandlers.setChildrenCss.elementToValue = function (element) {
  return element.id;
};
```