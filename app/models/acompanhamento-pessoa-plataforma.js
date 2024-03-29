import DS from 'ember-data';

export default DS.Model.extend({
    pessoa: DS.belongsTo('pessoa', { async: true }),
    conteudoPessoa: DS.belongsTo('conteudo-pessoa', { async: true }),
    nrVideosPreparacao: DS.attr(),
    nrVideosAlunos: DS.attr(),
    nrTarefasAlunos: DS.attr(),
    nrAplicacaoPlataformaAulas: DS.attr(),
    acessos: DS.attr(),
    ultimoacesso: DS.attr(),
    role: DS.attr(),
    name: DS.attr(),
    userName: DS.attr(),
    lastAccess: Ember.computed('ultimoacesso', function() {
        return moment(this.get('ultimoacesso'), 'X').format('DD/MM/YYYY');
    }),
    nrConteudoVideoAluno: DS.attr(),
    nrConteudoVideoProfessor: DS.attr(),
    nrConteudoVideoOutro: DS.attr(),
    nrConteudoVideoAlunoTotal: DS.attr(),
    nrConteudoVideoProfessorTotal: DS.attr(),
    nrConteudoVideoOutroTotal: DS.attr(),
    nrConteudoDocumentoAluno: DS.attr(),
    nrConteudoDocumentoProfessor: DS.attr(),
    nrConteudoDocumentoOutro: DS.attr(),
    nrConteudoDocumentoAlunoTotal: DS.attr(),
    nrConteudoDocumentoProfessorTotal: DS.attr(),
    nrConteudoDocumentoOutroTotal: DS.attr(),
});