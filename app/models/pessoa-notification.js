import DS from 'ember-data';

export default DS.Model.extend({
    pessoa: DS.belongsTo('pessoa', { async: true }),
    notification: DS.belongsTo('notification', { async: true }),
    viewed: DS.attr(),
});