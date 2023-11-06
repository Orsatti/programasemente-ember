import Ember from 'ember';
import Component from '@ember/component';
import ENV from '../config/environment';

Ember.LinkComponent.reopen({
  activeClass: 'tabs__tab--is-active'
});

export default Component.extend({
  adobeApiKey: ENV.adobeApiKey,
  store: Ember.inject.service(),
  tagName: '',
  router: Ember.inject.service('-routing'),
  session: Ember.inject.service('session'),

  toogleModal(target) {
    var el = document.getElementById(target);
    $(el).toggleClass('modal--is-show');
    $('body').toggleClass('overflow-hidden');
  },

  instituicao: Ember.computed('', function() {
    return this.get('pessoa').get('instituicao');
  }),

  isAplicador: Ember.computed('', function() {
    return this.get('pessoa').get('isAplicador');
  }),

  isEja: Ember.computed('', function() {
    return this.get('pessoa').get('isEja');
  }),

  init() {
    this._super(...arguments);
    let showtoggle = this.get('showToggle');
    this.set('showToggle', showtoggle);
    Ember.run.schedule("afterRender", this, function(){
      if (this.get('activeAula')) $("#aulas-header").addClass("tabs__tab--is-active");
    });
  },

  idxPlatAnosMedio: [10, 11, 12],
  isAlunoMedio: Ember.computed('pessoa', function() {
    let pessoa = this.get('pessoa');

    if (!pessoa) return false;
    if (pessoa.get('role') != "aluno") return false;

    let pessoaPlatAno = pessoa.get('plataformaAnos').get('firstObject');
    if (this.idxPlatAnosMedio.includes(pessoaPlatAno.get('idx'))) return true;
    return false;
  }),

  actions: {
    invalidateSession() {
        localStorage.clear();
        this.get('session').invalidate();
    },
    toggleAvatarModal(){
      this.toogleModal('change_image_modal');
    },
  }

});
