import Controller from '@ember/controller';
import Ember from 'ember';
import {
  isArray
} from '@ember/array';

export default Controller.extend({
  parentController: Ember.inject.controller('aulas'),
  store: Ember.inject.service(),
  selectedSegmentoLocal: Ember.computed('model', function() {
    return this.get('parentController').get('segmentosObjects').get('firstObject');
  }),  

  pessoaLogged: Ember.computed('model',function(){
    let infosLogged = JSON.parse(localStorage.getItem('person_logged'));
    return this.get('store').peekRecord('pessoa',infosLogged.id);
  }),
  appController: Ember.inject.controller('application'),
  role: Ember.computed('appController', function () {
    let ac = this.get('appController');
    return ac.get('role');
  }),
  oneInst: Ember.computed('model', 'role', function () {
    let inst = this.get('model.instituicoes');
    let that = this;
    if (!isArray(inst)) {
      Ember.run.once(function () {
        that.set('inst_selected', inst);
        that.set('instView', true);
        that.transitionToRoute('aulas.acompanhamento', {
        queryParams: {
          instituicao_id: inst.id,
          page: 1,
        }
      });
      });
      return true;
    } else {
      return false;
    }
  }),

  async setSelected(inst) {
    document.getElementById('matchValue').value = null;
    document.getElementById('matchDisplay').style.display = 'none';
    document.getElementById('modelInstList').style.display = 'block';

    this.set('temS',false);
    this.set('temMedio', false);
    this.set('temCoreSkills',false);

    let inst_selected = await this.get('store').findRecord('instituicao', inst, {
      //include: 'atividades, sistemas, turmas, plataforma-anos.modulo', reload: true
      include: 'modulos.atividades, sistemas, turmas', reload: true
    });
    this.set('inst_selected', inst_selected);
    let that = this;
    inst_selected.get('sistemas').forEach(function(sis){
      if(sis.data.idx == 2){
        that.set('temS', true);
      }
      if(sis.data.idx == 1){
        that.set('temMedio', true);
      }
      if(sis.data.idx == 3){
        that.set('temCoreSkills', true);
      }
    })
    if (this.get('reSort') === 0) this.set('reSort', 1);
    else this.set('reSort', 0);

    this.set('instView', true);
    window.scrollTo(0, 0);
  },

  actions: {
    toggleRole(selectedRole) {
      this.get('parentController').send('toggleRole', selectedRole)
    },
    refreshSelectedSegmento(selectedSegmento) {
      // let segmento = this.get('store').peekRecord('segmento', selectedSegmentoId);
      this.set('segmento_id', selectedSegmento.get('id'));
      this.set('selectedSegmentoLocal', selectedSegmento);
    },




    



    filterInst() {
      let modelInstList = document.getElementById('modelInstList');
      let matchDisplay = document.getElementById('matchDisplay');
      let matchValue = document.getElementById('matchValue');
      let instList = this.get('model.instituicoes');

      if (matchValue != null){

        if (matchValue.value) {
          let searchResult = instList.filter(function (i) {
            if ((i.data.name).toLowerCase().match(new RegExp((matchValue.value).toLowerCase(), 'g'))) {
              return i;
            }
          });
          this.set('matchInsts', searchResult);
          modelInstList.style.display = 'none';
          matchDisplay.style.display = 'block';
        } else {
          let searchResult = instList;
          this.set('matchInsts', searchResult);
          matchDisplay.style.display = 'block';
          modelInstList.style.display = 'none';
        }
      }
    },

    selectInst(id) {
      this.set('inst_selected', false);
      if (id !== 'none') {
        this.setSelected(id);
        this.transitionToRoute('aulas.acompanhamento', {
          queryParams: {
            instituicao_id: id,
            page: 1
        }
        });
        this.set('instView', true);
      }
    },

    backToInstList() {
      this.set('inst_selected', false);
      this.set('instView', false);
      this.send('filterInst');
    },
  }
});