import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    idx: DS.attr(),
    tableOrder: DS.attr(),
    sigla: DS.attr(),
    dominio: DS.belongsTo('dominio', { async: true }),
    quizesComp: DS.hasMany('quiz-comp', { async: true }),
    aulas: DS.hasMany('aula', { async: true }),
    atividades: DS.hasMany('atividade', { async: true }),
    //normativas: DS.hasMany('normativa', { async: true }),
});
