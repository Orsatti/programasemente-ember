import DS from 'ember-data';

moment.updateLocale('en', {
    monthsShort : [
        "jan", "fev", "mar", "abr", "maio", "jun",
        "jul", "ago", "set", "out", "nov", "dez"
    ],
    months : [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
});

export default DS.Model.extend({
    titulo: DS.attr(),
    descricao: DS.attr(),
    isEssencial: DS.attr(),
    hasContent: DS.attr(),
    idx: DS.attr(),
    dataInicioPrevista: DS.attr(),
    dataInicioPrevistaFormat: Ember.computed('dataInicioPrevista', function() {
        let dataformatada = moment(this.get('dataInicioPrevista'), 'DD/MM/YYYY hh:mm:ss').format('DD MMM');
        return dataformatada;
    }),
    dataFimPrevista: DS.attr(),
    dataFimPrevistaFormat: Ember.computed('dataFimPrevista', function() {
        let dataformatada = moment(this.get('dataFimPrevista'), 'DD/MM/YYYY hh:mm:ss').format('DD MMM');
        return dataformatada;
    }),
    mesFimPrevistoFormat: Ember.computed('dataFimPrevista', function() {
        let dataformatada = moment(this.get('dataFimPrevista'), 'DD/MM/YYYY hh:mm:ss').format('MMMM');
        return dataformatada;
    }),
    thumbnail: DS.attr(),
    plataformaConteudos: DS.hasMany('plataforma-conteudo', { async: true }),
    plataformaAno: DS.belongsTo('plataforma-ano', { async: true }),
    aplicacoes: DS.hasMany('aplicacao-plataforma-aula', { async: true }),
    unidade: DS.belongsTo('unidade', { async: true }),
    comps: DS.hasMany('comp', { async: true }),
    atividade: DS.belongsTo('atividade', { async: true }),
    tarefas: DS.hasMany('tarefa', { async: true }),
    avaliacoes: DS.hasMany('avaliacao', { async: true }),
    anotacoes: DS.hasMany('anotacao', { async: true }),
    calendarios: DS.hasMany('calendario', { async: true }),
});
