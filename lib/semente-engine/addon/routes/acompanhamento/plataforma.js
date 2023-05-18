import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';

export default Route.extend({
    store: Ember.inject.service(),
    queryParams: {
      selected_segmento_id: {
        refreshModel: true,
      },
      selected_ano_id: {
        refreshModel: true,
      },
      selected_turma_id: {
        refreshModel: true,
      },
      instituicao_id: {
        refreshModel: true,
      },
    },

    model(params) {
      debugger;
      var inst = this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-turmas.plataforma-ano, plataforma-anos.segmento', reload: true});
      return RSVP.hash({
          instituicao: inst,
      });
      // params['segmento_id'] = params.selected_segmento_id;
      // params['plataformaano_id'] = params.selected_ano_id;
      // params['plataforma_turma_id'] = params.selected_turma_id;
      // params['instituicao_id'] = params.instituicao_id;
      // return this.get('store').queryRecord('acompanhamento-plataforma', params);
    }
});
