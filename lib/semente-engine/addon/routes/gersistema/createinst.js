import Route from '@ember/routing/route';
import Ember from 'ember';

export default Route.extend({
  store: Ember.inject.service(),
  model: function() {
      var newInst =  this.get('store').createRecord('instituicao');
      return newInst;
  },
});