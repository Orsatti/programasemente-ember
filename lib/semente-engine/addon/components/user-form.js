import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    buttonLabel: function() {
        return (this.get('changeset.id')) ? "Salvar" : "Adicionar";
    }.property(),

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

    isAluno(value) {
        this.set('perfil', value);
        this.set('activeProfile', value);
    },

    startInformation: function() {
        if(this.get('changeset.id')){

        }
        else{
            this.set('activeProfile', '');
            this.set('user_modulos', '');
            this.set('new_user_inst', '');
            this.set('new_user_id', '');
            this.set('new_user_name', '');
            this.set('new_user_role', '');
            this.set('new_user_email', '');
            this.set('new_user_phone', '');
            this.set('new_user_senha', '');
            this.set('new_user_cpf', '');
            this.set('new_user_login', '');
            this.set('new_user_enabled', true);
            if(this.get('instituicao').get('sEnabled')) this.set('new_user_acessoPlataformaS', true);
            this.set('new_user_aplicador', false);
            this.set('isAplicador', false);
            this.set('new_user_gender', '');
            this.set('new_user_birth', '');
            this.set('new_user_ano', '');
            this.set('new_user_turma', '');
            this.set('pessoa_selected_edit', '');
            this.set('perfil', '');
            this.set('new_user_login', '');
        }
    }.property(),

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