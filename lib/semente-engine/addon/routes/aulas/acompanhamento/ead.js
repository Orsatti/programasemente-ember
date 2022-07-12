import Route from '@ember/routing/route';
import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Route.extend(RouteMixin, {
  // optional. default is 10  
  queryParams: {
    instituicao_id: {
      refreshModel: true,
    },
    perPage: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
    ordem: {
      refreshModel: true,
    },
    str_search: {
      refreshModel: true,
    },
    selected_ano_id: {
      refreshModel: true,
    },
    selected_turma_id: {
      refreshModel: true,
    },
  },

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('str_search', '');
      controller.set('selected_ano_id', '');
      controller.set('selected_turma_id', '');
    }
  },

  store: Ember.inject.service(),
  beforeModel: function () {
    if (this.controller) this.controller.set('load_state', true);
  },
  model: function (params) {
    this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-turmas.plataforma-ano, turmas.acompanhamentos-atividade-turma', reload: true})
    params['instituicao_id'] = params.instituicao_id;
    params['include'] = 'acompanhamento-atividades';
    params['role'] = 'aluno';
    params['str_search'] = params.str_search;
    return this.findPaged('pessoa', params);
  },
  actions: {
    loading() {
      let controller = this.controllerFor('aulas.acompanhamento.ead');
      let rendered = document.querySelector('#report-people');
      if (!rendered) {
        controller.set('currentlyLoading', true);
        return true; // allows the loading template to be shown
      }
    }
  }
});
