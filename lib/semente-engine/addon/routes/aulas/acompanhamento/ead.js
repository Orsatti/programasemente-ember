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
    tur: {
      refreshModel: true,
    },
    inst: {
      refreshModel: true,
    },
    anos: {
      refreshModel: true,
    }
  },

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('str_search', '');
      controller.set('inst', '');
      controller.set('anos', '');
      controller.set('tur', '');
    }
  },

  store: Ember.inject.service(),
  beforeModel: function () {
    if (this.controller) this.controller.set('load_state', true);
  },
  model: function (params) {
    //this.get('store').findRecord('instituicao', params.instituicao_id, { include: 'acompanhamentos-atividade-instituicao', reload: true });
    params['instituicao_id'] = params.instituicao_id;
    params['include'] = 'acompanhamento-atividades';
    params['role'] = 'aluno';
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
