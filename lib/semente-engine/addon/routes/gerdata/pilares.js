import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var inst = this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'pilares', reload: true});
    return RSVP.hash({
      instituicao: inst,
    });
  },
});