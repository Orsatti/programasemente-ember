import DS from 'ember-data';

export default DS.Model.extend({
    nome: DS.attr(),
    ano: DS.attr(),
    americano: DS.attr(),
    instituicaos: DS.hasMany('instituicao', { async: true }),
    plataformaConteudos: DS.hasMany('plataforma-conteudo', { async: true }),
    atividades: DS.hasMany('atividade', { async: true }),
    aulas: DS.hasMany('aulas', { async: true }),
    // plataformaAnoModulos: DS.hasMany('plataforma-conteudo', { async: true }),
});