import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  router: Ember.inject.service('-routing'),
  store: Ember.inject.service(),
  aulaThumb: Ember.computed('aula', function () {
    let thumb = this.get('aula.thumbnail');
    let videosAula = this.get('aula.plataformaConteudos').filterBy('situacao', true).filterBy('tipo', "Video");
    if (thumb.includes("/assets/img/dark__thumb.png") && videosAula.length > 0) {
      let that = this;
      $.getJSON('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + videosAula[0].get('videoUrl'), { format: "json" }, function (data) {
        $("#thumbnail-aula-card" + that.get('aula.id')).attr("src", data.thumbnail_url);
      })
      this.set('aula.thumbnail', thumb)
    }
  }),
  situacao: Ember.computed('', function(){
    let aula = this.get('aula');
    let aplicacoes = aula.get('aplicacoes').filterBy('aplicado', true).filterBy('pessoa.id', this.get('pessoa.id'));
    let turmas = this.get('selectedAno').get('plataformaTurmas');
    this.set('UltimaAplicacao', aplicacoes.sortBy('dataAplicacao').reverse()[0]);
    if (aplicacoes.get('length') == 0) return "Não aplicada"
    else if (aplicacoes.get('length') == turmas.get('length')) return "Aplicada"
    else if (aplicacoes.get('length') < turmas.get('length')) return "Parcialmente aplicada"
  }).property('selectedSituacao,selectedAno.plataformaTurmas.each@'),

  init: function () {
    this._super();
  },
});
