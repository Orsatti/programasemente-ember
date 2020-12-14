import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    nameFormat: Ember.computed('name', function() {
        if (this.get('name') == 'aluno') return 'Alunos'
        else if (this.get('name') == 'responsavel') return 'Responsáveis'
        else if (this.get('name') == 'instrutor') return 'Professores'
    }),
    descricao: DS.attr(),
    conteudo: DS.hasMany('plataforma-conteudo', { async: true }),
});