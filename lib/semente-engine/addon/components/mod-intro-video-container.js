import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({
  appstate: Ember.inject.service(),
  renderVideo: Ember.computed("",function () {
    let iframe1 = document.querySelector('#container_video');
    if (!iframe1) return;

    let mod = this.get('modulo');
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
            that.set('loadBlocos', true);
            that.get('appstate').updateApp();
          });
      }, 1);

      let firstAtiv = document.getElementById('card_1');
      firstAtiv.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });

    });
  })
});
