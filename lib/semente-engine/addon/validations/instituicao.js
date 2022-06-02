import {validatePresence, validateFormat} from 'ember-changeset-validations/validators';

export default {
    name: validatePresence({ presence: true, message: 'Obrigatório' }),
}