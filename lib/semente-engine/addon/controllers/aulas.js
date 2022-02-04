import Controller from '@ember/controller';
import Ember from 'ember';
export default Controller.extend({
  role: JSON.parse(localStorage.getItem('person_logged')).role,
  store: Ember.inject.service(),
  oneInst: Ember.computed('model', 'role', function () {
    let inst = this.get('model').get('instituicao');
    this.set('inst_selected', inst);
    return true;
  }),

  selectedDependente: Ember.computed('model', function () {
    let toggleRole;
    if (localStorage.getItem('toggleRole')) {
      toggleRole = localStorage.getItem('toggleRole');
    } else {
      toggleRole = this.get('toggleRole');
    }

    let person = JSON.parse(localStorage.getItem('person_logged'));
    let id = person.id;
    if (toggleRole == 'responsavel') {
      id = this.get('store').peekRecord('pessoa', id).get('dependentes.firstObject.id');
    }
    let pessoaDep = this.get('store').peekRecord('pessoa', id);
    return pessoaDep
  }),

  toggleRole: Ember.computed('model', function () {
    if (localStorage.getItem('toggleRole')) {
      return localStorage.getItem('toggleRole')
    }
    // localStorage limpo:
    let role = this.get('model.role');
    if (role == 'admin' || role == 'instrutor' || role == 'coordenador' || role == 'gestor' || role == 'diretor') {
      localStorage.setItem('toggleRole', 'instrutor');
      return 'instrutor'
    } else {
      localStorage.setItem('toggleRole', role);
    }
    return role
  }),

  plataformaAnos: Ember.computed('model', function () {
    return this.get('store').peekAll('plataforma-ano')
  }),

  selectedSegmento: Ember.computed('model', function () {
    return this.get('plataformaAnos').get('firstObject.segmento.titulo');
  }),

  selectedAno: Ember.computed('model', function () {
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
  pessoa: Ember.computed('model', function () {
    return this.get('model');
  }),


  segmentosObjects: Ember.computed('model', function () {
    if (this.get('role') !== 'admin') {
      var segmentos = this.get('model.plataformaAnos').mapBy('segmento');
      return segmentos.filter((value, index) => segmentos.mapBy('titulo').indexOf(value.get('titulo')) === index);
    }
    var segmentos = this.get('plataformaAnos').mapBy('segmento');
    return segmentos.filter((value, index) => segmentos.mapBy('titulo').indexOf(value.get('titulo')) === index);
  }),
  actions: {
    invalidateSession: function () {
      localStorage.clear();
      this.get('session').invalidate();
    },
    toggleRole(selectedRole) {
      this.set('toggleRole', selectedRole);
      localStorage.setItem('toggleRole', selectedRole);
    },
  },
});
