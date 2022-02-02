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
    dummy: {
      refreshModel: true,
    },
    ano1: {
      refreshModel: true,
    },
    ano2: {
      refreshModel: true,
    },
    ano3: {
      refreshModel: true,
    },
    pre: {
      refreshModel: true,
    },
    tur: {
      refreshModel: true,
    },
    selected_segmento_id: {
      refreshModel: true,
    },
    selected_ano_id: {
      refreshModel: true,
    },
    selected_turma_id: {
      refreshModel: true,
    },
    selected_instituicao_filha: {
      refreshModel: true,
    }
  },
  store: Ember.inject.service(),
  model: function(params) {
    // todo is your model name
    // returns a PagedRemoteArray
    if (params.instituicao_id)
    {
      return this.findPaged('pessoa', params);
    }
  },
});


