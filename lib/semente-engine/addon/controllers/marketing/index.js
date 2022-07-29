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
    edit(pasta){
      document.getElementById('pasta' + pasta.get('id')).contentEditable = true;
      document.getElementById('icon-edit' + pasta.get('id')).style.display = 'none';
      document.getElementById('icon-x' + pasta.get('id')).style.display = 'block';
      document.getElementById('icon-save' + pasta.get('id')).style.display = 'block';
    },
    cancelEdit(pasta){
        document.getElementById('pasta' + pasta.get('id')).contentEditable = false;
        document.getElementById('pasta' + pasta.get('id')).value = pasta.get('name');
        document.getElementById('pasta' + pasta.get('id')).innerText = pasta.get('name');
        document.getElementById('icon-edit' + pasta.get('id')).style.display = 'block';
        document.getElementById('icon-x' + pasta.get('id')).style.display = 'none';
        document.getElementById('icon-save' + pasta.get('id')).style.display = 'none';
    },
    saveEdit(pasta){
        let newName = document.getElementById('pasta' + pasta.get('id')).innerText;
        pasta.set('name', newName);
        pasta.save();
        this.send('cancelEdit', pasta);
    }
  }
});
