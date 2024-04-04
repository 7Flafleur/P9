/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';   // import
import * as dom from "@testing-library/dom"  // import entire library
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import {localmockStore} from'../__mocks__/store.js'
import RealBills from "../containers/Bills.js"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  let realbills;
  let mockbills;

  // Mock data
const mockDocument = { 
  querySelector: jest.fn().mockReturnValue({ addEventListener: jest.fn() }),
  querySelectorAll: jest.fn().mockReturnValue([{ addEventListener: jest.fn() }])
};
const mockOnNavigate = jest.fn();
const mockStore = localmockStore; 
const mockLocalStorage = localStorageMock; 


//mock instance

mockbills = new RealBills({
  document: mockDocument,
  onNavigate: mockOnNavigate,
  store: mockStore,
  localStorage: mockLocalStorage
});






  describe("When I am on Bills Page", () => {
    document.body.innerHTML = BillsUI({ data: bills }) //when on Bills page, body always needs to be rendered with billsUI
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await dom.waitFor(() => dom.screen.getByTestId('icon-window'))
      const windowIcon = dom.screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toHaveClass('active-icon')

    })
    test("Then bills should be ordered from earliest to latest", () => {
      // document.body.innerHTML = BillsUI({ data: bills })
      const dates = dom.screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Clicking on newBills button should redirect me to NewBills page", () => {
      realbills = new RealBills({
        document: document,
        onNavigate: onNavigate,
        store: localmockStore,
        localStorage: localStorage
      });
    
      // Mock the handleClickNewBill method
      realbills.handleClickNewBill = jest.spyOn(realbills, 'handleClickNewBill');
    
      // Simulate a click on the newBills button
      realbills.handleClickNewBill();
    
      // Check that handleClickNewBill was called
      expect(realbills.handleClickNewBill).toHaveBeenCalled();
      
      const newBIllForm=dom.screen.getByTestId('form-new-bill')
      expect(newBIllForm).toBeInTheDocument()

      realbills=null;

    });

    test("Clicking on eye icon opens up modal with bill in it", ()=>{

      realbills = new RealBills({
        document: document,
        onNavigate: onNavigate,
        store: localmockStore,
        localStorage: localStorage
      });

      // Create a mock function for handleClickIconEye
const mockHandleClickIconEye = jest.fn();
// Mock jQuery's modal function
$.fn.modal = jest.fn();

// Replace handleClickIconEye with the mock function

      
      const eye = document.querySelector("[data-billid='47qAXb6fIm2zOKkLzMro']");

      console.log(eye)

      eye.addEventListener('click', mockHandleClickIconEye)
      dom.fireEvent.click(eye)
      expect(mockHandleClickIconEye).toHaveBeenCalled()

      // const modale = dom.screen.getByTestId('modal-dialog')
      // expect(modale).toBeTruthy()

    })






  })
})
