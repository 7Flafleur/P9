/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';   // import
import * as dom from "@testing-library/dom"  // import entire library
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"       //import mock data
import RealBills from "../containers/Bills.js"
import { convertDateFormat, formatDate, formatStatus } from '../app/format.js';
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
      let dates = Array.from(document.querySelectorAll(".date")).map(el => el.innerHTML);
      // //console.log(dates)

      dates = dates.map(convertDateFormat);
      // //console.log(dates)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
      // console.log("DAtes",dates)
      // console.log("Dates sorted",datesSorted)
    })

    //////////////////////////////TEST ORIGINAL

    // document.body.innerHTML = BillsUI({ data: bills })
    // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
    // const antiChrono = (a, b) => ((a < b) ? 1 : -1)
    // const datesSorted = [...dates].sort(antiChrono)
    // expect(dates).toEqual(datesSorted)

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

      //console.log(mockStore)

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


      // create mock data to mock successfull get retrieval from store
      const mockBills = [
        { date: '2022-01-01', status: 'pending' },
        { date: '2022-02-01', status: 'accepted' },

      ];
      const mockStore = {
        bills: jest.fn().mockReturnThis(),
        list: jest.fn().mockResolvedValue(mockBills),
      };


      realbills = new RealBills({
        document: document,
        onNavigate: onNavigate,
        store: mockStore,            // realbills returns mockBills
        localStorage: localStorage

      })

      // 
      const bills = await realbills.getBills();

    //console.log("bills",bills)


      // Assert
      expect(mockStore.bills).toHaveBeenCalled();
      expect(mockStore.list).toHaveBeenCalled();
      expect(bills).toHaveLength(mockBills.length);
      

      for (let i = 0; i < mockBills.length; i++) {
        const expectedBill = {
          ...mockBills[i],
          date: formatDate(mockBills[i].date),
          status: formatStatus(mockBills[i].status),
        };
      //console.log('Expected:', expectedBill);
      //console.log('Actual:', bills[i]);
        expect(bills[i]).toEqual(expectedBill);
      }

      console/log("mockbills",mockBills)
console.log("length",mockBills.length)
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

    test("fetches bills from mock API GET", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      const BillsList = await mockStore.bills().list();
      const numberOfBills = BillsList.length;

      ////console.log("Number of bills in store",numberOfBills)


      //check if headers are correctly imported
      await dom.waitFor(() => {
        const tableHeaders = dom.screen.getAllByRole('columnheader');
        const expectedTerms = ['Type', 'Nom', 'Date', 'Montant', 'Statut', 'Actions']

        expectedTerms.forEach(expectedTerm => {
          const headerWithTerm = tableHeaders.find(header => header.textContent.includes(expectedTerm));
          expect(headerWithTerm).toBeDefined();
        });

      })
      
      //wait for correct number of bills to be retrieved
      const tableRows = dom.screen.getAllByRole('row')
      ////console.log("number of rows displayed",tableRows.length)
      expect(tableRows.length).toBe(numberOfBills + 1) //tableheaders count as rows

    })


    describe("When an API error occurs", () => {
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

      test("tries to fetch bills, fails with 404 error", async () => {

        //mock bills method used for GET requests
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {                  //mock rejection of promise                      
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await dom.screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("tries to fetch bills, returns error 500", async () => {

        //mock bills method used for GET requests
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {                  //mock rejection of promise                      
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await dom.screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()

      })

    })


  })
})



//Bills method looks like this:

// const bills = store.bills(); returns mockedBills
// mockedBills.list();
// mockedBills.create(bill);
// mockedBills.update(bill);

