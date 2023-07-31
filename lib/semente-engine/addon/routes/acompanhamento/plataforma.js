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
      selected_start_date: {
        refreshModel: true,
      },
      selected_end_date: {
        refreshModel: true,
      },
      reload: false
    },

    model: function(params) {
      this.get('store').findRecord('instituicao', params.instituicao_id, {include: 'plataforma-anos.segmento, plataforma-turmas.plataforma-ano, sistemas', reload: true});

      params['segmento_id'] = params.selected_segmento_id;
      params['plataformaano_id'] = params.selected_ano_id;
      params['plataforma_turma_id'] = params.selected_turma_id;
      params['instituicao_id'] = params.instituicao_id;
      params['start_date'] = params.selected_start_date;
      params['end_date'] = params.selected_end_date;

      var inst = this.get('store').peekRecord('instituicao', params.instituicao_id);
      var selectedSegmento;
      if(params.selected_segmento_id == null){
        let listaSegmentos = [];
        inst.get('plataformaAnos').forEach(pa => {
          var listaIds = listaSegmentos.map(x => x.get('id'));
          if(listaIds.indexOf(pa.get('segmento').get('id')) == -1){
            listaSegmentos.push(pa.get('segmento'));
          }
        });
        var firstObject = listaSegmentos.sort(function(a, b){ return a.get('id') - b.get('id') }).get('firstObject');
        if(firstObject == null){
          var segmentos = this.get('store').peekAll('segmento').sortBy('idx');
          firstObject = segmentos.get('firstObject');
        }
        params['segmento_id'] = firstObject.get('id');
        selectedSegmento = firstObject;
      }else{
        selectedSegmento = this.get('store').peekRecord('segmento', params.selected_segmento_id);
      }
      
      var acomp = this.get('store').queryRecord('acompanhamento-plataforma', params);
      return RSVP.hash({
        instituicao: inst,
        acompanhameto: acomp,
        selectedSegmento: selectedSegmento,
      });
    },
});
