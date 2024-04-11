
/**
 * @jest-environment jsdom
 */

import * as dom from "@testing-library/dom"
// import mockEvent from '../__mocks__/single_store.js'

import { checkFileExtension } from '../containers/NewBill.js'

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localmockStore } from "../__mocks__/store.js"
import { ROUTES_PATH } from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  //set connection to employee
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee', email: 'test@test.fr'
  }));

  describe("When I am on NewBill Page", () => {
    document.body.innerHTML = NewBillUI()   //html is created by NewBillUI
    let newBillmocked;
    let spy1;
    let spy2;

    test("checkFileExtension returns false when handed file other than jpeg, jpg or png format",async () => {
      window.alert = jest.fn();

   
      checkFileExtension('test.txt')
expect(window.alert).not.toHaveBeenCalled();


      expect(checkFileExtension('test.txt')).toBe(false)

 window.alert.mockRestore();
    }); //end checkfileextension

    test("handleChangeFile stops when file extension other than png, jpg or jpeg is used", () => {
    

      //create instance
      newBillmocked = new NewBill({
        document: {
          querySelector: jest.fn().mockReturnValue({
            addEventListener: jest.fn(),
            files: ['mockFile'],
          }),
        },
        onNavigate: jest.fn(),
        store: {
          bills: jest.fn().mockReturnValue({
            create: jest.fn().mockResolvedValue({ fileUrl: 'mockFileUrl', key: 'mockKey' }),
            update: jest.fn().mockResolvedValue({}),
          }),
        },
        localStorage: {
          getItem: jest.fn(),
          setItem: jest.fn(),
        },
      });

      spy1 = jest.spyOn(newBillmocked.store,'bills')

      const mockeventinvalidfile= {
        preventDefault: jest.fn(),
        target:{
          value :'C:\fakepath\database_dev.sqlite'
        }

      }
//////////////////////////////////////end setup

newBillmocked.handleChangeFile(mockeventinvalidfile);

expect(spy1).not.toHaveBeenCalled();

//////////////////// end test

spy1.mockRestore();

newBillmocked = null;


//////cleanup 

    }); //end handlechangefile

    test("handlechangeFile submits uploaded file correctly ",async ()=>{

      //instance

            //create instance
            newBillmocked = new NewBill({
              document: {
                querySelector: jest.fn().mockReturnValue({
                  addEventListener: jest.fn(),
                  files: ['mockFile'],
                }),
              },
              onNavigate: jest.fn(),
              store: {
                bills: jest.fn().mockReturnValue({
                  create: jest.fn().mockResolvedValue({ fileUrl: 'mockFileUrl', key: 'mockKey' }),
                  update: jest.fn().mockResolvedValue({}),
                }),
              },
              localStorage: {
                getItem: jest.fn(),
                setItem: jest.fn(),
              },
            });
      
            spy2 = jest.spyOn(newBillmocked.store.bills(),'create')
      

            //mock formdata
            global.FormData = jest.fn(() => ({
              append: jest.fn(),
            }));

            //mock event

            const mockeventvalidfile= {
              preventDefault: jest.fn(),
              target:{
                value :'C:\\fakepath\test.jpg'
              }
      
            }

            const headers= {noContentType:true}

            //mock alert

            window.alert = jest.fn();
/////

await newBillmocked.handleChangeFile(mockeventvalidfile)


// Check if create() was called with mock FormData and headers
expect(spy2).toHaveBeenCalledWith({ data: expect.any(Object), headers: headers });
expect(window.alert).not.toHaveBeenCalled();

// Clean up
spy2.mockRestore();
newBillmocked=null;
window.alert.mockRestore();


    } ) //end correct submit





    test("handleSubmit calls function to submit new bill with inputted data", () => {
      // Create a mock event object
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

      const mockOnNavigate = jest.fn();

      // Mock localStorage.getItem
      const mockLocalStorageGetItem = jest.spyOn(window.localStorage.__proto__, 'getItem');
      mockLocalStorageGetItem.mockImplementation(() => JSON.stringify({ email: 'test@example.com' }));

      // Create an instance of the class that contains handleSubmit
      const instance = new NewBill({
        document: document,
        onNavigate: mockOnNavigate,
        localStorage: window.localStorage,
        store: localmockStore,
      });

      // Set fileUrl and fileName on the instance
      instance.fileUrl = 'http://example.com/file.jpg';
      instance.fileName = 'file.jpg';

      // Create a spy on the updateBill method
      const mockUpdateBill = jest.spyOn(instance, 'updateBill');
      mockUpdateBill.mockImplementation(() => { });

      // Call handleSubmit with the mock event
      instance.handleSubmit(mockEvent);


      // Call handleSubmit with the mock event
      instance.handleSubmit(mockEvent);

      // Check that preventDefault was called
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      // Check that updateBill was called with the correct bill
      expect(mockUpdateBill).toHaveBeenCalledWith({
        email: 'test@example.com',
        type: 'type',
        name: 'name',
        amount: 100,
        date: '2022-01-01',
        vat: '20',
        pct: 10,
        commentary: 'commentary',
        fileUrl: 'http://example.com/file.jpg',
        fileName: 'file.jpg',
        status: 'pending',
      });

      // Check that onNavigate was called with the correct path
      expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);

    }); // end test  handlesubmit




  }); // end second describe block
}); // end first describe block




// //instance with all dependencies mocked , for unit tests

// const newBillmocked = new NewBill({
//   document: {
//     querySelector: jest.fn().mockReturnValue({
//       addEventListener: jest.fn(),
//       files: ['mockFile'],
//     }),
//   },
//   onNavigate: jest.fn(),
//   store: {
//     bills: jest.fn().mockReturnValue({
//       create: jest.fn().mockResolvedValue({ fileUrl: 'mockFileUrl', key: 'mockKey' }),
//       update: jest.fn().mockResolvedValue({}),
//     }),
//   },
//   localStorage: {
//     getItem: jest.fn(),
//     setItem: jest.fn(),
//   },
// });


// //instance with real dependencies and mockstore

// const newBillreal = new NewBill({
//   document: document,
//   onNavigate: mockOnNavigate,
//   localStorage: window.localStorage,
//   store: localmockStore, // use localmockStore here
// })







