import Controller from '@ember/controller';
import Ember from 'ember';
import ENV from '../../config/environment';

export default Controller.extend({
  rootURL: ENV.rootURL,
  envnmt: ENV.APP,
  store: Ember.inject.service(),
  areas: Ember.computed('model', function(){
    return this.get('store').peekAll('area-marketing')
  }),
  selectedAreaName: 'Todos',
  queryParams: ["area_id"],
  itens: Ember.computed('model', function(){
    return this.get('model');
  }),

  itensDescSorted: Ember.computed('model', function(){
    let sorted = this.get('model').sortBy('dataAtualizacao').reverse();
    return sorted;
    }),


  selectedArea: Ember.computed('model', function(){
    if (this.get('area_id') != ''){
      let area = this.get('areas').filterBy('id', this.get('area_id'))[0];
      this.set('selectedAreaName', area.get('name'));
    } else this.set('selectedAreaName', 'Todos');
    return this.get('area_id');
  }).property('area_id'),
  pessoaRole: Ember.computed('', function(){
    let person_read = JSON.parse(localStorage.getItem('person_logged'));

    // let person = this.get('store').peekRecord('pessoa', person_read.id);
    let personRole = person_read.role;
    return personRole;
  }),

  selectedItemId:0,

  actions: {
    goToCreateItem() {
      this.transitionToRoute('marketing.create');
    },
    refreshSelectedArea(selectedAreaId){
      this.set('area_id', selectedAreaId);
    },
    goToEditItem(itemId) {
      this.transitionToRoute('marketing.edit', itemId);
    },
    removeItem(){
      let areaid = this.get('area_id');
      let itens = this.get('model');
      let itemId = this.get('selectedItemId');

      itens.forEach(i => {
        if(i.get('id') == itemId){
          let deleted = i.get('deleted');
          i.set('deleted', true);
          i.save().then(() => {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            document.getElementById('confirm_modal').classList.remove('modal--is-show');
            document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
            this.get('store').unloadRecord(i);
          });
        }
      });
    },
    openModal(itemId) {
      this.set('selectedItemId', itemId);
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      document.getElementById('confirm_modal').classList.add('modal--is-show');
      document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    },
    cancelRemove() {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
      document.getElementById('confirm_modal').classList.remove('modal--is-show');
      document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    },
  },
  init: function(){
    this._super();
  }

});
