import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),
    model() {
        let events = this.get('store').findAll('event');
        return RSVP.hash({
            events: events,
        });
    },
});
