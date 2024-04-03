/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("File extensions other than jpg,jpeg or png are refused", () => {
      document.body.innerHTML = NewBillUI()   //html is created by NewBillUI
      
      
      //to-do write assertion
    });




test("If required fields are not filled in , form will not be sent",()=>{
document.body.innerHTML=NewBillUI()

});



  })
  
})

