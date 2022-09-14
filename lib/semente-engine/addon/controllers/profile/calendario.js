import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  store: Ember.inject.service(),

  today: new Date(),
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  showCalendar: Ember.computed('model', function (){
    let year = this.get('year');
    let month = this.get('month');
    document.getElementById("year").value = year;
    document.getElementById("month").value = month;
    let firstDay = (new Date(year, month)).getDay();
    
    let tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";

    let date = 1;
    let today = this.get('today');
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        var days = (32 - new Date(year, month, 32).getDate());
        if (i === 0 && j < firstDay) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode("");
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        else if (date > days){
          break;
        } 
        else {
            let cell = document.createElement("td");
            let cellText = document.createTextNode(date);
            if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                cell.classList.add("bg-info");
            }
            cell.appendChild(cellText);
            row.appendChild(cell);
            date++;
        }
      }
      tbl.appendChild(row); 
    }
  }).property('year', 'month'),

  actions: {
    goToAulas(){
      window.history.back();
    },

    jump() {
      this.set('year', document.getElementById("year").value);
      this.set('month', document.getElementById("month").value);
    }
  }
});
