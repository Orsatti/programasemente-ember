import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  appController: Ember.inject.controller('application'),
  session: Ember.inject.service(),
  rootURL: Ember.computed('appController', function () {
    let ac = this.get('appController');
    return ac.get('rootURL');
  }),
  logOut() {
    localStorage.clear();
    this.get('session').invalidate();
  }
});
