import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  pessoaLogged: Ember.computed('model', function () {
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa', infosLogged.id);
  }),

  actions: {
    goToAreas(pastaId) {
      this.transitionToRoute('marketing.areas.index', pastaId);
    },
    create(){
      let list = document.getElementById("pasta-list");
      const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
      let name = "Nova Pasta " + alphabet[list.children.length - 1];

      let pastaObj = this.get('store').createRecord('pasta-marketing',{
         'name': name,
         'image': 'invite',
      });
      pastaObj.save();
   },
  }
});
