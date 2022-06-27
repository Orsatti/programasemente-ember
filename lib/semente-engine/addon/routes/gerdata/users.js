import Route from '@ember/routing/route';
import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Route.extend(RouteMixin, {
  // optional. default is 10
  queryParams: {
    instituicaoId: {
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
    },
    include: {
      refreshModel: false
    },
    reload: false
  },
  store: Ember.inject.service(),
  model: function(params) {
    var inst = this.get('store').peekRecord('instituicao', params.instituicao_id);
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));

    return this.findPaged('pessoa', infosLogged.id);
  },
});


