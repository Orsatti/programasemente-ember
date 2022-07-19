import {validatePresence, validateNumber, validateLength, validateFormat} from 'ember-changeset-validations/validators';

export default {
        name:[ validatePresence({ presence: true, message: ' ' }),
                validateLength({ min: 3, message: 'Nome precisa ter no mínimo 3 caracteres'})],

        email:[ validatePresence({ presence: true, message: ' ' }),
                validateLength({ min: 3, message: 'Login precisa ter no mínimo 3 caracteres'})],

        emailCadastrado:[ validateFormat({ type: 'email', message: 'Precisa ser um e-mail válido', allowBlank: true})],

        cpf:[ validateFormat({ regex: /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/, allowBlank: true})],

        telefone:[ validateFormat({ regex: /^\(?[0-9]{2}\)?\s?[0-9]{5}\-?[0-9]{4}$/, allowBlank: true})],

        senha:[ validateLength({ min: 6, message: 'Senha precisa ter no mínimo 6 caracteres', allowBlank: true })],
}