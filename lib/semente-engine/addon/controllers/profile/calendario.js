import Controller from '@ember/controller';
import Ember from 'ember';
import DateFormat from '../../helpers/dateFormat';

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  store: Ember.inject.service(),

  hasEvent: false,
  selectedDay: 0,

  today: new Date(),
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  showCalendar: Ember.computed('model', function (){
    let year = this.get('year');
    let month = this.get('month');
    document.getElementById("year").value = year;
    document.getElementById("month").value = (month + 1);
    let firstDay = (new Date(year, month)).getDay();
    
    let weeks = [];
    let date = 1;
    let today = this.get('today');
    for (let i = 0; i < 6; i++) {
      let week = {
        days: []
      };
      for (let j = 0; j < 7; j++) {
        var days = (32 - new Date(year, month, 32).getDate());
        if (i === 0 && j < firstDay) {
            week.days.push({
              value: "",
              today: false
          });
        }
        else if (date > days){
          break;
        } 
        else {
          if (date == today.getDate() && year == today.getFullYear() && month == today.getMonth()) {
            week.days.push({
              value: date,
              today: true
            });
          } 
          else
          {
            week.days.push({
              value: date,
              today: false
            });
          }
          date++;
        }
      }
      weeks.push(week);
    }
    this.set("weeks", weeks);
  }).property('year', 'month'),

  todayEvents: Ember.computed('model', function (){
    this.send("eventsInDate", this.get('today').getDate());
  }),

  actions: {
    goToAulas(){
      this.set('hasEvent', false);
      window.history.back();
    },

    jump() {
      this.set('year', document.getElementById("year").value);
      this.set('month', (document.getElementById("month").value - 1));
      this.set('hasEvent', false);
    },

    eventsInDate(day){
      if(day != ""){
        let selectedDate = day + "/" + document.getElementById("month").value + "/" + document.getElementById("year").value;
        if(document.getElementById("month").value < 10){
          selectedDate = day + "/0" + document.getElementById("month").value + "/" + document.getElementById("year").value;
        }
        let eventsList = [];
        let events = this.get('model.events');
        events.forEach(e => {
          if(e.get('date') == selectedDate) eventsList.pushObject(e)        
        });
  
        if(eventsList.length > 0){
          this.set('hasEvent', true);
          this.set('events', eventsList);
        }else{
          this.set('hasEvent', false);
        }
  
        if(this.get('selectedDay') != 0){
          document.getElementById('day' + this.get('selectedDay')).classList.remove('selected-date');
        }
        document.getElementById('day' + day).classList.add('selected-date')
        this.set('selectedDay', day);
      }
    }
  }
});
