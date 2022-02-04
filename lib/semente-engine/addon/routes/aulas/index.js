import Route from '@ember/routing/route';
import Ember from 'ember';
import RSVP from 'rsvp';


export default Route.extend({
    store: Ember.inject.service(),



    model() {
        let person = JSON.parse(localStorage.getItem('person_logged'));
        let role = person.role;
        this.set('role',role)
        let person_id = person.id;
        if (role === 'admin') {
          return RSVP.hash({
            pessoa: this.get('store').findRecord('pessoa', person_id,
              {include: 'instituicao, ' +
                      'plataforma-turmas.aplicacoes-plataforma-aula.aula' , reload: true}),
            plataformaConteudos: this.get('store').findAll('plataforma-conteudo',
              { include: 'publicos', reload: true }),
            plataformaAnos: this.get('store').findAll('plataforma-ano',
              {include:'segmento, aulas.unidade', reload: true}),
          });
        }
        else if (role === 'gestor' || role === 'coordenador')
        {
          return this.get('store').findRecord('pessoa', person_id,
          {include: 'instituicao.plataforma-anos.segmento, ' +
                    'instituicao.plataforma-anos.aulas.unidade,' +
                    'instituicao.plataforma-anos.aulas.plataforma-conteudos,' +
                    'instituicao.plataforma-anos.livros,' +
                    'plataforma-turmas.aplicacoes-plataforma-aula.aula' , reload: true});
        }
        else
        {
          return this.get('store').findRecord('pessoa', person_id,
          {include: 'instituicao, ' +
                    'plataforma-anos.segmento, ' +
                    'plataforma-anos.aulas.unidade,' +
                    'plataforma-anos.aulas.plataforma-conteudos,' +
                    'plataforma-anos.livros,' +
                    'plataforma-turmas.aplicacoes-plataforma-aula.aula,' +
                    'dependentes.plataforma-anos.aulas.unidade,' +
                    'dependentes.plataforma-turmas.aplicacoes-plataforma-aula.aula,' +
                    'dependentes.plataforma-anos.segmento,' +
                    'dependentes.plataforma-anos.aulas.plataforma-conteudos,' +
                    'dependentes.plataforma-anos.livros', reload: true});
        }
    },



  afterModel(model) {
    if (this.get('role') === 'admin') {
      return;
    }
    if (model.get('role') == 'instrutor' && !model.get('isAplicador')) {
        this.transitionTo('aulas.bibliotecaindex');
    }
  }
});
