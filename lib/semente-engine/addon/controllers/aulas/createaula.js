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
      $("#competencia-error").html('');

      let aula = this.get('model.newAula');

      let titulo = document.getElementById('tituloAula').value;
      if(titulo == "" || titulo == " " || titulo == null){
        return $("#titulo-error").html('Aula deve possuir um titulo.');
      }

      if(aula.get('thumbnail') == null){
        return $("#thumb-error").html('Aula deve possuir uma thumbnail.');
      }

      if(aula.get('comps').content.length == 0 || aula.get('comps') == null){
        return $("#competencia-error").html('Aula deve possuir no mínimo uma competência.');
      }

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
      var MAX_WIDTH = 200;
      var MAX_HEIGHT = 200;
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
  },
});