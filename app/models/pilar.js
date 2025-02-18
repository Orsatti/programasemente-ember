import DS from 'ember-data';

export default DS.Model.extend({
    nome: DS.attr(),
    enabled: DS.attr(),
    show: DS.attr(),
    instituicaos: DS.belongsTo('instituicao', { async: true }),
});