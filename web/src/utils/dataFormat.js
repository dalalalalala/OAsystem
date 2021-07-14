function dateFormat(utcDate) {
  let date = new Date(utcDate);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  
}

export {
  dateFormat
}
