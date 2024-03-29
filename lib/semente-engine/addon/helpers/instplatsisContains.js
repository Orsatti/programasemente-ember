import Ember from 'ember';

export function instplatsisContains(param) {
    if (param[1]) {
        let itens = param[1].filter(function(el) { 
            return el.get('sistema').get('idx') == param[2]; 
        }).filter(function(el) { 
            return el.get('plataformaAno').get('id') == param[0].id; 
        });
        
        if(param[3] != null){
            itens = itens.filter(function(el) { 
                return el.get('isEssencial').toString() == param[3]; 
            });
        }

        if (itens.length > 0) {
            return true;
        }
        else return false;
    }
    else return false;
}

export default Ember.Helper.helper(instplatsisContains);