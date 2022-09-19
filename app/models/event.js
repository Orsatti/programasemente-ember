import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    description: DS.attr(),
    link: DS.attr(),
    start: DS.attr(),
    end: DS.attr(),
});