Usually there is a need to pre-format data before displaying. For example, view model fetches list of products from server, each product has a price field and this field in view should be displayed with `$` sign and with precision 2.
Data formatting is more related to the view than to the view model, so it's not a good thing to create computed observable for price field for each product, moreover it's a bit expensive in case if you have a list of 100 items.
In such case custom formatters become very useful.  You can use a regular `text` and `html` bindings as usually, for specifying format you use `showAs` option (option can be observable):
```html
<ul data-bind="foreach: products">
  <li>
    <span data-bind="text: name"></span>
    <span data-bind="text: price, showAs: 'price', priceSign: '$'"></span>
  </li>
</ul>
```

So, there are few predefined formatters:
* **price**
  Has 2 options: `priceSign` and `precision`. Default value for `priceSign` is `$` and for `precision` is `2`.
* **options**
  Has only one parameter `values` - an object of pairs (key => value)
* **noneIfEmpty**
  Has one option `none` - string value which is displayed in case if value is falsy. By default equals "None".
* **float**
  Parses value using `parseFloat` replaces commas with dots. Has only one parameter `precision` which by default equals `2`
* **int**
  Parses value using `parseInt`. Has only one parameter `intBase`, by default `intBase = 10`. Returns 0 if value is falsy
* **number**
  Parses value using `Number`, returns 0 if value is falsy
* **percentage**
  Parses value using `float` formatter and appends `%` suffix. Returns value if is `NaN`
* **boolIcon**
  Returns `<span class="icon-check"></span>` if value is truthy and `<span class="icon-unckeck"></span>` if value is falsy.
* **bool**
  Returns `Yes/No` if value is truthy or falsy accordingly.

### Custom formatters

It's possible to override or add custom formatters:
```js
ko.bindingHandlers.text.addFormat('custom', function (value, options) {
  // do something here and return formatted value
});
```
Formatter receives 2 arguments: value (unwrapped value of `text` or `html` binding) and options (all bindings on current element). It should return formatted value which will be displayed to the end user. Formatters are shared across `text` and `html` bindings.