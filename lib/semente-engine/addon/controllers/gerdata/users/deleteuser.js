import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  instituicao:Ember.computed('model',function(){
    let id = this.get('model.pessoa').get('instituicao').get('id');
    return this.get('store').peekRecord('instituicao', id);    
  }),

  actions: {
    delete: function () {
      let that = this;
      let pessoa = this.get('store').peekRecord('pessoa', this.get('model.pessoa').get('id'));
      pessoa.destroyRecord().then(function () {
        var params = {'instituicao_id': null, 'perPage': null, 'page': null, 'ordem': null, 'str_search': null, 'selected_segmento_id': null, 'selected_instituicao_filha': null, 'selected_ano_id': null, 'selected_turma_id': null, 'disabled': null};
        params['instituicao_id'] = that.get('instituicao').get('id');
        params['perPage'] = 10;
        params['page'] = 1;
        params['ordem'] = 'az';
        params['disabled'] = true;
        that.transitionToRoute('gerdata.users', { queryParams: params });
      });
    } 
  }
})