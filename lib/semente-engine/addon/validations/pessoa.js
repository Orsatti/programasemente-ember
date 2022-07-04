import {validatePresence, validateNumber, validateLength, validateFormat} from 'ember-changeset-validations/validators';

export default {
        name:[ validatePresence({ presence: true, message: ' ' }),
                validateLength({min: 3, message: 'Nome precisa ter no mínimo 3 caracteres'})],

        login:[ validatePresence({ presence: true, message: ' ' }),
                validateLength({min: 3, message: 'Login precisa ter no mínimo 3 caracteres'})],

        email:[ validateFormat({ type: 'email', message: 'Precisa ser um e-mail válido', allowBlank: true})],

        cpf:[ validateFormat({ regex: /^[0-9.\t]$/, allowBlank: true})],

        telefone:[ validateFormat({ regex: /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/, allowBlank: true})],

        senha:[ validateFormat({ allowBlank: true}),
                validateLength({min: 6, message: 'Senha precisa ter no mínimo 6 caracteres'})],
}