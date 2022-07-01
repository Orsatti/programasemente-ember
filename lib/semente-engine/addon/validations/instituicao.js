import {validatePresence, validateNumber, validateLength, validateFormat} from 'ember-changeset-validations/validators';
//import validateCustom from 'ember-changeset-validations/validators/custom';
export default {
        name:[ validatePresence({ presence: true, message: ' ' }), 
            validateLength({min: 3, message: 'Nome precisa ter no mínimo 3 caracteres'})],

        radical: validatePresence({ presence: true, message: 'Obrigatório' }),

        uf: validatePresence({ presence: true, message: 'Obrigatório' }),

        cidade: validatePresence({ presence: true, message: 'Obrigatório' }),

        nrgestores:[ validatePresence({ presence: true, message: ' ' }),
                    validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nrcoordenadores:[ validatePresence({ presence: true, message: ' '}),
                        validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nrsecretaria:[ validatePresence({ presence: true, message: ' '}),
                    validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nrmarketing:[ validatePresence({ presence: true, message: ' '}),
                    validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nrinstrutores:[ validatePresence({ presence: true, message: ' '}),
                    validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nralunos:[ validatePresence({ presence: true, message: ' '}),
                validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],
}