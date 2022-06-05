import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  pessoaLogged: Ember.computed('model', function () {
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  aulasController: Ember.inject.controller('aulas'),
  matchInsts: Ember.computed('model', function() {
    return this.get('model.instituicoes');
  }),

  actions: {
    filterInst() {
      let modelInstList = document.getElementById('modelInstList');
      let matchDisplay = document.getElementById('matchDisplay');
      let matchValue = document.getElementById('matchValue');
      let instList = this.get('model.instituicoes');

      if (matchValue != null) {

        if (matchValue.value) {
          let searchResult = instList.filter(function (i) {
            if ((i.data.name).toLowerCase().match(new RegExp((matchValue.value).toLowerCase(), 'g'))) {
              return i;
            }
          });
          this.set('matchInsts', searchResult);
          modelInstList.style.display = 'none';
          matchDisplay.style.display = 'block';
        } else {
          let searchResult = instList;
          this.set('matchInsts', searchResult);
          matchDisplay.style.display = 'block';
          modelInstList.style.display = 'none';
        }
      }
    },
  }
})
