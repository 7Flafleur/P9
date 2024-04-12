import { bills } from "../fixtures/bills"
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"       //import mock data
import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import router from "../app/Router"  
import userEvent from '@testing-library/user-event'

jest.mock("../app/store", () => mockStore)  //create


// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to NewBills", () => {
    document.body.innerHTML = NewBillUI()   //html is created by NewBillUI
let consoleSpy;


const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }

const newBillMocked=new NewBill({
    document,
    onNavigate,
    localStorage:window.localStorage,
    store:mockStore,
})

const mockeventvalidfile = {
    preventDefault: jest.fn(),
    target: {
      value: 'C:\fakepath\database.png'
    }
}

const mockEvent = {
    preventDefault: jest.fn(),
    target: {
      querySelector: jest.fn().mockImplementation((selector) => {
        switch (selector) {
          case 'select[data-testid="expense-type"]': return { value: 'type' };
          case 'input[data-testid="expense-name"]': return { value: 'name' };
          case 'input[data-testid="amount"]': return { value: '100' };
          case 'input[data-testid="datepicker"]': return { value: '2022-01-01' };
          case 'input[data-testid="vat"]': return { value: '20' };
          case 'input[data-testid="pct"]': return { value: '10' };
          case 'textarea[data-testid="commentary"]': return { value: 'commentary' };
          default: return null;
        }
      }),
    },
  };



    describe("When an error occurs on API", () => {
      beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error');
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "e@e"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      afterEach(()=>{
        consoleSpy.mockRestore();
      })
      
      test("fetches bills from an API and fails with 404 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create : () =>  {                                       
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.NewBill)
        newBillMocked.handleChangeFile(mockeventvalidfile)
        await new Promise(process.nextTick);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(new Error("Erreur 404"));
          });
      
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            update : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
  
        window.onNavigate(ROUTES_PATH.NewBill)
        newBillMocked.handleSubmit(mockEvent)
        await new Promise(process.nextTick);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(new Error("Erreur 500"));
          });
      
      
      })
    })
  
    })
  })
  





