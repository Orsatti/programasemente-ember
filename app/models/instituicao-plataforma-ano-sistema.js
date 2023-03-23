import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    instituicao: DS.belongsTo('instituicao', { async: true }),
    plataformaAno: DS.belongsTo('plataforma-ano', { async: true }),
    sistema: DS.belongsTo('sistema', { async: true }),
});
