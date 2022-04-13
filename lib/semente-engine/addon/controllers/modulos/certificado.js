import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    appController: Ember.inject.controller('application'),
    session: Ember.inject.service(),
    store: Ember.inject.service(),
    
    rootURL: Ember.computed('appController', function() {
        let ac = this.get('appController');
        return ac.get('rootURL');
    }),

    pessoa: Ember.computed('model', function(){
        let p = JSON.parse(localStorage.getItem('person_logged'));
        return this.get('store').peekRecord('pessoa', p.id);
    }),

    percurso: Ember.computed('model', function () {
        return this.get('model').get('name');
    }),

    matricula: Ember.computed('model', function(){
        let p = JSON.parse(localStorage.getItem('person_logged'));
        let pessoa = this.get('store').peekRecord('pessoa', p.id);
        let moduloId = this.get('model').id;
  
        let matriculas = pessoa.get('matriculas');
        let matricula;
        
        matriculas.forEach(function (mat) {
          if (mat.get('modulo.id') == moduloId) {
            matricula = mat;
          }
        })
        if (!matricula.get('codigoCertificado')) {
          matricula.save().then(function (mat) {
            return mat;
          });
        }
        
        return matricula;
    }),

    codigo: Ember.computed('model', function(){
        let p = JSON.parse(localStorage.getItem('person_logged'));
        let pessoa = this.get('store').peekRecord('pessoa', p.id);
        let matriculas = pessoa.get('matriculas');
        let moduloId = this.get('model').get('id');
        let codigoCertificado;

        matriculas.forEach(mat => {
            if (mat.get('moduloId') == moduloId) {
                codigoCertificado = mat.get('codigoCertificado');
            }
        })

        return codigoCertificado
    }),

    actions: {

        toPDF() {
          document.getElementById('toPDF').innerHTML = 'Baixando...'
          let dpi = window.devicePixelRatio;
          html2canvas($('#certificado')[0], {imageTimeout: 5000, useCORS: true, scale: dpi}).then(canvas => {
            let img = canvas.toDataURL('image/png');
            
            let pdf = new jsPDF('landscape', 'pt', 'a4', true)
            const pdfWidth = pdf.internal.pageSize.width;
            const pdfHeight = (pdf.internal.pageSize.height * pdfWidth) / pdfWidth
            pdf.addImage(img, 'JPG', 5, 5, pdfWidth-5, pdfHeight+5);
                  
            pdf.save('certificado.pdf');
            document.getElementById('toPDF').innerHTML = 'Baixar em pdf';
          })
        },
    }
});