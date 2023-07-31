import DS from 'ember-data';

export default DS.Model.extend({
    acompanhamentoPessoasPlataforma: DS.hasMany('acompanhamento-pessoa-plataforma', { async: true }),
    acompanhamentoSistemasPlataforma: DS.hasMany('acompanhamento-sistema-plataforma', { async: true }),
    acompanhamentoAtividadesPlataforma: DS.hasMany('acompanhamento-atividade-instituicao', { async: true }),
    nrAlunos: DS.attr(),
    nrProfessores: DS.attr(),
    nrSecretarias: DS.attr(),
    nrMarketings: DS.attr(),
    nrCoordenadores: DS.attr(),
    nrGestores: DS.attr(),
    professoresFiltered: DS.attr(),
    alunosFiltered: DS.attr(),
});