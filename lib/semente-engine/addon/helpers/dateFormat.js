import { helper } from '@ember/component/helper';

export function dateFormat(timestamp) {
    let date = new Date(timestamp * 1000);
    let data = (date.getDate()) + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    let date_a = moment(data, "DD/MM/YYYY");
    return date_a.format('DD/MM/YYYY');
}
export default helper(dateFormat);