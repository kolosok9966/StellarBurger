declare namespace Cypress {
  interface Chainable {
    dragIngredientTo(ingredient: string, dropZone: string): Chainable<void>;
    addBun(): Chainable<void>;
    addMain(): Chainable<void>;
    addSauce(): Chainable<void>;
    openFirstIngredientModal(): Chainable<void>;
    closeModal(): Chainable<void>;
    createOrderMock(orderNumber?: number): Chainable<void>;
  }
}