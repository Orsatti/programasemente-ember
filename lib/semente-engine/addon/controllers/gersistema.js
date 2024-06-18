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
      let instList = this.get('model.instituicoes');
      let matchValue = document.getElementById('matchValue');

      if (matchValue != null) {
        if(this.get('statusAtual')){
          instList = instList.filterBy('status', this.get('statusAtual'));
        }

        if (matchValue.value) {
          let searchResult = instList.filter(function (i) {
            if ((i.data.name).toLowerCase().match(new RegExp((matchValue.value).toLowerCase(), 'g'))) {
              return i;
            }
          });
          this.set('matchInsts', searchResult);
        } else {
          let searchResult = instList;
          this.set('matchInsts', searchResult);
        }
      }
    },

    updateStatus(status){
      this.set('statusAtual', status);

      if (matchValue != null) {
        if (matchValue.value) {
          let inst = this.get('matchInsts');
          this.set('matchInsts', inst.filterBy('status', status));
        }
        else{
          let inst = this.get('model.instituicoes');
          this.set('matchInsts', inst.filterBy('status', status));
        }
      }
    },

    vazia() {
      console.log('ae');
    }

  }
})
