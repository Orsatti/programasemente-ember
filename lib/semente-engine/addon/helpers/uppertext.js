import { helper } from '@ember/component/helper';

export function uppertext(string) {
  
  let str = string.toString().toUpperCase();
  
  return str
 
 }
export default helper(uppertext);
