import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model() {
    return RSVP.hash({
      plataformaConteudos: this.get('store').findAll('plataforma-conteudo', { include: 'publicos'}),
      plataformaAnos: this.get('store').findAll('plataforma-ano',{include:'segmento, aulas'}),
      agrupamentos: this.get('store').findAll('agrupamento', { include: 'temas'}),
      calendarios: this.get('store').findAll('calendario',{ reload: true}),
    });
    return this.get('store').findAll('plataforma-conteudo', { include: 'aulas.plataforma-ano.segmento, publicos, agrupamento.temas, calendarios', reload: true });
  },
});
