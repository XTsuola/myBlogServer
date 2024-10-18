 export function getTime(data) {
    const newDate = new Date(data);
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : "0" + (newDate.getMonth() + 1);
    const day = newDate.getDate() > 9 ? newDate.getDate() : "0" + newDate.getDate();
    return year + "年" + month + "月" + day + "日";
}