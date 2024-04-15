export const formatDate = (dateStr) => {
  // console.log("Date before",dateStr)
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}


export function convertDateFormat(dateStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = dateStr.split(' ');  //extract element from datestring
  const paddedMonth = (months.indexOf(month) + 1).toString().padStart(2, '0');  //add 0 to index of month if it only has one digit (less than 10)
  const currentYear = new Date().getFullYear(); // get current date
  const century = year > currentYear % 100 ? '19' : '20'; //divide by 100 to get current year in two digit format
  return `${century}${year}-${paddedMonth}-${day}`; //if date year is greater than current year, set first two digits of year to 19, else to 20
}