/// <reference types="cypress" />

import { SELECTORS } from './selectors';

Cypress.Commands.add('dragIngredientTo', (ingredientSelector, dropZoneSelector) => {
  cy.get(ingredientSelector).first().trigger('dragstart');
  cy.get(dropZoneSelector).trigger('drop');
});

Cypress.Commands.add('addBun', () => {
  cy.dragIngredientTo(
    SELECTORS.ingredientCardBun,
    SELECTORS.constructorBunTop
  );
});

Cypress.Commands.add('addMain', () => {
  cy.dragIngredientTo(
    SELECTORS.ingredientCardMain,
    SELECTORS.constructorItems
  );
});

Cypress.Commands.add('addSauce', () => {
  cy.dragIngredientTo(
    SELECTORS.ingredientCardSauce,
    SELECTORS.constructorItems
  );
});

Cypress.Commands.add('openFirstIngredientModal', () => {
  cy.get(SELECTORS.ingredientCard).first().click();
});

Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.modalClose).click();
});

Cypress.Commands.add('createOrderMock', (orderNumber = 123456) => {
  cy.intercept('POST', '**/orders', {
    body: {
      success: true,
      order: { number: orderNumber }
    }
  }).as('createOrder');
});