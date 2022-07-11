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
      debugger;
      //changeset.set('enabled', false);
    }, 

  }
})