import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),
    model: function(param) {
        var marketing = this.get('store').findRecord('marketing', param.marketing_id);
        var areas = this.get('store').peekAll('area-marketing');
        return RSVP.hash({
            marketing: marketing,
            areas: areas,
        });
    },
});
