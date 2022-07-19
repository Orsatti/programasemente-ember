import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    return RSVP.hash({
      // instituicao: this.get('store').peekRecord('instituicao', params.instituicao_id)
    });
  },
})