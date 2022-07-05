import Controller from '@ember/controller';
import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),

    instituicao: Ember.computed('model',function(){
        return this.get('model.instituicao');
    }),
    
    actions: {
        submit: function () {
            let instituicao = this.get('model');
            debugger;
        },
    }
})