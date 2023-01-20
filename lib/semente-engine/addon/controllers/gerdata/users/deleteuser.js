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
        that.transitionToRoute('gerdata.users',  {queryParams:{instituicao_id:that.get('instituicao').get('id'), reload:true}});
      });
    } 
  }
})