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
  // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  // window.localStorage.setItem('user', JSON.stringify({
  //   type: 'Employee',email: 'test@test.fr'
});
describe("When I am on NewBill Page", () => {
  document.body.innerHTML = NewBillUI()   //html is created by NewBillUI

  test("checkFileExtension returns fals when handed file other than jpeg, jpg or png format",()=>{
    expect(checkFileExtension('test.txt')).toBe(false)
  })

  test("handlechangefile stops when file extension other that png, jpg or jpeg is used", () => {

  })











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




})


