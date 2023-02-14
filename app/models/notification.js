import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    text: DS.attr(),
    link: DS.attr(),
    start: DS.attr(),
    end: DS.attr(),
});