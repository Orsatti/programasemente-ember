import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  pessoaLogged: Ember.computed('model', function () {
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  actions: {
    goToMarketings(areaid) {
      this.transitionToRoute('marketing.areas.filter', {
        queryParams: {
          pasta_id: this.get('model.pasta').get('id'),
          area_id: areaid,
        }
      });
    },
  }
});
