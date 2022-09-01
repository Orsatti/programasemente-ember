import DS from 'ember-data';

export default DS.Model.extend({
    text: DS.attr(),
    start: DS.attr(),
    end: DS.attr(),
});