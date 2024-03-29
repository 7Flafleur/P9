import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    $('#modaleFile').modal('show')
  }

  // modify this function to sort bills by date!
  getBills = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        let bills = snapshot
          .map(doc => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })


          // bills.forEach((bill)=>{
          //   console.log("Date as string:",bill.date)})

          // console.log("Bills with string dates",bills)

          // bills.forEach((bill)=>{
          //   console.log("Date as string:",bill.date)
          //   bill.date = new Date(bill.date);
          //   console.log("Date as date:",bill.date)

          // })

          // bills=bills.sort(compareBillDatesDesc)
          // console.log("Bills",bills)
          // console.log('length', bills.length)
          // console.log("Bills sorted",bills)

          // bills.forEach((bill) => {
          //   bill.date = bill.date.toISOString().split('T')[0];  // convert back to string
          // });

          

        return bills;
      })
    }
  }
}



function compareBillDatesDesc(bill1,bill2){
  if(bill1.date<bill2.date){
    return 1                                  //bill2 should come before bill1
  }
  else if (bill1.date>bill2.date){
    return -1
  }
  else{
    return 0;
  }

}

function compareBillDatesAsc(bill1,bill2){
  if(bill1.date>bill2.date){                 // bill1 should come after bill2
    return 1
  }
  else if (bill1.date<bill2.date){
    return -1
  }
  else{
    return 0;
  }

}


function formatDateToYYYYDDMM(dateObj) {
  let year = dateObj.getFullYear();
  let day = dateObj.getDate();
  let month = dateObj.getMonth() + 1; // getMonth() returns 0-11

  // Pad day and month with zeros if needed
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  return `${year}-${day}-${month}`;
}
