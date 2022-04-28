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

    plataformaAno: Ember.computed('model', function () {
        return this.get('model').get('name');
    }),
    
    segmento: Ember.computed('model', function () {
      return this.get('model').get('segmento').get('titulo');
    }),

    dataConclusao: Ember.computed('model', function () {
      let tarefas = this.get('pessoa').get('tarefas');
      let data;
      tarefas.forEach(tarefa => {
        data = tarefa.get('dataRealizado')
      });
      return data;
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