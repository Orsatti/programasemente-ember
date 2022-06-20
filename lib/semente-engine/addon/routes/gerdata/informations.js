import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var inst = this.get('store').peekRecord('instituicao', params.instituicao_id);
    debugger;
    var s = inst.get('sistemas').find((x) => { return x.get('idx') === 2 });
    if (s) {
      inst.set('sEnabled', true);
    }
      return RSVP.hash({
        instituicao: inst,
      });
  },
});