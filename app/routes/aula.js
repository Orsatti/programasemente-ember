import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),

   model(id) {
    let person = JSON.parse(localStorage.getItem('person_logged'));
        let person_id = person.id;
        return RSVP.hash({
            pessoa: this.get('store').findRecord('pessoa', person_id, {include: 'tarefas, avaliacoes, annotacoes', reload: true}),
            aula: this.get('store').findRecord('aula', 1, {include: 'plataforma-ano.segmento, plataforma-conteudos.tema, plataforma-conteudos.publicos,'+
            ' plataforma-conteudos.agrupamento, competencias.dominio, competencias.quizes, competencias.normativas,' +
            ' atividade.secoes.conteudos.html, atividade.secoes.conteudos.quiz.questoes.alternativas, atividade.secoes.conteudos.video, aplicacoes-plataforma-aula', reload: true}),
        })
    },


    setupController(controller, model) {
        this._super(controller, model);

        controller.set('stopVideo', true);
        controller.set('selectedConteudo', null);
        controller.set('selectedAgrupamento', 'Básico');
      }
});
