import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
    tagName: '',
    envnmt: ENV.APP,
    session: Ember.inject.service('session'),
    salvarbutton: Ember.computed('model', function () {
        if (this.editando) return 'Editar';
        else return 'Salvar';
    }).property('alterar_savebutton'),
    store: Ember.inject.service(),
    areas: Ember.computed('model', function () {
        return this.get('store').peekAll('area-marketing')
    }),
    image: ['image/png', 'image/jpeg'],
    capa: Ember.computed('model', function () {
        if (this.get('model.capa') != null) return this.get('model.capa');
        return false;
    }).property('model.arquivos.[]','model.capa', 'model.capaName'),

    startInformation: Ember.computed('model',function(){
        if(this.get('model.id')){
            let item = this.model;
            this.set('new_item_titulo', item.get('titulo'));
            this.set('new_item_descricao', item.get('descricao'));
        }
        else{
            this.set('new_item_titulo', '');
            this.set('new_item_descricao', '');
        }
    }),

    afterRenderInformation: Ember.computed('model',function(){
        if(this.get('model.id')){
            let item = this.model;
            document.getElementById('new_item_area').value = item.get('area').get('id');
        }
    }),

    sendFile(arquivo){
        let tok = this.get('session.data').authenticated.access_token;
        let temp = 'Bearer ';
        let userToken = temp.concat(tok);
        let final_url = this.get('envnmt.host') + '/' + this.get('envnmt.namespace') + '/arquivos/upload';
        let path = arquivo.get('marketing.area.name') + "/" + arquivo.get('marketing.titulo');
        let that = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", final_url);
            xhr.responseType = 'json';
            xhr.onreadystatechange = handler;
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=x1x2y3y4z5z6');
            xhr.setRequestHeader('Authorization', userToken);
            xhr.setRequestHeader('filename', arquivo.get('name'));
            xhr.setRequestHeader('path', path);
            xhr.setRequestHeader('container', "marketing");
            xhr.send(arquivo.get('url'));

            function handler() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200 || this.status === 204) {
                        arquivo.set('url', this.response.data.attributes["url"]);
                        resolve(this.response);
                    } else if (this.status === 404) {
                        reject('Server not found');
                    } else if (this.status >= 400) {
                    reject(new Error(this.response.error));
                    } else {
                    reject(new Error('Failure from server call: [' + this.status + ']'));
                    }
                }
            }
        });
    },
    actions: {
        UploadCapa: function(event) {
            this.set('showProcessing', true);
            $("#message-processing-capa").text("Processando...");
            const file = event.target.files[0];

            this.send('ResizeImage', file, this.get('model'));
            $("#message-processing-capa").text("");
            this.set('showProcessing', false);
        },

        ResizeImage: function(file, marketing) {
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
                marketing.set('capa', base64resized);
                marketing.set('capaName', file.name);
            }
        },

        removePathCapa() {
            if (this.get('model.capa')){
                this.get('model').set('capa', null);
                this.get('model').set('capaName', null);
            }
        },

        Upload: function (event) {
            this.set('errorFile', false);
            const files = event.target.files;
            var arquivos = this.get('model.arquivos');
            for (var i = 0, file; file = files[i]; i++) {
                this.set('uploadingFile', true);
                if (!arquivos.mapBy('name').includes(file.name)){
                    arquivos.pushObject(
                        this.get('store').createRecord('arquivo', {
                            url: file,
                            name: file.name,
                            tipo: file.type
                        })
                    );
                    this.set('uploadingFile', false);
                }
            }
            this.set('errorMsg', '');
        },

        removeArquivo(arquivo) {
            this.get('model.arquivos').removeObject(arquivo);
            if (this.get('model.capaName') == arquivo.get('name')) {
                this.get('model').set('capa', null);
                this.get('model').set('capaName', null);
            }
            if (arquivo.get('id') != null) arquivo.save();
        },

        saveItem(item) {
            $("#titulo-error").html('');
            $("#area-error").html('');
            $("#capa-error").html('');
            $("#file-error").html('');
            
            let titulo = document.getElementById('new_item_titulo').value;
            if(titulo == "" || titulo == " " || titulo == null) return $("#titulo-error").html('Obrigatório');
            item.set('titulo', titulo);
            
            let area = document.getElementById('new_item_area').value;
            if(area == "") return $("#area-error").html('Obrigatório');
            item.set('area', this.get('store').peekRecord('area-marketing', area));
            
            let arquivos = item.get('arquivos');
            if(arquivos.get('length') == 0) return $("#file-error").html('Obrigatório');

            let capa = this.get('capa');
            if(capa == null) return $("#capa-error").html('Obrigatório');
            
            item.set('pasta', this.get('pasta'));

            let contador = 0;
            let that = this;
            this.set('salvarbutton','Aguarde...');
            this.set('generalSaveLoader', true);
            item.save().then(function () {
                arquivos.forEach(arquivo => {
                    that.sendFile(arquivo).then(function(){
                        arquivo.save().then(function () {
                            contador++;
                            if (contador == arquivos.get('length')){
                                that.transitTo(that.get('pasta').get('id'));
                            }
                        })
                    });
                });
            });
        },
    },
    init: function () {
        this._super();
    },
});