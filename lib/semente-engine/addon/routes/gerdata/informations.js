import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    debugger
    var inst = this.get('store').peekRecord('instituicao', params.instituicao_id);
      return RSVP.hash({
        instituicao: inst,
      });
  },
});