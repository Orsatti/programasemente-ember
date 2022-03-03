import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ENV from '../config/environment';
import Ember from 'ember';

export default Route.extend(AuthenticatedRouteMixin, {
  env: ENV.APP,
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  rootURL: ENV.rootURL,
  envnmt: ENV.APP,
  goToStepTwo: false,
  userName: null,
  afterModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('/webapp');
    }
  },
});
