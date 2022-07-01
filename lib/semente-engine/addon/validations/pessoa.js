import {validatePresence, validateNumber, validateLength, validateFormat} from 'ember-changeset-validations/validators';

export default {
    name: [ validatePresence({ presence: true }),
            validateLength({min: 3, messages: {tooShort: 'Nome precisa ter no mínimo 3 caracteres'}})],
    login: [ validatePresence({ presence: true }),
            validateLength({min: 3, messages: {tooShort: 'Login precisa ter no mínimo 3 caracteres'}})],
    email: [ validateFormat({ type: 'email', allowBlank: true})],
    cpf: [ validateFormat({ regex: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, allowBlank: true})],
    telefone: [ validateFormat({ regex: /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/, allowBlank: true})],
    senha: [ validateFormat({ allowBlank: true}),
            validateLength({min: 6, messages: {tooShort: 'Senha precisa ter no mínimo 6 caracteres'}})],
}