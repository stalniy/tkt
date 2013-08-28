require(['ko', 'jquery'], function (ko, $) {
  var escaper = $('<div />');
  var ViewBuilder = {
    _escapeHtml: function (html) {
      escaper.text(html);
      var escapedHtml = escaper.html()
        .replace(/ /g, '&nbsp;')
        .replace(/[\n\r]+/g, '<br>');
      return escapedHtml;
    },
     _getCheckboxOrRadioText: function(item) {
      var node = item.get(0), text = node.checked;

      $.each(['nextSibling', 'previousSibling'], function (i, type) {
        if (node[type] && node[type].nodeType == 3 && $.trim(node[type].nodeValue)) {
          text = node[type].nodeValue;
        }
      });

      return text;
    },
    _getItemFormat: function(item, value) {
      var format = item.data('format');

      if (format) {
        return format;
      }

      if (value === false || value === true) {
        return 'booleanValue';
      }

      switch (item.get(0).type) {
        case 'number':
          format = 'floatNumber';
          break;
        default:
          format = 'noneIfEmpty';
      }

      return format;
    },
    _getItemValue: function(item) {
      var value = item.val(), node = item.get(0);
      if (item.is('select')) {
        value = [];
        item.find('option:selected').each(function () {
          value.push($(this).text());
        });
      } else if (item.is('[type="radio"]')) {
        value = this._getCheckboxOrRadioText(item);
      } else if (item.is('[type="checkbox"]')) {
        value = this._getCheckboxOrRadioText(item);
      }

      return value;
    },
    _getForms: function(domNode) {
      return domNode.find('form.edit_form');
    },
    build: function (domNode) {
      var builder = this;
      builder._getForms(domNode).find('div.controls [name]:input').each(function () {
        var item = $(this);

        if (!item.hasClass('for-edit-mode')) {
          var view = builder.buildItemFor(item.closest('.control-group'), item);

          if (!view) {
            return true;
          }

          view.holder.children().each(function (i, item) {
            item = $(item);
            !item.hasClass('for-all-modes') && item.addClass('for-edit-mode');
          });
          view.holder.append('<div class="for-view-mode formatted-value" />');

          var holder = view.holder.children('div.for-view-mode.formatted-value').get(0);
          if (view.format == 'html') {
            ko.applyBindingsToNode(holder, { html: view.data });
          } else {
            ko.applyBindingsToNode(holder, {
              text: view.data,
              textFormat: { type: view.format, options: view.options }
            });
          }
        }
      });
      return this;
    },

    buildItemFor: function (group, item) {
      if (group.data('view_created?')) {
        return false;
      }

      var type = group.data('show-as'), view;
      if (!type) {
        view = this.buildSimple(item);
      } else {
        var method = 'build' + type.charAt(0).toUpperCase();
        method += type.slice(1).replace(/_(\w)/g, function (match, letter) {
          return letter.toUpperCase();
        });

        if (!this[method]) {
          console.log('Unknown widget type: ', type);
          return false;
        }
        view = this[method](item);
      }
      view && group.data('view_created?', true);
      return view;
    },

    buildFilemanager: function (item) {
      var img = item.siblings('.file_path, img').addClass('for-all-modes').last(),
        text = '';

      if (!img.is('img')) {
        text = item.is('input.file_manager[type="text"]')
          ? ['<a href="', item.val(), '">', item.val(), '</a>'].join('')
          : 'No Image'
      }

      return {
        data: text,
        holder: item.parent(),
        format: 'html'
      };
    },

    buildSlider: function (item) {
      return {
        data: this._getItemValue(item),
        holder: item.parent().parent(),
        format: 'number'
      };
    },

    buildSelectWithText: function (item) {
      var builder = this, holder = item.closest('.controls-holder'), value, hint;

      hint = ' ' + item.next().next().text();
      value = holder.find('select').map(function (i, item) {
        item = $(item);
        return [builder._getItemValue(item)[0], builder._getItemValue(item.next())].join(': ');
      });

      return {
        data: value.toArray().join(hint + '<br>') + hint,
        holder: holder.parent(),
        format: 'html'
      };
    },

    buildOrderedArray: function (item) {
      var value = item.siblings('.sortable-list').find('.title').map(function () {
        return $(this).text();
      });

      return {
        data: value.toArray().join('<br>'),
        holder: item.parent(),
        format: 'html'
      };
    },

    buildPrettyHtml: function (item) {
      var html = '<pre class="prettyprint"><code class="language-html">' +
        prettyPrintOne(this._escapeHtml(item.val()), 'html') +
      '</code></pre>';

      return {
        data:   html,
        holder: item.parent(),
        format: 'html'
      };
    },

    buildPrettyCss: function (item) {
      var html = '<pre class="prettyprint"><code class="language-css">' +
        prettyPrintOne(this._escapeHtml(item.val()), 'css') +
      '</code></pre>';

      return {
        data:   html,
        holder: item.parent(),
        format: 'html'
      };
    },

    buildMultiSelect: function (item) {
      var builder = this, value;
      value = item.parent().parent().find('input[type="checkbox"]').map(function () {
        var node = $(this);
        if (node.attr('checked') == 'checked') {
          return builder._getItemValue(node);
        }
      });

      return {
        data: value.toArray().join('<br>'),
        holder: item.parent().parent(),
        format: 'html'
      };
    },

    buildSimple: function (item) {
      if (item.is('[type="hidden"]')) {
        return false;
      }

      var parent = item.parent(), value = this._getItemValue(item),
        isCheckbox = item.is('[type="checkbox"]'), node = item.get(0),
        isRadio = item.is('[type="radio"]');

      if (isCheckbox || isRadio) {
        // process radio or checkbox group
        if (parent.is('label')) {
          item = parent;
          parent = item.parent();
        }

        var group = isRadio
          ? parent.find('input[type="radio"][name="' + node.name + '"]')
          : parent.find('input[type="checkbox"]');

        if (!node.checked) {
          if (group.is(':checked') || group.last().get(0) != node) {
            return false;
          } else if (group.size() > 1) {
            value = "";
          }
        }
      }

      return {
        data: value,
        holder: parent,
        options: item.data('options'),
        format: this._getItemFormat(item, value)
      };
    }
  };

  ko.bindingHandlers.formAsView = {
    update: function (element, valueAccessor) {
      ViewBuilder.build($(element));
    }
  };
});
