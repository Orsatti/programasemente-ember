import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),
    model: function(params) {
        var pasta = this.get('store').peekRecord('pasta-marketing', params.pasta_id);
        var areas = this.get('store').findAll('area-marketing', { reload: false });
        return RSVP.hash({
            pasta: pasta,
            areas: areas,
        });
    },
});
