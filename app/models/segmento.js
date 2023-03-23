import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    idx: DS.attr(),
    titulo: DS.attr(),
    descricao: DS.attr(),
    plataformaAnos: DS.hasMany('plataforma-ano', {
        async: true
    })
});