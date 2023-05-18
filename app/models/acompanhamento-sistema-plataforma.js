import DS from 'ember-data';

export default DS.Model.extend({
    sistema: DS.belongsTo('sistema', { async: true }),
    nrAlunos: DS.attr(),
    nrProfessoresAplicadores: DS.attr(),
    nrProfessoresNaoAplicadores: DS.attr(),
    nrProfessores: DS.attr(),
    nrSecretarias: DS.attr(),
    nrMarketings: DS.attr(),
    nrCooredenadores: DS.attr(),
    nrGestores: DS.attr(),
});