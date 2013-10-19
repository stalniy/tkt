This binding helps to display collapsed or accordion-like sections. Content of the node is shown with `jQuery.slideUp/slideDown` methods. For example ([plunker](http://plnkr.co/edit/uqMAny)):
```html
<section class="panel panel-default">
  <div class="panel-heading">
    <h4 data-bind="click: toggleDetails">Section</h4>
  </div>
  <div class="panel-body" data-bind="collapse:{ when: isDetailsOpened, then: callThisMethod }">
    content
  </div>
</section>

<script>
  var scope = {
    isDetailsOpened: ko.observable(false),
    toggleDetails:  function () {
      this.isDetailsOpened(!this.isDetailsOpened());
    },
    callThisMethod: function () {
      console.log("details are shown");
    }
  };
  ko.applyBindings(scope);
</script>
```

Only `when` parameter is required everything else is optional.
* `when` - boolean observable, when equals `true` the domNode is shown
* `then` - function which is called after the domNode becomes complitely visible (after slideUp/slideDown animation is finished)
* `call` - function which is called when binding receives `update` event
* `inScopeOf` - string which specify scope for collapsible sections. In this case only one section can be opened at one time (accordion behavior). Parameter can be any unique string for concrete group of sections.

Consider the next example ([plunker](http://plnkr.co/edit/s1BgZH)):
```html
<section class="panel panel-default">
  <div class="panel-heading">
    <h4 data-bind="click: toggleFirstDetails">Section 1</h4>
  </div>
  <div class="panel-body" data-bind="collapse:{ inScopeOf: 'items', when: isFirstDetailsOpened, then: callThisMethod }">
    content  1
  </div>
</section>
<section class="panel panel-default">
  <div class="panel-heading">
    <h4 data-bind="click: toggleSecondDetails">Section2</h4>
  </div>
  <div class="panel-body" data-bind="collapse:{ inScopeOf: 'items',  when: isSecondDetailsOpened, then: callThisMethod }">
    content  2
  </div>
</section>
```