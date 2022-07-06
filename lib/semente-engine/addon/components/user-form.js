import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    buttonLabel: function() {
        return (this.get('changeset.id')) ? "Salvar" : "Adicionar";
    }.property(),

    pessoaLogged: Ember.computed('model',function(){
        let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
        return this.get('store').peekRecord('pessoa', infosLogged.id);
    }),

    selectedPlataformaAno: '',
    plataformaAnos:Ember.computed('model',function(){
        return this.get('instituicao').get('plataformaAnos');
    }),

    plataformaTurmas:Ember.computed('model',function(){
        return this.get('instituicao').get('plataformaTurmas');
    }),

    sEnabled: Ember.computed('instituicao', function () {
        var s = this.get('instituicao').get('sistemas').find((x) => { return x.get('idx') === 2 });
        if (s) {
            this.get('instituicao').set('sEnabled', true);
        }
        return this.get('instituicao').get('sEnabled');
    }),

    setRole(value) {
        this.set('activeProfile', value);
    },

    startInformation: Ember.computed('model',function(){
        if(this.get('changeset.id')){
            let pessoa = this.changeset;
            this.set('new_user_id', pessoa.get('id'));
            this.set('activeProfile', pessoa.get('role'));
            this.set('new_user_role', pessoa.get('role'));
            this.set('new_user_enabled', pessoa.get('enabled'));
            this.set('new_user_acessoPlataformaS', pessoa.get('acessoPlataformaS'));
            this.set('new_user_gender', pessoa.get('gender'));

            if(pessoa.get('role') == 'aluno'){
                this.set('new_user_birth', pessoa.get('nascimentoPlataforma'));
                this.set('new_user_ano', pessoa.get('plataformaAnos'));
                this.set('selectedPlataformaAno', pessoa.get('plataformaAnos').get('firstObject'));
                this.set('new_user_turma', pessoa.get('plataformaTurmas'));
            }

            if(pessoa.get('role') == 'instrutor'){
                this.set('new_user_aplicador', pessoa.get('isAplicador'));
                this.set('isAplicador', pessoa.get('isAplicador'));
                this.set('new_user_ano', pessoa.get('plataformaAnos'));
                this.set('new_user_turma', pessoa.get('plataformaTurmas'));
            }
        }
        else{
            this.set('activeProfile', '');
            this.set('new_user_role', '');
            this.set('new_user_enabled', true);
            if(this.get('instituicao').get('sEnabled')) this.set('new_user_acessoPlataformaS', true);
            this.set('new_user_aplicador', false);
            this.set('isAplicador', false);
            this.set('new_user_gender', '');
            this.set('new_user_birth', '');
            this.set('new_user_ano', '');
            this.set('new_user_turma', '');
        }
    }),

    afterRenderInformation: Ember.computed('model',function(){
        if(this.get('changeset.id')){
            let pessoa = this.changeset;
            
            document.getElementById('new_user_role').value = pessoa.get('role');
            document.getElementById('new_user_gender').value = pessoa.get('genero');

            document.getElementById('new_user_enabled').checked = false;
            if (pessoa.get('enabled')) document.getElementById('new_user_enabled').checked = true;

            if(this.get('instituicao').get('sEnabled')){
                document.getElementById('new_user_acessoPlataformaS').checked = false;
                if (pessoa.get('acessoPlataformaS')) document.getElementById('new_user_acessoPlataformaS').checked = true;
            }

            if(pessoa.get('role') == 'aluno'){
                if (pessoa.get('plataformaAnos').get('firstObject') != null) {
                    document.getElementById('new_user_ano').value = pessoa.get('plataformaAnos').get('firstObject').get('id');
                }
                if (pessoa.get('plataformaTurmas').get('firstObject') != null){
                    document.getElementById('new_user_turma').value = pessoa.get('plataformaTurmas').get('firstObject').get('id');
                }
            }

            if(pessoa.get('role') == 'instrutor'){
                pessoa.get('plataformaTurmas').forEach(pt => {
                    document.getElementById('plat_turma' + pt.get('id')).checked = true;
                })
            }
        }
    }),

    actions: {
        submit: function () {
            this.action(this.changeset)
        }, 

        replacePhone() {
            let target = event.target;
            let phone = target.value;
            phone = phone.replace(/\D/g, "")
            phone = phone.replace(/(\d{2})(\d)/, "($1) $2")
            phone = phone.replace(/(\d{5})(\d{4})/, "$1-$2")
            this.set('new_user_phone', phone);
        },
    
        replaceCPF() {
            let target = event.target;
            let cpf = target.value;
        
            var regex = /^[0-9.\t]$/;
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            var code = event.which ? event.which : event.keyCode;
        
            if (!regex.test(key) && code !== 37 && code !== 39 && code !== 8 && code !== 9 && code !== 116) {
        
                this.set('errorMsgCPF', 'Apenas números são permitidos');
                this.set('cpfError', true);
                event.preventDefault();
                return false;
            }
        
            cpf = cpf.replace(/\D/g, "")
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            this.set('new_user_cpf', cpf);
        },
    
        checkaplicador(v) {
            this.set('isAplicador', v.currentTarget.checked);
            this.set('new_user_aplicador', v.currentTarget.checked);
        },

        addPAPT(plataformaTurmaId){
            let platTurma = this.get('store').peekRecord('plataforma-turma', plataformaTurmaId);
            let platAno = this.get('store').peekRecord('plataforma-ano', platTurma.get('plataformaAno').get('id'));
            let checkbox = document.getElementById('plat_turma' + plataformaTurmaId).checked;
            if (checkbox) {
                this.changeset.get('plataformaTurmas').pushObject(platTurma);
                var platAnoIds = this.changeset.get('plataformaAnos').map(x => x.get('id'));
                if(platAnoIds.indexOf(platAno.get('id')) == -1){
                    this.changeset.get('plataformaAnos').pushObject(platAno);
                }
            } else {
                this.changeset.get('plataformaTurmas').removeObject(platTurma);
                var platAnoIds = this.changeset.get('plataformaTurmas').map(x => x.get('plataformaAno').get('id'));
                if(platAnoIds.indexOf(platAno.get('id')) == -1){
                    this.changeset.get('plataformaAnos').removeObject(platAno);
                }
            }
        },
    
        refreshPlataformaTurmas(plataformaAnoId) {
            if (plataformaAnoId != "0") {
                let plataformaAnos = this.get('plataformaAnos');
                plataformaAnos.forEach(pa => {
                    if(pa.get('id') == plataformaAnoId) this.set('selectedPlataformaAno', pa);
                });
            } else {
                this.set('selectedPlataformaAno', "");
            }
        },
    }
})