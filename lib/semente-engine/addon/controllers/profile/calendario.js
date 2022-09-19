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
    this.send("eventsInDate", this.get('today').getDate(), 'true');
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

    eventsInDate(realDay, firstLoad){
      if(day != ""){
        var day = realDay;
        if(day < 10) day = "0" + day;
        let month = document.getElementById("month").value;
        if(month < 10) month = "0" + month; 
        let selectedDate = day + "/" + month + "/" + document.getElementById("year").value;
        
        let eventsList = [];
        let events = this.get('model.events');
        events.forEach(e => {
          let end = new Date(e.get('end') * 1000);
          let dataEnd = (end.getDate()) + '/' + (end.getMonth() + 1) + '/' + end.getFullYear();
          let dataEnd_a = moment(dataEnd, "DD/MM/YYYY").format('DD/MM/YYYY');
          if(firstLoad == 'true'){
            if(dataEnd_a >= selectedDate) eventsList.pushObject(e);
          }
          else{
            let start = new Date(e.get('start') * 1000);
            let dataStart = (start.getDate()) + '/' + (start.getMonth() + 1) + '/' + start.getFullYear();
            let dataStart_a = moment(dataStart, "DD/MM/YYYY").format('DD/MM/YYYY');
            if(dataEnd_a >= selectedDate && dataStart_a <= selectedDate) eventsList.pushObject(e);
          }
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
        document.getElementById('day' + realDay).classList.add('selected-date')
        this.set('selectedDay', realDay);
      }
    }
  }
});
