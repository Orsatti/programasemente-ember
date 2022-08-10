import Ember from 'ember';
import jQuery from 'jquery';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    buttonLabel: function() {
        return (this.get('aula.id')) ? "Salvar" : "Adicionar";
    }.property(),

    thumbnail: Ember.computed('aula', function () {
        if (this.get('aula.thumbnail') != null) return this.get('aula.thumbnail');
        return false;
    }).property('aula.thumbnail'),

    startInformation: Ember.computed('aula',function(){
        if(this.get('aula.id')){
            let aula = this.aula;
            this.set('new_aula_titulo', aula.get('titulo'));
            this.set('new_aula_descricao', aula.get('descricao'));
            // this.set('new_aula_startdate', aula.get('dataInicioPrevista'));
            // this.set('new_aula_enddate', aula.get('dataFimPrevista'));
        }
        else{
            this.set('new_aula_titulo', '');
            this.set('new_aula_descricao', '');
            // this.set('new_aula_startdate', '');
            // this.set('new_aula_enddate', '');
        }
    }),

    afterRenderInformation: Ember.computed('aula',function(){
        if(this.get('aula.id')){
            let aula = this.aula;
            aula.get('calendarios').forEach(c => {
                document.getElementById('calendario_' + c.get('id')).checked = true;
            });
            aula.get('comps').forEach(c => {
                document.getElementById('competencia_' + c.get('id')).checked = true;
            });
        }
    }),

    actions: {
        submit: function () {
            this.action(this.aula);
        }, 

        uploadThumbnail: function(event) {
            const file = event.target.files[0];
            if (file) this.send('resizeImage', file, this.get('aula'));
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
                if (this.get('aula').get('thumbnail')){
                    this.get('aula').set('thumbnail', null);
                }
            }, 500);
        },
    
        addCompetencia(competenciaId){
            let competencia = this.get('store').peekRecord('comp', competenciaId);
            let checkbox = document.getElementById('competencia_' + competenciaId).checked;
            if (checkbox) {
                this.get('aula').get('comps').pushObject(competencia);
            } else {
                this.get('aula').get('comps').removeObject(competencia);
            }
        },
    
        addCalendario(calendarioId){
            let calendario = this.get('store').peekRecord('calendario', calendarioId);
            let checkbox = document.getElementById('calendario_' + calendarioId).checked;
            if (checkbox) {
                this.get('aula').get('calendarios').pushObject(calendario);
            } else {
                this.get('aula').get('calendarios').removeObject(calendario);
            }
        },
    }
})