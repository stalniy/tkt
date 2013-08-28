require(['ko'], function (ko) {
  ko.extenders.changeable = function (target) {
    var isChanged = false, oldValue = null;
    target.subscribe(function(newValue){
      if (!isChanged){
        isChanged = true;
        oldValue  = this.target();
      }
    }, null, 'beforeChange');
    target.commit = function(){
      if (isChanged) {
        oldValue = null;
        isChanged = false;
      }
    };
    target.revert = function(){
      if (isChanged) {
        this(oldValue);
        oldValue = null;
        isChanged = false;
      }
    };
    target.isChanged = function(){ return isChanged };
    return target;
  };
});
