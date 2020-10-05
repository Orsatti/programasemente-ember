import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  router: Ember.inject.service('-routing'),
  store: Ember.inject.service(),
  tagName: 'li',



  actions: {
    transitToAula() {
      this.transit(this.get('aula.id'));
    }
  },
  init: function () {
    this._super();
    //this.get('value');
  }
});