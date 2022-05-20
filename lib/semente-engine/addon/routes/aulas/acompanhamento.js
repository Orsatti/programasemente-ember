import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),
    model() {
        let person = JSON.parse(localStorage.getItem('person_logged'));
        if(person.role == 'admin'){
            return RSVP.hash({
                pessoa: this.get('store').findRecord('pessoa', person.id,
                {include: 'instituicao.plataforma-turmas.plataforma-ano, instituicao.plataforma-anos.segmento', reload: false}),
                instituicoes: this.get('store').findAll('instituicao'),
            });
        }
        else{
            return RSVP.hash({
                pessoa: this.get('store').findRecord('pessoa', person.id,
                {include: 'instituicao.plataforma-turmas.plataforma-ano, instituicao.plataforma-anos.segmento', reload: false}),
                instituicoes: this.get('store').query('instituicao', { instituicaoId: person.instituicao_id, reload: false }),
            });
        }
    }
});
