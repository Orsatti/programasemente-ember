import DS from 'ember-data';

export default DS.Model.extend({
    acompanhamentoPessoasPlataforma: DS.hasMany('acompanhamento-pessoa-plataforma', { async: true }),
    acompanhamentoSistemasPlataforma: DS.hasMany('acompanhamento-sistema-plataforma', { async: true }),
    nrAlunos: DS.attr(),
    nrProfessores: DS.attr(),
    nrSecretarias: DS.attr(),
    nrMarketings: DS.attr(),
    nrCooredenadores: DS.attr(),
    nrGestores: DS.attr(),
});