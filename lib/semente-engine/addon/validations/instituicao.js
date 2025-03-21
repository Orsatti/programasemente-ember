import {validatePresence, validateNumber, validateLength, validateFormat} from 'ember-changeset-validations/validators';

export default {
        name:[ validatePresence({ presence: true, message: 'Obrigatório ' }), 
            validateLength({min: 3, message: ' Deve haver no mínimo 3 caracteres'})],

        radical:[ validatePresence({ presence: true, message: 'Obrigatório ' }),
                validateLength({is: 3, message: ' Devem haver 3 caracteres'})],

        uf: validatePresence({ presence: true, message: 'Obrigatório' }),

        cidade: validatePresence({ presence: true, message: 'Obrigatório' }),

        // nrgestores:[ validatePresence({ presence: true, message: ' ' }),
        //             validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        // nrcoordenadores:[ validatePresence({ presence: true, message: ' '}),
        //                 validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        // nrsecretaria:[ validatePresence({ presence: true, message: ' '}),
        //             validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        // nrmarketing:[ validatePresence({ presence: true, message: ' '}),
        //             validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nrinstrutores:[ validatePresence({ presence: true, message: ' '}),
                    validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],

        nralunos:[ validatePresence({ presence: true, message: ' '}),
                validateNumber({integer: true, gt: 0, message: 'Deve haver no mínimo 1'})],
}