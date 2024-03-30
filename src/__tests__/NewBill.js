/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("File extensions other than jpg,jpeg or png are refused", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      //to-do write assertion
    })
  })
})
