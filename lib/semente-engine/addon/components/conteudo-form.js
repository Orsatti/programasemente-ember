import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    store: Ember.inject.service(),

    afterRender: Ember.computed('model',function(){
        if(this.get('conteudo') != null){
          if(this.get('isBiblioteca')){
            if(document.getElementById("tema") != null)
                document.getElementById("tema").value = this.get('conteudo').get('tema');

            if(this.get('isAluno')){
                this.get('conteudo').get('plataformaAnos').forEach(pa => {
                    document.getElementById('platAno-' + pa.get('id')).checked = true;
                })
            }
          }
        }
      }),
    
    setPublicoOnCreate: Ember.computed('conteudo', function() {
        
            let editStatus = this.get('editando');
            
            if (!editStatus) {
              this.send('agrupamentoChanged', 1);
            }
        
    }),

    situacaoAtual: Ember.computed('conteudo', function() {
        let editStatus = this.get('editando');
        let conteudoStatus;

        if (editStatus) {
            conteudoStatus = this.get('conteudo.situacao'); 
            return conteudoStatus
        } else {
            let conteudo = this.get('conteudo');
            conteudo.set('situacao', true);
            return true;
        }
    }),
    
    isBiblioteca: Ember.computed('conteudo', function() {
        var idxAgrupamento = this.get('conteudo').get('agrupamento').get('idx');
        if(idxAgrupamento == 3) return true;
        else return false;
    }),

    isAluno: Ember.computed('conteudo', function() {
        if(this.get('conteudo').get('publicos').mapBy('name').includes('aluno')) return true;
        else return false;
    }),

    haveDescription: Ember.computed('conteudo', function() {
        var descricao = this.get('conteudo').get('descricao');
        if(descricao != null){
            document.getElementById('descricao').checked = true;
            return true;
        }
        else {
            document.getElementById('descricao').checked = false;
            return false;
        }
    }),

    haveRecommendation: Ember.computed('conteudo', function() {
        var indicacao = this.get('conteudo').get('indicacao');
        if(indicacao != null) {
            document.getElementById('indicacao').checked = true;
            return true;
        }
        else {
            document.getElementById('indicacao').checked = false;
            return false;
        }
    }),

    agrupamentoAula: "true",
    adicionarAula: "false",
    segmentos: Ember.computed('', function () {
        return this.get('store').peekAll('segmento');
    }),
    anos: Ember.computed('', function () {
        return this.get('store').peekAll('plataforma-ano').filterBy('segmento.id', this.get('selectedSegmentoId'));
    }).property('selectedSegmentoId'),
    aulas: Ember.computed('', function () {
        return this.get('store').peekAll('aula').filterBy('plataformaAno.id', this.get('selectedAnoId'));
    }).property('selectedAnoId'),
    capa: Ember.computed('conteudo', function () {
        if (this.get('conteudo.thumbnail') != null) return this.get('conteudo.thumbnail');
        if (this.get('conteudo.tipo') == "Imagem"){
            this.send('ResizeImage', this.get('conteudo.path'), this.get('conteudo'));
        }
    }).property('conteudo.path','conteudo.thumbnail', 'conteudo.thumbnailname', 'conteudo.tipo'),
    
    actions: {
        urlvideoChanged(urlvideo){
            let error_origem = document.getElementById('error_origem');
            error_origem.classList.remove('form__msg--is-show');
            let conteudo = this.get('conteudo');
            conteudo.set('videoUrl', '');

            if (urlvideo.includes("https://vimeo.com/")){
                urlvideo = urlvideo.replace("https://vimeo.com/","");
            }
            let isnum = /^\d+$/.test(urlvideo);
            if (isnum){
                conteudo.set('videoUrl', urlvideo);
                conteudo.set('tipo', 'Video');
                conteudo.set('path', null);
                conteudo.set('arquivoUrl', null);
            }
        },

        indicacaoUrlChanged(indicacaoUrl){
            let conteudo = this.get('conteudo');
            conteudo.set('indicacaoUrl', indicacaoUrl);
        },

        Upload: function(event) {
            let error_origem = document.getElementById('error_origem');
            error_origem.classList.remove('form__msg--is-show');
            $("#message-processing").text("Processando...");
            $("#videoUrlId").text("");
            const file = event.target.files[0];
            if (file){
                this.get('conteudo').set('filename', file.name);
                this.get('conteudo').set('path', file);
                if (file.type.includes('jpeg') || file.type.includes('png')) {
                    this.get('conteudo').set('tipo', 'Imagem');
                    this.send('ResizeImage', file, this.get('conteudo'));
                } else if (file.type.includes('pdf')) {
                    this.get('conteudo').set('tipo', 'Documento');
                }
                this.get('conteudo').set('videoUrl', '');
            } 
               $("#message-processing").text("");
            
        },
        UploadCapa: function(event) {
            let error_publico = document.getElementById('error_publico');
            error_publico.classList.remove('form__msg--is-show', 'fadeInRightShort');
            this.set('showProcessing', true);
            $("#message-processing-capa").text("Processando...");
            const file = event.target.files[0];

            if (file) this.send('ResizeImage', file, this.get('conteudo'));
            $("#message-processing-capa").text("");
            this.set('showProcessing', false);
        },
        ResizeImage: function(file, conteudo) {
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
                conteudo.set('thumbnail', base64resized);
                conteudo.set('thumbnailname', file.name);
            }
        },
       
        tituloChanged() {
            let target = event.target;
            let newTitle = target.value;
            let error_title = document.getElementById('error_title');
            error_title.classList.remove('form__msg--is-show');
            let conteudo = this.get('conteudo');
            conteudo.set('titulo', newTitle);
        },

        descricaoChanged() {
            let target = event.target;
            let newDesctricao = target.value;
            let error_title = document.getElementById('error_title');
            error_title.classList.remove('form__msg--is-show');
            let conteudo = this.get('conteudo');
            conteudo.set('descricao', newDesctricao);
        },

        tituloIndicacaoChanged() {
            let target = event.target;
            let newTitle = target.value;
            let error_title = document.getElementById('error_title');
            error_title.classList.remove('form__msg--is-show');
            let conteudo = this.get('conteudo');
            conteudo.set('indicacao', newTitle);
        },

        indicacaoDescricaoChanged() {
            let target = event.target;
            let newDesctricao = target.value;
            let error_title = document.getElementById('error_title');
            error_title.classList.remove('form__msg--is-show');
            let conteudo = this.get('conteudo');
            conteudo.set('indicacaoDescricao', newDesctricao);
        },
       
        agrupamentoChanged(selectedAgrupamentoId) {
            
            let conteudo = this.get('conteudo');
            let agrupamento = this.get('store').peekRecord('agrupamento', selectedAgrupamentoId);
            conteudo.set('agrupamento', agrupamento);
            if (agrupamento.get('idx') != "3"){
                this.set('isBiblioteca', false);
                this.set('agrupamentoAula', 'true');
            } else{
                document.getElementById('descricao').checked = false;
                this.set('haveDescription', false);
                this.set('isBiblioteca', true);
                this.set('agrupamentoAula', 'false');
                if (conteudo.get('aulas.length') > 0){
                    conteudo.get('aulas').forEach( a => {
                        conteudo.get('aulas').removeObject(a)
                    })
                }
            }
        },
        refreshSelectedSituacao(selectedSituacao) {
            let conteudo = this.get('conteudo');
            if (selectedSituacao == "true"){ conteudo.set('situacao', true); }
            if (selectedSituacao == "false"){ conteudo.set('situacao', false); }
        },
        refreshSelectedTema(selectedTemaId) {
            let conteudo = this.get('conteudo');
            let tema = this.get('store').peekRecord('tema', selectedTemaId);
            conteudo.set('tema', tema);
        },
        refreshDescricao(){
            let check = document.getElementById('descricao').checked;
            this.set('haveDescription', check);
        },
        refreshIndicacao(){
            let check = document.getElementById('indicacao').checked;
            this.set('haveRecommendation', check);
        },
        publicoChanged(selectedPublicoId) {
            let error_publico = document.getElementById('error_publico');
            error_publico.classList.remove('form__msg--is-show', 'fadeInRightShort');
            let conteudo = this.get('conteudo');
            let publico = this.get('store').peekRecord('publico', selectedPublicoId);
            if (conteudo.get('publicos').mapBy('id').includes(selectedPublicoId)){
                conteudo.get('publicos').removeObject(publico);
                if(publico.get('name') == 'aluno') this.set("isAluno", false);
            } else{
                conteudo.get('publicos').pushObject(publico);
                if(publico.get('name') == 'aluno') this.set("isAluno", true);
            }
        },
        platAnoChanged(selectedPlatAnoId) {
            let conteudo = this.get('conteudo');
            let platAno = this.get('store').peekRecord('plataforma-ano', selectedPlatAnoId);
            if (conteudo.get('plataformaAnos').mapBy('id').includes(selectedPlatAnoId)){
                conteudo.get('plataformaAnos').removeObject(platAno);
            } else{
                conteudo.get('plataformaAnos').pushObject(platAno);
            }
        },
        removePath() {

            document.getElementById("arqConteudo").classList.remove('fadeInLeftShort');
            document.getElementById("arqConteudo").classList.add('fadeOutRightShort');
            
            var input = $("#file-selector");
            input.val("");
            
            setTimeout(() => {
                if (this.get('conteudo.thumbnailname') == this.get('conteudo.filename')) {
                    this.get('conteudo').set('thumbnail', null);
                    this.get('conteudo').set('thumbnailname', null);
                }
                if (this.get('conteudo').get('path')) {
                    this.get('conteudo').set('path', null);
                    this.get('conteudo').set('arquivoUrl', null);
                    this.get('conteudo').set('filename', null);
                    this.get('conteudo').set('tipo', null);
                }
            }, 500);

        },
        removePathCapa() {
            document.getElementById("arqCapa").classList.remove('fadeInLeftShort');
            document.getElementById("arqCapa").classList.add('fadeOutRightShort');

            setTimeout(() => {
                if (this.get('conteudo').get('thumbnail')){
                    this.get('conteudo').set('thumbnail', null);
                    this.get('conteudo').set('thumbnailname', null);
                }
            }, 500);

        },
        // Aulas
        addAulas(){
            let error_publico = document.getElementById('error_publico');
            error_publico.classList.remove('form__msg--is-show', 'fadeInRightShort');
            this.set('adicionarAula', "true");
            
        },

        calendariosChanged(selectedCalendarioId) {
            // let error_publico = document.getElementById('error_publico');
            // error_publico.classList.remove('form__msg--is-show', 'fadeInRightShort');
            let conteudo = this.get('conteudo');
            let calendario = this.get('store').peekRecord('calendario', selectedCalendarioId);
            if (conteudo.get('calendarios').mapBy('id').includes(selectedCalendarioId)){
                conteudo.get('calendarios').removeObject(calendario);
            } else{
                conteudo.get('calendarios').pushObject(calendario);
            }
        }

       
    }
});