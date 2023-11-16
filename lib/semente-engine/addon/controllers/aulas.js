import Controller from '@ember/controller';
import Ember from 'ember';
export default Controller.extend({
  role: JSON.parse(localStorage.getItem('person_logged')).role,
  store: Ember.inject.service(),
  oneInst: Ember.computed('model.pessoa', 'role', function () {
    let inst = this.get('model.pessoa').get('instituicao');
    this.set('inst_selected', inst);
    return true;
  }),

  checkWarn: Ember.computed('model', function() {
       
    const maintenanceNotice = document.getElementById("warn__container");

    // Verifique se o cookie "maintenance-notice-closed" está definido
   
   if (new Date() < new Date(1700967600000)) { // new Date("26 November 2023").getTime();
     if (Cookies.get("maintenance-notice-closed")) {
       maintenanceNotice.style.display = "none"; // Oculta o aviso se o cookie existir
     } else {
       maintenanceNotice.style.display = "flex"; // Mostra o aviso se o cookie não existir
     }
   }

  }),


  plataformaAnos: Ember.computed('model.pessoa', function () {
    return this.get('store').peekAll('plataforma-ano')
  }),

  selectedSegmento: Ember.computed('model.pessoa', function () {
    return this.get('plataformaAnos').get('firstObject.segmento.titulo');
  }),

  selectedAno: Ember.computed('model.pessoa', function () {
    return this.get('plataformaAnos').filterBy('segmento.titulo', this.get('selectedSegmento')).get('firstObject.name');
  }),

  session: Ember.inject.service('session'),
  showHeader: Ember.run.schedule('afterRender', function () {
    $('body').removeClass('no-header');
  }),
  thisRoute: Ember.run('render', function () {
    if (window.location.pathname.includes('aulas')) {
      return 'aulas';
    }
  }),
  store: Ember.inject.service(),
  pessoa: Ember.computed('model.pessoa', function () {
    return this.get('model.pessoa');
  }),


  segmentosObjects: Ember.computed('model.pessoa', function () {
    var segmentos = this.get('plataformaAnos').mapBy('segmento');
    return segmentos.filter((value, index) => segmentos.mapBy('titulo').indexOf(value.get('titulo')) === index);
  }),

  actions: {
    invalidateSession: function () {
      localStorage.clear();
      this.get('session').invalidate();
    },
  },
});
