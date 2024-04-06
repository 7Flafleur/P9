/**
 * @jest-environment jsdom
 */

import * as dom from "@testing-library/dom"
// import mockEvent from '../__mocks__/single_store.js'
import {localStorageMock} from "../__mocks__/localStorage.js";
import {localmockStore} from'../__mocks__/store.js'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import checkFileExtension from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";



describe("Given I am connected as an employee", () => {
  // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  // window.localStorage.setItem('user', JSON.stringify({
  //   type: 'Employee',email: 'test@test.fr'
  });
  describe("When I am on NewBill Page", () => {
    document.body.innerHTML = NewBillUI()   //html is created by NewBillUI
      // Mock onNavigate
      // const mockOnNavigate = jest.fn();


      // const newbill=new NewBill({
      //   document:document,
      //   onNavigate:mockOnNavigate,
      //   store:localmockStore,
      //   localStorage:localStorage        //use storage set above 
      // })
    
    const mockfile={name: "database_dev.sqlite", lastModified: 1711796144723, webkitRelativePath: "", size: 24576, type: "" }

    test("File extensions other than jpg,jpeg or png are refused", () => {
      const mockEventFile = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\database_dev.sqlite',
          querySelector: jest.fn().mockImplementation((selector) => {
            if (selector === 'input[data-testid="file"]') {
              return { files: [new File([''], 'database_dev.sqlite')] };
            }
            return null;
          }),
        },
      };
  
      const mockOnNavigate=jest.fn();
      const checkFileExtension = jest.fn();
    
      // Mock localStorage.getItem
      const mockLocalStorageGetItem = jest.spyOn(window.localStorage.__proto__, 'getItem');
      mockLocalStorageGetItem.mockImplementation(() => JSON.stringify({ email: 'test@example.com' }));
    
      const localmockStoreh = {
        bills: jest.fn().mockReturnValue({
          create: jest.fn().mockResolvedValue({ fileUrl: 'url', key: 'key' }),
        }),
      };

  // Create an instance of the class that contains handlechangeFile
  const newBillhandle = new NewBill({
    document: document,
    onNavigate: mockOnNavigate,
    localStorage: window.localStorage,
    store: localmockStoreh,
  });
  

  // Call  with the mock event
  newBillhandle.handleChangeFile(mockEventFile);
  

    
      // Check that preventDefault was called
      expect(mockEventFile.preventDefault).toHaveBeenCalled();
      // expect(checkFileExtension).toHaveBeenCalledWith('file.txt');
    

     
      
      
   
    }); //end file extensions









test('handleSubmit', () => {
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
mockUpdateBill.mockImplementation(() => {});

// Call handleSubmit with the mock event
instance.handleSubmit(mockEvent);

// Add your assertions here
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
  



  })
  

