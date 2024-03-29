import DS from 'ember-data';

export default DS.Model.extend({
    instituicao: DS.belongsTo('instituicao', { async: true }),
    plataformaAno: DS.belongsTo('plataforma-ano', { async: true }),
    sistema: DS.belongsTo('sistema', { async: true }),
    isEssencial: DS.attr(),
});
