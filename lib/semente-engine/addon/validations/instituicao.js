import {validatePresence, validateNumber} from 'ember-changeset-validations/validators';

export default {
    name: validatePresence({ presence: true, message: 'Obrigatório' }),
    radical: validatePresence({ presence: true, message: 'Obrigatório' }),
    uf: validatePresence({ presence: true, message: 'Obrigatório' }),
    cidade: validatePresence({ presence: true, message: 'Obrigatório' }),
    nrgestores: [ validatePresence({ presence: true, message: 'Obrigatório' }),
                  validateNumber({gte: 0, message: 'Número positivo'})  ],
    nrcoordenadores: [ validatePresence({ presence: true, message: 'Obrigatório' }),
                  validateNumber({gte: 0, message: 'Número positivo'})  ],
    nrsecretaria: [ validatePresence({ presence: true, message: 'Obrigatório' }),
                  validateNumber({gte: 0, message: 'Número positivo'})  ],
    nrmarketing: [ validatePresence({ presence: true, message: 'Obrigatório' }),
                  validateNumber({gte: 0, message: 'Número positivo'})  ],
    nrinstrutores: [ validatePresence({ presence: true, message: 'Obrigatório' }),
                  validateNumber({gte: 0, message: 'Número positivo'})  ],
    nralunos: [ validatePresence({ presence: true, message: 'Obrigatório' }),
                  validateNumber({gte: 0, message: 'Número positivo'})  ],
                  
                  
}