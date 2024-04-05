 // simulate clicking on submit button after filling out the form
 
 
 const mockEvent = {
    preventDefault: jest.fn(), //mock function of default submit that happens every time a submit button is clicked
    //simulate calling the queryselector method 
    target: {       
      querySelector: jest.fn().mockImplementation((selector) => {
        switch (selector) {
           // if handlesubmit function calls queryselector on html element  
          case 'select[data-testid="expense-type"]': return { value: 'Transports' };
          case 'input[data-testid="expense-name"]': return { value: 'NomDépense' };
          case 'input[data-testid="amount"]': return { value: '100' };
          case 'input[data-testid="datepicker"]': return { value: '2022-01-01' };
          case 'input[data-testid="vat"]': return { value: '20' };
          case 'input[data-testid="pct"]': return { value: '10' };
          case 'textarea[data-testid="commentary"]': return { value: 'Commentaire' };
          default: return null;
        }
      }),
    },
  };