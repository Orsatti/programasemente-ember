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
    selected_instituicao_filha: {
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
    this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-anos.segmento, plataforma-turmas.plataforma-ano, sistemas', reload: true});
    //QUANDO AP TIVER TURMA
    // if(params.instituicao_id != 2){
    //   this.get('store').findRecord('instituicao', 2, {include: 'plataforma-turmas.plataforma-ano, sistemas', reload: true});
    // }

    var params2 = {'segmento_id': null, 'plataformaano_id': null, 'plataforma_turma_id': null, 'instituicao_id': null};
    params2['segmento_id'] = params.selected_segmento_id;
    params2['plataformaano_id'] = params.selected_ano_id;
    params2['plataforma_turma_id'] = params.selected_turma_id;
    params2['instituicao_id'] = params.selected_instituicao_filha;
    var acomp = this.get('store').queryRecord('acompanhamento-plataforma', params2);
      
    params['instituicao_id'] = params.instituicao_id;
    params['page'] = params.page;
    params['str_search'] = params.str_search;
    params['selected_segmento_id'] = params.selected_segmento_id;
    params['selected_instituicao_filha'] = params.selected_instituicao_filha;
    params['selected_ano_id'] = params.selected_ano_id;
    params['selected_turma_id'] = params.selected_turma_id;
    params['disabled'] = true;
    var pessoas = this.findPaged('pessoa', params);

    return RSVP.hash({
      pessoas: pessoas,
      acompanhamento: acomp,
    });
  },
});


