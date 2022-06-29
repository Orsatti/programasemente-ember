import {validatePresence, validateNumber} from 'ember-changeset-validations/validators';

export default {
    name: [ validatePresence({ presence: true, message: 'Obrigatório' })],
    login: validatePresence({ presence: true, message: 'Obrigatório' }),
    email: validatePresence({ presence: true, message: 'Obrigatório' }),
}