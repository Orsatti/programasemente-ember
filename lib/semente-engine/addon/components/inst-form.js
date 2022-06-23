import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    didInsertElement() {
        $(".numeric").mask("#0", { reverse: true})
    },
    buttonLabel: function() {
        return (this.get('changeset.id')) ? "Salvar" : "Adicionar";
    }.property(),

    haveSegmentos:Ember.computed('model',function(){
        if(this.get('segmentos') != null) return true;
        return false;
    }),

    actions: {
        submit: function () {
            this.actions(this.changeset)
        },
    }
})