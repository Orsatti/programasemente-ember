import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  actions: {
    submit: function(){
    }
  },
});