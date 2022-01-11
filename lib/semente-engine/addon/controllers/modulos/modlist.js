import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  showHeader: Ember.run.schedule('afterRender', function () {
    $('body').removeClass('no-header');
  }),
  appstate: Ember.inject.service(),
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  sortingKey: ['idx'],
  sortedAtividades: Ember.computed.sort('model.atividades', 'sortingKey'),

  //Politica privacidade

  termoAceito: Ember.computed('model', function(){
    let termoInst = this.get('model').get('pessoas').get('firstObject').get('instituicao').get('statusTermoAceite');
    let termoPessoa = this.get('model').get('pessoas').get('firstObject').get('termoAceite');
    if(termoInst == true && termoPessoa == false){
    
    setTimeout(() => {
      $('body').addClass('no-header');
    }, 200);
      this.set('isInAcceptance', true);
      this.send('termoAceite');
      
    }
  }),

  matricula: Ember.computed('model', function () {
    let p = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').peekRecord('pessoa', p.id);
    let matriculas = pessoa.get('matriculas');
    let moduloId = this.get('model').get('id');
    let matricula;
    
    matriculas.forEach(mat => {
      if (mat.get('moduloId') == moduloId) {
        matricula = mat;
      }
    })

    return matricula
  }),

  statusVideo: Ember.computed('model', function () {
    let person = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').peekRecord('pessoa', person.id);
    let matriculas = pessoa.get('matriculas');
    let moduloId = this.get('model').get('id');
    let statusVideo;
    
    matriculas.forEach(mat => {
      if (mat.get('moduloId') == moduloId) {
        statusVideo = mat.get('statusVideoInicio');
      }
    })

    return statusVideo
  }),

  loadBlocos: true,

  renderVideo: Ember.computed('model', function () {
    let p = JSON.parse(localStorage.getItem('person_logged'));
    let pessoa = this.get('store').peekRecord('pessoa', p.id);

    let mod = this.get('model');
    let vid = mod.get('videoId');
    if (vid == "") {
      vid = 357972498;
    }
    let that = this;
    let matric = that.get('matricula');

    let options_vimeo = {
      id: vid,
      autoplay: false,
      playsinline: false,
      title: true,
    };

    let iframe1 = document.querySelector('#container_video');
    let player_section = new Vimeo.Player(iframe1, options_vimeo);

    let saved_percent = 0;
    let save_free = true;
    player_section.on('timeupdate', function (video_data) {
      if (that.get('counterTimeupdate') == 0) {
        if (100 * video_data.percent > saved_percent + 5) {
          let temp = Math.round(new Date().getTime() / 1000);
          saved_percent = 100 * video_data.percent;
          if (save_free) {
            save_free = false;
          }
        }
        that.set('counterTimeupdate', 0);
      } else {
        let currentTimeUpdate = that.get('counterTimeupdate');
        that.set('counterTimeupdate', currentTimeUpdate + 1);
      }
    });
    player_section.on('ended', function () {

      function setProperBottom(target) {
        let connetionAlert = document.getElementById('snackbarConnection');
        if (connetionAlert.classList.contains('alert--is-show')) target.style.bottom = '96px';
      }

      function videoStateSave(callback, nTimes) {
        console.log('>_videoStateSave()');
        const alertRetrying = document.getElementById('conteudoRenderErrorRetrying');
        const alertRetry = document.getElementById('conteudoRenderErrorRetry');

        return callback()
          .catch(function (reason) {
            if (nTimes-- > 0) {
              alertRetry.classList.remove('alert--is-show');
              alertRetrying.classList.add('alert--is-show');

              setProperBottom(alertRetrying);

              let retryCounter = document.getElementById('retryCounter');
              var countdown = 10;

              var i = setInterval(function () {
                countdown--;
                retryCounter.innerHTML = countdown;
                if (countdown === 0) {
                  clearInterval(i);
                  return videoStateSave(callback, nTimes);
                }
              }, 1000);

            } else {
              alertRetrying.classList.remove('alert--is-show');
              alertRetry.classList.add('alert--is-show');

              setProperBottom(alertRetry);

              throw reason;
            }
          });
      }
      videoStateSave(function () {
        that.set('statusVideo', true);
        matric.set('statusVideoInicio', true);
        that.set('loadBlocos', false);
        return matric.save()
          .then(() => {
            //window.location.reload(true);
            that.set('loadBlocos', true);
            that.get('appstate').updateApp();
            that.transit();
          });
      }, 1);

      // Rola a tela para a atividade 1 após o vídeo
      let firstAtiv = document.getElementById('1');
      firstAtiv.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });

    });
  }),

  
  // ########## Douglas - Lógica para scroll da timeline [Início]
  scrollToNext: Ember.computed('model','appstate.upState', function() {
    if (this.get('appstate.upState') === 0) this.get('appstate').updateApp();

    let aulas = this.get('appstate').lista_atividades;
    let main = document.getElementById('content-main');
    let arrayEA = [];
    let arrayNI = [];
    let arrayCO = [];
    let arrayDias = [];
    let arrayAcessos = [];
    let dia, hoje;

   // Popula array dos dias
    aulas.forEach(aula => {
      // debugger;
      dia = new Date(this.get('store').peekRecord('atividade', aula.id).get('dia'));
      hoje = new Date();
      if (dia > hoje) {
        arrayDias.push(aula.idx);
      }
    });

   // Setando o target baseado em data
   if (arrayDias.length > 0) {
     let idxAnterior = arrayDias[0] - 1;
     this.set('scrollTargetCurrent', 'card_' + idxAnterior.toString());
    } else {
      this.set('scrollTargetCurrent', 'card_12');
    }

   // popula  e ordena array dos acessos
    aulas.forEach(aula => {
        let data = new Date(aula.timestamp).getYear();
      if (aula.percent > 0) {
        arrayAcessos.push(aula);
      }
    })
    arrayAcessos.sort((a,b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));

    // Setando o target baseado no último acesso
    if (arrayAcessos.length > 0) {
      let idxLast = arrayAcessos[arrayAcessos.length - 1].idx;
      this.set('scrollTargetLast', 'card_' + idxLast.toString());
    } else {
      this.set('scrollTargetLast', 'card_1');
    }



      // popula arrays dos status
      aulas.forEach(aula => {
        if (aula.percent === 0) {
            arrayNI.push(aula.idx);
        } else if (aula.percent > 0 && aula.percent < 100) {
            arrayEA.push(aula.idx);
        } else if (aula.percent === 100) {
            arrayCO.push(aula.idx);
        }
    });

}),


// ########## Douglas - Lógica para scroll da timeline [Fim]



  listaStartUnit: Ember.computed('model', 'appstate.upState', function () {
    if (this.get('appstate.upState') === 0) this.get('appstate').updateApp();
    let data = this.get('appstate').getItem('modulos', this.get('model.id'));
    let dataAnterior = 0;
    let startUnit = 0;
    let startunitList = [];
    let counter = 0;
    let that = this;

    data.atividades.forEach(function(){

      let resp = that.get('store').peekRecord('atividade', data.atividades[counter].id);
      if (resp.get('dia') == dataAnterior || counter == 0){
        startUnit = 0;
      }else{
        startUnit = 1;
      }
      startunitList.push(startUnit);
      dataAnterior = resp.get('dia');
      counter = counter + 1;
    })
    return startunitList;
  }),
  actions: {

    termoAceite() {
      //debugger;
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      document.getElementById('termo_modal').classList.add('modal--is-show');
      document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
      //document.getElementsByTagName('body')[0].style.display = none;
      if (this.get('isInAcceptance')) {
        document.getElementById('header_layout').style.zIndex = -1;
      }
    },

    aceitarTermo(){
      //debugger;
      let person = JSON.parse(localStorage.getItem('person_logged'));
      let pessoa = this.get('store').peekRecord('pessoa', person.id);
      pessoa.set('termoAceite', true);
      document.getElementById('header_layout').style.zIndex = 1;
      pessoa.save().then(() => {
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        document.getElementById('termo_modal').classList.remove('modal--is-show');
        document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
        $('body').removeClass('no-header');
        document.getElementsByTagName('body')[0].style.display = flex;
        
      })
    },
    cancelTermo() {
      localStorage.clear();
      this.get('session').invalidate();
    },


    goAtividade() {
      // curso selecionado
      let course = this.get('appstate').getItem('modulos', this.get('model').get('id'));

      if (course) {
        let courseProgress = course.percent;
        let courseClasses = course.atividades;


        // curso não iniciado ou finalizado
        if (courseProgress == 0 || courseProgress == 100) {
          this.transitionToRoute('modulos.modetails.ativdetails.secdetails', this.get('model'),
            courseClasses[0].id,
            courseClasses[0].secoes[0].id
          );
        }
        // curso em andamento
        else {
          // procura a próxima aula em andamento
          let nextClass = courseClasses.find(function (i) {
            if (i.percent != 100) return i;
          });

          // tem próxima aula
          if (nextClass) {
            // verifica a próxima lição em andamento
            let nextLesson = nextClass.secoes.find(function (i) {
              if (i.conteudo.percent != 100) return i;
            });

            // tem próxima lição
            if (nextLesson) {
              // conteúdo do tipo: quiz
              if (nextLesson.conteudo.type == 'quiz') {
                // verifica a próxima questão do quiz
                let nextQuestion = nextLesson.conteudo.questoes.find(function (i) {
                  if (i.respondida != true) return i;
                });

                this.transitionToRoute('modulos.modetails.ativdetails.secdetails',
                  this.get('model'),
                  nextClass.id,
                  nextLesson.id, {
                    queryParams: {
                      questao: nextQuestion.idx
                    }
                  }
                );
              }
              // conteúdo do tipo: html || vídeo
              else {
                this.transitionToRoute('modulos.modetails.ativdetails.secdetails',
                  this.get('model'),
                  nextClass.id,
                  nextLesson.id
                );
              }
            }
          }
        }
      }
    },
    goAtividadeC(id) {
      // aula selecionada
      let thisClass = this.get('appstate').getItem('atividades', id);
      // aula não iniciada ou finalizada
      if (thisClass.percent == 0 || thisClass.percent == 100) {
        this.transitionToRoute('modulos.modetails.ativdetails.secdetails',
          this.get('model'),
          id,
          thisClass.secoes[0].id
        );
      }
      // aula em progresso
      else {
        // verifica a próxima lição em andamento
        let thisNextLesson = thisClass.secoes.find(function (i) {
          if (i.conteudo.percent != 100) return i;
        });

        // conteúdo do tipo: quiz
        if (thisNextLesson.conteudo.type == 'quiz') {
          // verifica a próxima questão do quiz
          let thisNextQuestion = thisNextLesson.conteudo.questoes.find(function (i) {
            if (i.respondida != true) return i;
          });

          this.transitionToRoute('modulos.modetails.ativdetails.secdetails',
            this.get('model'),
            id,
            thisNextLesson.id, {
              queryParams: {
                questao: thisNextQuestion.idx
              }
            }
          );
        }
        // conteúdo do tipo: html || vídeo
        else {
          this.transitionToRoute('modulos.modetails.ativdetails.secdetails',
            this.get('model'),
            id,
            thisNextLesson.id
          );
        }
      }
    },
    goToModulos() {
      this.transitionToRoute('modulos');
    },

    scrollToCurrent() {

      let w = document.getElementById("content-main");
      let cardId = this.get('scrollTargetCurrent');
      let yOffset = -200;
      let cardTarget = document.getElementById(cardId);

      let y = cardTarget.getBoundingClientRect().top + window.pageYOffset + yOffset;

      setTimeout(function(){
      w.scrollTo({top: y, behavior: 'smooth'});
      cardTarget.parentElement.classList.remove("animated", "slow", "d500", "pulse");
      setTimeout(function(){cardTarget.parentElement.classList.add("animated", "slow", "d500", "pulse")}, 100);
    }, 250);


    },

    scrollToLast() {
      let w = document.getElementById("content-main");
      let cardId = this.get('scrollTargetLast');
      let yOffset = -150;
      let cardTarget = document.getElementById(cardId);

      let y = cardTarget.getBoundingClientRect().top + window.pageYOffset + yOffset;

      setTimeout(function(){
      w.scrollTo({top: y, behavior: 'smooth'});
      cardTarget.parentElement.classList.remove("animated", "slow", "d500", "pulse");
      setTimeout(function(){cardTarget.parentElement.classList.add("animated", "slow", "d500", "pulse")}, 100);
    }, 250);


    },

    scrollToTop() {
      let w = document.getElementById("content-main");
      w.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

});
