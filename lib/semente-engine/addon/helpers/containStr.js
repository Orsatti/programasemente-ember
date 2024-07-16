import Ember from 'ember';

export function containStr(params) {
    return params[1].includes(params[0])
}

export default Ember.Helper.helper(containStr);