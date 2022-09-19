import { helper } from '@ember/component/helper';

export function dateTimeFormat(timestamp) {
    let date = new Date(timestamp * 1000);
    let data = (date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + (date.getHours() + 3) + ":" + date.getMinutes();
    let date_a = moment(data, "DD/MM/YYYY HH:mm");
    return date_a.format('DD/MM/YYYY HH:mm');
}
export default helper(dateTimeFormat);