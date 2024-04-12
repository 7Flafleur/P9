/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';   // import
import * as dom from "@testing-library/dom"  // import entire library
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
// import { localmockStore } from '../__mocks__/store.js'
import mockStore from "../__mocks__/store"       //import mock data
import RealBills from "../containers/Bills.js"
import { formatDate,formatStatus } from '../app/format.js';

import router from "../app/Router.js";






jest.mock("../app/store", () => mockStore)  //mock original 




describe("Given I am connected as an employee", () => {


  let realbills;
  let mockbills;

  // Mock data
const mockDocument = { 
  querySelector: jest.fn().mockReturnValue({ addEventListener: jest.fn() }),
  querySelectorAll: jest.fn().mockReturnValue([{ addEventListener: jest.fn() }])
};
const mockOnNavigate = jest.fn();
const mockLocalStorage = localStorageMock; 


// //mock instance

// mockbills = new RealBills({
//   document: mockDocument,
//   onNavigate: mockOnNavigate,
//   store: mockStore,
//   localStorage: mockLocalStorage
// });




  describe("When I am on Bills Page", () => {
    // document.body.innerHTML = BillsUI({ data: bills }) //when on Bills page, body always needs to be rendered with billsUI
beforeEach(()=>{
  router()
  window.onNavigate(ROUTES_PATH.Bills)
})

    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
   
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
        store: mockStore,
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
 document.body.innerHTML = BillsUI({ data: bills })
      realbills = new RealBills({
        document: document,
        onNavigate: onNavigate,
        store: mockStore,
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
  })


  // test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      // router()
      // window.onNavigate(ROUTES_PATH.Bills)
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
      const rows=dom.within(table).queryAllByRole('cell');     //look for td,not th
      console.log("number of bills",rows.length)
      expect(rows.length).not.toEqual(0)

    })

  })
})


describe("When an API error occurs", ()=>{
  beforeEach(() => {
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
    )
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: "employee@test.tld"
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    router()
  })

  test("tries to fetch bills, fails with 404 error",async ()=>{

//mock bills method used for GET requests
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {                  //mock rejection of promise                      
          return Promise.reject(new Error("Erreur 404"))
        }
      }})
    await new Promise(process.nextTick);
 
  } )

  test("tries to fetch bills, returns error 500", async ()=>{

    //mock bills method used for GET requests
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {                  //mock rejection of promise                      
          return Promise.reject(new Error("Erreur 500"))
        }
      }})
    await new Promise(process.nextTick);
    const message = await dom.screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
    
  })



})





