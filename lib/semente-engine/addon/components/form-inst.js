import Ember from 'ember'

export default Ember.Component.extend({
    goToStepTwo: false,
    actions: {
        submit: function () {
            // this.changeset.validate().then(()=>{
            //     if(this.changeset.get("isValid")){
            //         let that = this;
            //         this.changeset.save().then(function (user) {
            //             that.get('router').transitionTo('users.user', user)
            //         });
            //     } 
            //   })
        },
        goTo(param) {
            if (param === '1') this.set('goToStepTwo', false);
            else this.set('goToStepTwo', true);
          },
    }
})