require(['ko', 'jquery'], function (ko, $) {
  ko.bindingHandlers.bindFormWidgets = {
    update: function (element, valueAccessor) {
      var domNode = $(element);

      domNode.find('.dropdown-toggle').dropdown();
      domNode.find('.datepicker').datepicker({
        dateFormat: "mm/dd/yy"
      });
      domNode.find('input.datetimepicker-field, input.datetime, td.datetime input').datetimepicker({
        dateFormat: "mm-dd-yy",
        timeFormat: "hh:mm"
      });

      var sortableHolder = domNode.find('.sortable-list').sortable().parent();
      sortableHolder.on('click', '.add-sortable-btn', function (event) {
        var $select = $(this).siblings('select'), list = $(this).siblings('.sortable-list'),
          item = $select.find('option[value="' + $select.val() + '"]');

        event.stopPropagation();
        event.preventDefault();
        if (list.find('input[value="' + item.val() + '"]').length || !item.val()) {
          return true;
        }
        var fieldName = $(this).attr('data-field-name'),
          itemRow = $('<li class="ui-state-default"></li>').append("<a class='ui-icon ui-icon-close remove-btn' href='#'></a>")
            .append("<input type='hidden' name='" + fieldName + "' value='" + item.val() + "' />")
            .append("<span class='title'>" + item.text() + "</span>");

        list.append(itemRow);
        item.prop('disabled', true);
      });

      sortableHolder.on('click', '.remove-btn', function (event) {
        var item = $(this).parent('li'), value = item.find('input[type="hidden"]').val(),
          option = item.parents('.sortable-list').siblings('select').find('option[value="' + value + '"]');

        option.prop('disabled', false);
        item.remove();
        event.stopPropagation();
        event.preventDefault();
      });

      domNode.find('.control-slider').each(function(i, el){
        var $this = $(el), associatedInput = $this.find('input');

        $this.slider({
          min:    parseInt($this.data('min'))   || 1,
          max:    parseInt($this.data('max'))   || 10,
          step:   parseInt($this.data('step'))  || 1,
          value:  associatedInput.attr('value') || 5,
          change: function(event, ui) {
            associatedInput.val(ui.value);
          }
        });
      });
      domNode.find('.select_with_text.control-group').pricingInput();
      domNode.find('.taggable').each(function () {
        var node = $(this);
        node.tagsInput(node.data());
      });
    }
  };
});
