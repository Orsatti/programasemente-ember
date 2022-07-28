import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model: function(params) {
    var newMarketing =  this.get('store').createRecord('marketing');
    var pasta = this.get('store').peekRecord('pasta-marketing', params.pasta_id);
    var areas = this.get('store').peekAll('area-marketing');
    return RSVP.hash({
        newMarketing: newMarketing,
        pasta: pasta,
        areas: areas,
    });
  },
});
