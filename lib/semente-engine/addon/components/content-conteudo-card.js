import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  router: Ember.inject.service('-routing'),
  store: Ember.inject.service(),
  thumbnail: Ember.computed('conteudo', function () {
    if (this.get('conteudo.tipo') == "Video") {
      let conteudoId = this.get('conteudo.id');
      let vimeoCode = this.get('conteudo.videoUrl');
      $.getJSON('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + vimeoCode, { format: "json" }, function (data) {
        $("#file-" + conteudoId).attr("src", data.thumbnail_url_with_play_button);
      }).fail(function () {
        $("#file-" + conteudoId).attr("src", '/assets/img/dark__thumb.png');
      });
    } else if (this.get('conteudo.tipo') == "Documento") {
      let url = this.get('conteudo.thumbnail');
      return url;
    } else if (this.get('conteudo.tipo') == "Imagem") {
      let url = this.get('conteudo.arquivoUrl');
      return url;
    }
  }).property('aula'),

  haveDescription: Ember.computed('conteudo', function() {
    var descricao = this.get('conteudo').get('descricao');
    if(descricao != null && descricao != "") return true;
    else return false;
  }),

  haveRecommendation: Ember.computed('conteudo', function() {
    var indicacao = this.get('conteudo').get('indicacao');
    if(indicacao != null && indicacao != "") return true;
    else return false;
  }),

  actions: {
    openModal() {
      this.toggleModal(this.get('conteudo.id'));
    },
    checkTarefa(){
      var checkbox = document.getElementById('checkbox-tarefa');
      if(checkbox){
        checkbox.checked = true;
        this.checkTarefa();
      }
      else{
        let conteudoPessoa = this.get('store').createRecord('conteudo-pessoa', {
          pessoa: this.get('pessoa'),
          plataformaConteudo: this.get('conteudo')
        })
          conteudoPessoa.save().then(() => {
        });
      }
    }
  },
});
