import Ember from 'ember'

export default Ember.Component.extend({
     actions: {
           checkSPlus: function() {
              let checked = document.getElementById('sEnabled').checked;
              if (checked) {
                  document.getElementById('sPlusEnabled').disabled = false;
              } else {
                  document.getElementById('sPlusEnabled').checked = false;
                  document.getElementById('sPlusEnabled').disabled = true;
              }
           } 
    }
})