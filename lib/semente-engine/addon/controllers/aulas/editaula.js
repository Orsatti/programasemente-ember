import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  store: Ember.inject.service(),
  
  actions: {
    save: function(){
      $("#titulo-error").html('');
      $("#thumb-error").html('');
      $("#descricao-error").html('');
      $("#competencia-error").html('');
      $("#calendario-error").html('');

      let aula = this.get('model.aula');
      aula.set('plataformaAno', this.get('model.plataformaAno'));

      let titulo = document.getElementById('tituloAula').value;
      if(titulo == "" || titulo == " " || titulo == null) return $("#titulo-error").html('Obrigatório');
      aula.set('titulo', titulo);

      if(aula.get('thumbnail') == null) return $("#thumb-error").html('Obrigatório');
      
      let descricao = document.getElementById('descricaoAula').value;
      aula.set('descricao', descricao);

      let isEssencial = document.getElementById('check-essencial').checked;
      aula.set('isEssencial', isEssencial);

      if(aula.get('calendarios').content.length == 0 || aula.get('calendarios') == null){
        return $("#calendario-error").html('Aula deve pertencer a pelo menos um calendario.');
      }

      if(aula.get('comps').content.length == 0 || aula.get('comps') == null){
        return $("#competencia-error").html('Aula deve possuir no mínimo uma competência.');
      }
      
      let that = this;
      aula.save().then(function () {
        setTimeout(function(){
          that.transitionToRoute('aulas.index')
        }, 500);
      });
    },
  },
});