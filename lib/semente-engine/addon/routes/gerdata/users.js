import Route from '@ember/routing/route';
import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import RSVP from 'rsvp';

export default Route.extend(RouteMixin, {
  // optional. default is 10
  queryParams: {
    page: {
      refreshModel: true,
    },
    perPage: {
      refreshModel: true,
    },
    ordem: {
      refreshModel: true,
    },
    str_search: {
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
    },
    include: {
      refreshModel: false
    },
    reload: false
  },
  store: Ember.inject.service(),
  model: function (params) {
    this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-turmas.plataforma-ano, sistemas', reload: true})
    params['instituicao_id'] = params.instituicao_id;
    params['page'] = params.page;
    params['str_search'] = params.str_search;
    params['selected_segmento_id'] = params.selected_segmento_id;
    params['selected_ano_id'] = params.selected_ano_id;
    params['selected_turma_id'] = params.selected_turma_id;
    return this.findPaged('pessoa', params);
  },
});


