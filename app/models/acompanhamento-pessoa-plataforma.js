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
    nrConteudoAluno: DS.attr(),
    nrConteudoProfessor: DS.attr(),
    nrConteudoAlunoTotal: DS.attr(),
    nrConteudoProfessorTotal: DS.attr(),
});