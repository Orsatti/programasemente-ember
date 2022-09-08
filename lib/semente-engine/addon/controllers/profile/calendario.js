import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  store: Ember.inject.service(),

  actions: {
    goToAulas(){
      window.history.back();
    },
  }
});
