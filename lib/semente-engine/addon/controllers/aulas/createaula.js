import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),

  thumbnail: Ember.computed('model.newAula', function () {
    if (this.get('model.newAula.thumbnail') != null) return this.get('model.newAula.thumbnail');
    return false;
  }).property('model.newAula.thumbnail'),


  actions: {
    submit: function(){
      $("#titulo-error").html('');
      $("#thumb-error").html('');
      $("#descricao-error").html('');
      $("#competencia-error").html('');
      $("#stardate-error").html('');
      $("#enddate-error").html('');
      $("#calendario-error").html('');

      let aula = this.get('model.newAula');
      aula.set('plataformaAno', this.get('model.plataformaAno'));

      let titulo = document.getElementById('tituloAula').value;
      if(titulo == "" || titulo == " " || titulo == null) return $("#titulo-error").html('Obrigatório');
      aula.set('titulo', titulo);

      if(aula.get('thumbnail') == null) return $("#thumb-error").html('Obrigatório');
      
      let descricao = document.getElementById('descricaoAula').value;
      if(descricao == "" || descricao == " " || descricao == null) return $("#descricao-error").html('Obrigatório');
      aula.set('descricao', descricao);

      if(document.getElementById('stardate').value == "") return $("#stardate-error").html('Obrigatório'); 
      aula.set('dataInicioPrevista', document.getElementById('stardate').value);

      if(document.getElementById('enddate').value == "") return $("#enddate-error").html('Obrigatório'); 
      aula.set('dataFimPrevista', document.getElementById('enddate').value);

      if(aula.get('calendarios').content.length == 0 || aula.get('calendarios') == null){
        return $("#calendario-error").html('Aula deve pertencer a pelo menos um calendario.');
      }

      if(aula.get('comps').content.length == 0 || aula.get('comps') == null){
        return $("#competencia-error").html('Aula deve possuir no mínimo uma competência.');
      }
      
      let that = this;
      aula.save().then(function () {
        that.transitionToRoute('aulas.index')
      });
    },

    uploadThumbnail: function(event) {
      const file = event.target.files[0];
      if (file) this.send('resizeImage', file, this.get('model.newAula'));
    },

    resizeImage: function(file, aula) {
      var img = document.createElement("img");
      var canvas = document.createElement("canvas");
      img.src = URL.createObjectURL(file);
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var MAX_WIDTH = 50;
      var MAX_HEIGHT = 50;
      img.onload = function () {
          let width = img.width;
          let height = img.height;

          if (width > height) {
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
          } else {
              if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
              }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          var base64resized = canvas.toDataURL(file.type);
          aula.set('thumbnail', base64resized);
      }
    },

    removeThumbnail() {
      document.getElementById("aulaCapa").classList.remove('fadeInLeftShort');
      document.getElementById("aulaCapa").classList.add('fadeOutRightShort');

      setTimeout(() => {
          if (this.get('model.newAula').get('thumbnail')){
              this.get('model.newAula').set('thumbnail', null);
          }
      }, 500);
    },

    addCompetencia(competenciaId){
      let competencia = this.get('store').peekRecord('comp', competenciaId);
      let checkbox = document.getElementById('competencia_' + competenciaId).checked;
      if (checkbox) {
          this.get('model.newAula').get('comps').pushObject(competencia);
      } else {
          this.get('model.newAula').get('comps').removeObject(competencia);
      }
    },

    addCalendario(calendarioId){
      let calendario = this.get('store').peekRecord('calendario', calendarioId);
      let checkbox = document.getElementById('calendario_' + calendarioId).checked;
      if (checkbox) {
          this.get('model.newAula').get('calendarios').pushObject(calendario);
      } else {
          this.get('model.newAula').get('calendarios').removeObject(calendario);
      }
    },
  },
});