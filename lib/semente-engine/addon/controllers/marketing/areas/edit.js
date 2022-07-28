import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),
  editando: true,
  pasta: Ember.computed('model', function(){
      let pasta = this.get('model.marketing').get('pasta');
      return this.get('store').peekRecord('pasta-marketing', pasta.get('id'));
  }),
  actions:{
    transitToArea(pastaId){
      this.transitionToRoute('marketing.areas.index', pastaId);
    }
  }
});
