import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),
    model: function(params) {
        var plataformaAno = this.get('store').peekRecord('plataforma-ano', params.platano_id);
        var competencias = this.get('store').findAll('comp');
        var calendarios = this.get('store').findAll('calendario');
        var newAula =  this.get('store').createRecord('aula');
        return RSVP.hash({
            newAula: newAula,
            plataformaAno: plataformaAno,
            competencias: competencias,
            calendarios: calendarios,
        });
    },
});