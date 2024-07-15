import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    didInsertElement() {
        $(".numeric").mask("#0", { reverse: true})
    },
    buttonLabel: function() {
        return (this.get('changeset.id')) ? "salvar alterações " : "Adicionar";
    }.property(),

    instituicao:Ember.computed('model',function(){
        return this.changeset;
    }),

    totalCodigosAlunos: 0,
    totalUtilizadosAlunos: 0,
    totalCodigosInstrutores: 0,
    totalUtilizadosInstrutores: 0,
    codigos: Ember.computed('model',function(){
        let codigos = this.get('instituicao').get('codigosCadastro');
        let tca = 0;
        let tua = 0;
        let tci = 0;
        let tui = 0;
        codigos.forEach(cod => {
            if(cod.get('typeCadastro') == "aluno"){
                tca = tca + 1;
                if(cod.get('utilizado')){
                    tua = tua + 1;
                }
            }
            if(cod.get('typeCadastro') == "instrutor"){
                tci = tci + 1;
                if(cod.get('utilizado')){
                    tui = tui + 1;
                }
            }
        });
        this.set('totalCodigosAlunos', tca);
        this.set('totalUtilizadosAlunos', tua);
        this.set('totalCodigosInstrutores', tci);
        this.set('totalUtilizadosInstrutores', tui);

        return codigos;
    }),

    carregaBarras: Ember.computed('model', function() {
        let percAluno = (this.get('instituicao').get('nralunosAtivos') / this.get('instituicao').get('nralunos')) * 100;
        let percProf = (this.get('instituicao').get('nrinstrutoresAtivos') / this.get('instituicao').get('nrinstrutores')) * 100;
        // let percAluno = (this.get('totalUtilizadosAlunos') / this.get('totalCodigosAlunos')) * 100;
        // let percProf = (this.get('totalUtilizadosInstrutores') / this.get('totalCodigosInstrutores')) * 100;

        if(percAluno >= 100) document.getElementById('barra-alunos').style.backgroundColor = "#dc1b1b";
        if(percProf >= 100) document.getElementById('barra-professores').style.backgroundColor = "#dc1b1b";

        const style = document.createElement('style');
        style.type = 'text/css';
        const keyframes = `
            @keyframes growAluno {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${percAluno}%;
                }
            }

            @keyframes growProf {
                0% {
                    width: 0%;
                }
                100% {
                    width: ${percProf}%;
                }
            }
        `;
        style.appendChild(document.createTextNode(keyframes));
        document.head.appendChild(style);
    }),

    actions: {
        submit: function () {
            this.action(this.changeset)
        },
    }
})