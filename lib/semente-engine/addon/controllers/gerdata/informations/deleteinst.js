import Controller from '@ember/controller';
import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),

    instituicao: Ember.computed('model',function(){
        return this.get('model.instituicao');
    }),
    
    actions: {
        delete: function () {
            let that = this;
            this.get('model.instituicao').set('enabled', false);
            this.get('model.instituicao').set('deleted', true);
            this.get('model.instituicao').save().then(function () {
              that.transitionToRoute('gersistema');
            });
          }, 
    }
})