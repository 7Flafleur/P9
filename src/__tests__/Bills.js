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



jest.mock("../app/store", () => mockStore)  //mock original 


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
      // console.log(dates)

      dates = dates.map(convertDateFormat);
      // console.log(dates)

      

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    //////////////////////////////TEST ORIGINAL

    // document.body.innerHTML = BillsUI({ data: bills })
    // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
    // const antiChrono = (a, b) => ((a < b) ? 1 : -1)
    // const datesSorted = [...dates].sort(antiChrono)
    // expect(dates).toEqual(datesSorted)





    ////////////////







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

      const newBIllForm = dom.screen.getByTestId('form-new-bill')
      expect(newBIllForm).toBeInTheDocument()

      realbills = null;

    });

    test("Clicking on eye icon opens up modal with bill in it", () => {

      realbills = new RealBills({
        document: document,
        onNavigate: onNavigate,
        store: mockStore,
        localStorage: localStorage
      });

     console.log(mockStore)

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

    test('getBills calls store methods and returns formatted bills', async () => {

    
      // Arrange, create mock data to mock successfull get retrieval from store
      const mockBills = [
        { date: '2022-01-01', status: 'pending' },
        { date: '2022-02-01', status: 'accepted' },
        
      ];
      const mockStore = {
        bills: jest.fn().mockReturnThis(),
        list: jest.fn().mockResolvedValue(mockBills),
      };
      

      realbills= new RealBills({
        document:document,
        onNavigate:onNavigate,
        store:mockStore,
        localStorage:localStorage
        
      })
    
      // 
      const bills = await realbills.getBills();
    
      // Assert
      expect(mockStore.bills).toHaveBeenCalled();
      expect(mockStore.list).toHaveBeenCalled();
      expect(bills).toHaveLength(mockBills.length);
      for (let i = 0; i < mockBills.length; i++) {
        expect(bills[i]).toEqual({
          ...mockBills[i],
          originaldate: mockBills[i].date,
          date: formatDate(mockBills[i].date),
          status: formatStatus(mockBills[i].status),
        });
      }
    });

  })




})


// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  let realbills;
  let mockbills;

  // Mock data

  const mockOnNavigate = jest.fn();
  
  const mockLocalStorage = localStorageMock;


  //mock instance

  mockbills = new RealBills({
    document: document,
    onNavigate: mockOnNavigate,
    store: mockStore,
    localStorage: mockLocalStorage
  });

 //number of bills in store 








  

  describe("When I navigate to Bills page", () => {

    test("fetches bills from mock API GET", async ()=>{
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      const BillsList=await mockStore.bills().list();
      const numberOfBills=BillsList.length;
    

      //check if headers are correctly importe
await dom.waitFor(()=>{      const tableHeaders=dom.screen.getAllByRole('columnheader');
const expectedTerms=['Type','Nom','Date','Montant', 'Statut','Actions']

expectedTerms.forEach(expectedTerm => {
  const headerWithTerm = tableHeaders.find(header => header.textContent.includes(expectedTerm));
  expect(headerWithTerm).toBeDefined();
});

})

  //wait for correct number of bills to be retrieved

      
        const tableRows= dom.screen.getAllByRole('row')
        expect(tableRows.length).toBe(numberOfBills+1) //tableheaders count as rows

    })




  })
})