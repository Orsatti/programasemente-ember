import Ember from 'ember';

export function filter(array, ByObj) {
    let filt = array.filter(element => element.aula == ByObj);
    return filt
}

export default Ember.Helper.helper(filter);
