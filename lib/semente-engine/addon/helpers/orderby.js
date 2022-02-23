import Ember from 'ember';

export function orderBy(params) {
    let array = params[0];
    let property = params[1];
  
    if (!property) return array;
    if (array && array.sortBy) {
      return array.sortBy(property);
    }

}

export default Ember.Helper.helper(orderBy);
