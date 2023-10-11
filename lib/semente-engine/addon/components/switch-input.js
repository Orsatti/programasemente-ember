import Ember from 'ember'

export default Ember.Component.extend({
     actions: {
           checkS: function() {
              let checked = document.getElementById('sEnabled').checked;
              if (checked) {
                  document.getElementById('sPlusEnabled').disabled = false;
                  document.getElementById('essencialEnabled').disabled = false;
              } else {
                  document.getElementById('sPlusEnabled').checked = false;
                  document.getElementById('sPlusEnabled').disabled = true;

                  document.getElementById('essencialEnabled').checked = false;
                  document.getElementById('essencialEnabled').disabled = true;
              }
           } 
    }
})