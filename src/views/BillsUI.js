import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"



import Actions from './Actions.js'

// const bills=getBills()

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }

const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}

export default ({ data: bills=[], loading, error }) => {

  console.log("Bills data",bills);

  //  bills.forEach((bill)=>{
  //           console.log("Date as string:",bill.date)})

  //           console.log("Bills with string dates",bills)

          bills.forEach((bill)=>{
            // console.log("Date as string:",bill.date)
            bill.date = new Date(bill.date);
            // console.log("Date as date:",bill.date)

          })

          bills=bills.sort(compareBillDatesDesc)
          // console.log("Bills",bills)
          // console.log('length', bills.length)
          // console.log("Bills sorted",bills)

          bills.forEach((bill) => {
            bill.date = bill.date.toISOString().split('T')[0];  // convert back to string
          });




  
  
  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }
  
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
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
