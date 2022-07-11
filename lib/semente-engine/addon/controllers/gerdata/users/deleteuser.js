import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  instituicaoId: 0,
  instituicao:Ember.computed('model',function(){
    let id = this.get('model.pessoa').get('instituicao').get('id');
    if (id == null) id = this.get('instituicaoId');
    return this.get('store').peekRecord('instituicao', id);    
  }),

  actions: {
    delete: function () {
      let that = this;
      this.get('model.pessoa').destroyRecord().then(function () {
        that.transitionToRoute('gerdata.users',  that.get('instituicao').get('id'));
      });
    }, 

  }
})