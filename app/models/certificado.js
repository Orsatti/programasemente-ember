import DS from 'ember-data';

export default DS.Model.extend({
    pessoa: DS.attr(),
    dataEmissao: DS.attr(),
    codigo: DS.attr(),
    plataformaAno: DS.attr(),
    segmento: DS.attr(),
    sistema: DS.attr(),
});