import DS from 'ember-data';

export default DS.Model.extend({
    titulo: DS.attr(),
    filename: DS.attr(),
    idx: DS.attr(),
    tipo: DS.attr(),
    videoUrl: DS.attr(),
    arquivoUrl: DS.attr(),
    path: DS.attr(),
    thumbnail: DS.attr(),
    thumbnailname: DS.attr(),
    aulas: DS.hasMany('aula', { async: true }),
    agrupamento: DS.belongsTo('agrupamento', { async: true }),
    tema: DS.belongsTo('tema', { async: true }),
    publicos: DS.hasMany('publico', { async: true }),
    situacao: DS.attr('boolean'),
    calendarios: DS.hasMany('calendario', {async: true}),
    dataCriacao: DS.attr("date"),
    descricao: DS.attr(),
    indicacao: DS.attr(),
    indicacaoUrl: DS.attr(),
    indicacaoDescricao: DS.attr(),
});