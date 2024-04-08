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
    function convertDateFormat(dateStr) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [day, month, year] = dateStr.split(' ');  //extract element from datestring
      const paddedMonth = (months.indexOf(month) + 1).toString().padStart(2, '0');  //add 0 to index of month if it only has one digit (less than 10)
      const currentYear = new Date().getFullYear(); // get current date
      const century = year > currentYear % 100 ? '19' : '20'; //divide by 100 to get current year in two digit format
      return `${century}${year}-${paddedMonth}-${day}`; //if date year is greater than current year, set first two digits of year to 19, else to 20
        }

    test("Then bills should be ordered from earliest to latest", () => {
      let dates = Array.from(document.querySelectorAll(".date")).map(el => el.innerHTML);   
         console.log(dates)
      
       dates = dates.map(convertDateFormat);
       console.log(dates)

      // document.body.innerHTML = BillsUI({ data: bills })
      // const dateRegex = /\b\d{2} [A-Z][a-z]{2}\. \d{2}\b/;
      // const dates = dom.screen.getAllByText(dateRegex).map(a => a.innerHTML)
      // console.log(dates1)
      // // const dates = dom.screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
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
      
      const eye = document.querySelector("[data-billid='47qAXb6fIm2zOKkLzMro']");

      

      eye.addEventListener('click', realbills.handleClickIconEye(eye))
      
      dom.fireEvent.click(eye)

   
        // Check that the modal function was called
  expect($.fn.modal).toHaveBeenCalledWith('show');

      // const modale = dom.screen.getByTestId('modal-dialog')
      // expect(modale).toBeTruthy()

    })


  })


    // describe("When I navigate to Bill page", () => {
    //   document.body.innerHTML = BillsUI({ data: bills }) //when on Bills page, body always needs to be rendered with billsUI

    //   test("fetches bills from mock API GET", async () => {
    //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //     window.localStorage.setItem('user', JSON.stringify({
    //       type: 'Employee'
    //     }))
    //     const root = document.createElement("div")
    //     root.setAttribute("id", "root")
    //     document.body.append(root)
    //     router()
    //     window.onNavigate(ROUTES_PATH.Bills)
    //     await dom.waitFor(() => dom.screen.getByText("Mes notes de frais"))
    //     const contentType  = await dom.screen.getByText("Type")
    //     // expect(contentType).toBeTruthy()
        // const contentNom  = dom.screen.getByText("Nom")
        // expect(contentNom).toBeTruthy()
        // const contentDate = dom.screen.getByText("Date")
        // expect(contentDate).toBeTruthy()
        // const contentMontant = dom.screen.getByText("Montant")
        // expect(contentMontant).toBeTruthy()
        // const contentStatut = dom.screen.getByText("Statut")
        // expect(contentStatut).toBeTruthy()
        // const contentActions = dom.screen.getByText("Actions")
        // expect(contentActions).toBeTruthy()
      
        // expect(dom.screen.getByTestId("btn-new-bill")).toBeInTheDocument()
        // expect(dom.screen.getByTestId("icon-window")).toBeInTheDocument()
        // expect(dom.screen.getByTestId("icon-mail")).toBeInTheDocument()
      // })

    // describe("When an error occurs on API", () => {
    //   beforeEach(() => {
    //     jest.spyOn(mockStore, "bills")
    //     Object.defineProperty(
    //         window,
    //         'localStorage',
    //         { value: localStorageMock }
    //     )
    //     window.localStorage.setItem('user', JSON.stringify({
    //       type: 'Admin',
    //       email: "a@a"
    //     }))
    //     const root = document.createElement("div")
    //     root.setAttribute("id", "root")
    //     document.body.appendChild(root)
    //     router()
    //   })
    //   test("fetches bills from an API and fails with 404 message error", async () => {
  
    //     mockStore.bills.mockImplementationOnce(() => {
    //       return {
    //         list : () =>  {
    //           return Promise.reject(new Error("Erreur 404"))
    //         }
    //       }})
    //     window.onNavigate(ROUTES_PATH.Dashboard)
    //     await new Promise(process.nextTick);
    //     const message = await dom.screen.getByText(/Erreur 404/)
    //     expect(message).toBeTruthy()
    //   })
  
    //   test("fetches messages from an API and fails with 500 message error", async () => {
  
    //     mockStore.bills.mockImplementationOnce(() => {
    //       return {
    //         list : () =>  {
    //           return Promise.reject(new Error("Erreur 500"))
    //         }
    //       }})
  
    //     window.onNavigate(ROUTES_PATH.Dashboard)
    //     await new Promise(process.nextTick);
    //     const message = await dom.screen.getByText(/Erreur 500/)
    //     expect(message).toBeTruthy()
    //   })
    // })
  

  



    // })

  })


  // test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await dom.waitFor(() => dom.screen.getByText("Mes notes de frais"))
      await dom.waitFor(()=> document.getElementById("data-table"))
      const contentPending  = await dom.screen.getByText("Type")
      expect(contentPending).toBeTruthy()
      const contentRefused  = await dom.screen.getByText("Nom")
      expect(contentRefused).toBeTruthy()
      const contentActions= await dom.screen.getByText("Actions")
      expect(contentActions).toBeTruthy()
      const contentDate = await dom.screen.getByText("Date")
      expect(contentDate).toBeTruthy()
      const contentMontant = await dom.screen.getByText("Montant")
      expect(contentMontant).toBeTruthy()
      const contentStatut = await dom.screen.getByText("Statut")
      expect(contentStatut).toBeTruthy()
      await dom.waitFor(() => dom.screen.getByTestId('icon-window'))
      expect(dom.screen.getByTestId("icon-window")).toBeTruthy()
      await dom.waitFor(() => dom.screen.getByTestId('icon-mail'))
      expect(dom.screen.getByTestId("icon-mail")).toBeTruthy()

      const table=document.querySelector('#example')
      const rows=dom.within(table).queryAllByRole('row');
      expect(rows.length).not.toBe(0)

    })
  // describe("When an error occurs on API", () => {
  //   beforeEach(() => {
  //     jest.spyOn(mockStore, "bills")
  //     Object.defineProperty(
  //         window,
  //         'localStorage',
  //         { value: localStorageMock }
  //     )
  //     window.localStorage.setItem('user', JSON.stringify({
  //       type: 'Admin',
  //       email: "a@a"
  //     }))
  //     const root = document.createElement("div")
  //     root.setAttribute("id", "root")
  //     document.body.appendChild(root)
  //     router()
  //   })
  //   test("fetches bills from an API and fails with 404 message error", async () => {

  //     mockStore.bills.mockImplementationOnce(() => {
  //       return {
  //         list : () =>  {
  //           return Promise.reject(new Error("Erreur 404"))
  //         }
  //       }})
  //     window.onNavigate(ROUTES_PATH.Dashboard)
  //     await new Promise(process.nextTick);
  //     const message = await dom.screen.getByText(/Erreur 404/)
  //     expect(message).toBeTruthy()
  //   })

  //   test("fetches messages from an API and fails with 500 message error", async () => {

  //     mockStore.bills.mockImplementationOnce(() => {
  //       return {
  //         list : () =>  {
  //           return Promise.reject(new Error("Erreur 500"))
  //         }
  //       }})

  //     window.onNavigate(ROUTES_PATH.Dashboard)
  //     await new Promise(process.nextTick);
  //     const message = await dom.screen.getByText(/Erreur 500/)
  //     expect(message).toBeTruthy()
  //   })
  // })

  })
})