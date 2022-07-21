import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    if (!localStorage.getItem('person_logged')) {
      this.transitionTo('index');
    }
    let person = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').peekRecord('pessoa', person.id);
    if (!pessoa){
      this.get('store').findRecord('pessoa', person.id);
    }
    return RSVP.hash({
      // instituicao: this.get('store').peekRecord('instituicao', params.instituicao_id)
    });
  },
})