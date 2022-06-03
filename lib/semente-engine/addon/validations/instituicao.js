import {validatePresence, validateNumber} from 'ember-changeset-validations/validators';

export default {
    name: [ validatePresence({ presence: true, message: 'Obrigatório' })],
    radical: validatePresence({ presence: true, message: 'Obrigatório' }),
    uf: validatePresence({ presence: true, message: 'Obrigatório' }),
    cidade: validatePresence({ presence: true, message: 'Obrigatório' }),
    nrgestores: validatePresence({ presence: true, message: 'Obrigatório' }),
    nrcoordenadores: validatePresence({ presence: true, message: 'Obrigatório' }),
    nrsecretaria: validatePresence({ presence: true, message: 'Obrigatório' }),
    nrmarketing: validatePresence({ presence: true, message: 'Obrigatório' }),
    nrinstrutores: validatePresence({ presence: true, message: 'Obrigatório' }),
    nralunos: validatePresence({ presence: true, message: 'Obrigatório' }),
}