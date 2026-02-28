import { SELECTORS } from '../support/selectors';

describe('Страница "Конструктор"', () => {
  beforeEach(() => {
    // --- Мокаем ингредиенты ---
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // --- Мокаем пользователя ---
    cy.intercept('GET', '**/auth/user', {
      body: {
        success: true,
        user: {
          email: 'test@test.ru',
          name: 'Test User'
        }
      }
    }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  // ============================================================
  // 1. Drag & Drop ингредиента
  // ============================================================
  it('Перетаскивание булки в конструктор', () => {
      cy.addBun();

      cy.get(SELECTORS.constructorBunTop)
        .should('not.contain.text', 'Выберите булки');
    });

  it('Перетаскивание начинки в конструктор', () => {
    cy.addMain();

    cy.get(SELECTORS.constructorItems)
      .children()
      .should('have.length.greaterThan', 0);
  });

  it('Перетаскивание соуса в конструктор', () => {
    cy.addSauce();

    cy.get(SELECTORS.constructorItems)
      .children()
      .should('have.length.greaterThan', 0);
  });

  // ============================================================
  // 2. Открытие модалки ингредиента
  // ============================================================

  it('Открытие модального окна ингредиента', () => {
    cy.openFirstIngredientModal();

    cy.get(SELECTORS.modal).should('exist');
  });

  // ============================================================
  // 3. Проверка данных в модалке
  // ============================================================

  it('В модальном окне отображаются данные ингредиента', () => {
    cy.get(SELECTORS.ingredientCard)
      .first()
      .as('ingredient');

    cy.get('@ingredient')
      .find(SELECTORS.ingredientName)
      .last()
      .invoke('text')
      .then((name) => {
        cy.get('@ingredient').click();

        cy.get(SELECTORS.modal)
          .should('contain.text', name.trim());
      });
  });

  // ============================================================
  // 4. Открытие модалки заказа
  // ============================================================

  it('Открытие модального окна заказа', () => {
    cy.createOrderMock(123456);

    cy.addBun();
    cy.addMain();
    cy.addSauce();

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get(SELECTORS.modal)
      .should('contain.text', '123456');
  });

  // ============================================================
  // 5. Закрытие модалки по кнопке
  // ============================================================

  it('Закрытие модалки по кнопке', () => {
    cy.openFirstIngredientModal();

    cy.get(SELECTORS.modal).should('exist');

    cy.closeModal();

    cy.get(SELECTORS.modal).should('not.exist');
  });

  // ============================================================
  // 6. Закрытие по Escape
  // ============================================================

  it('Закрытие по Escape', () => {
    cy.openFirstIngredientModal();

    cy.get(SELECTORS.modal).should('exist');

    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });
});