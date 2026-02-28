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
    cy.get('[data-cy="ingredient-card"][data-type="bun"]').first()
      .trigger('dragstart');

    cy.get('[data-cy=constructor-bun-top]')
      .trigger('drop');

    cy.get('[data-cy=constructor-bun-top]')
      .should('not.contain.text', 'Выберите булки');
  });

  it('Перетаскивание начинки в конструктор', () => {
    cy.get('[data-cy="ingredient-card"][data-type="main"]').first()
      .trigger('dragstart');

    cy.get('[data-cy=constructor-items]')
      .trigger('drop');

    cy.get('[data-cy=constructor-items]')
      .children()
      .should('have.length.greaterThan', 0);
  });

  it('Перетаскивание соуса в конструктор', () => {
    cy.get('[data-cy="ingredient-card"][data-type="sauce"]').first()
      .trigger('dragstart');

    cy.get('[data-cy=constructor-items]')
      .trigger('drop');

    cy.get('[data-cy=constructor-items]')
      .children()
      .should('have.length.greaterThan', 0);
  });

  // ============================================================
  // 2. Открытие модалки ингредиента
  // ============================================================

  it('Открывается модальное окно ингредиента', () => {
    cy.get('[data-cy=ingredient-card]').first().click();

    cy.get('[data-cy=modal]').should('exist');
  });

  // ============================================================
  // 3. Проверка данных в модалке
  // ============================================================

  it('В модальном окне отображаются данные ингредиента', () => {
    cy.get('[data-cy=ingredient-card]')
      .first()
      .as('ingredient');

    cy.get('@ingredient')
      .find('[data-cy=ingredient-name]')
      .last()
      .invoke('text')
      .then((name) => {
        cy.get('@ingredient').click();

        cy.get('[data-cy=modal]')
          .should('contain.text', name.trim());
      });
  });

  // ============================================================
  // 4. Открытие модалки заказа
  // ============================================================

  it('Открывается модалка с номером заказа', () => {
    cy.intercept('POST', '**/orders', {
      body: {
        success: true,
        order: { number: 123456 }
      }
    }).as('createOrder');

    // добавляем булку
    cy.get('[data-cy="ingredient-card"][data-type="bun"]').first()
      .trigger('dragstart');
    cy.get('[data-cy=constructor-bun-top]')
      .trigger('drop');

    // добавляем начинку
    cy.get('[data-cy="ingredient-card"][data-type="main"]').first()
      .trigger('dragstart');
    cy.get('[data-cy=constructor-items]')
      .trigger('drop');

    // добавляем соус
    cy.get('[data-cy="ingredient-card"][data-type="sauce"]').first()
      .trigger('dragstart');
    cy.get('[data-cy=constructor-items]')
      .trigger('drop');

    cy.contains('Оформить заказ').click();

    cy.wait('@createOrder');

    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]')
      .should('contain.text', '123456');
  });

  // ============================================================
  // 5. Закрытие модалки по кнопке
  // ============================================================

  it('Модалка закрывается по кнопке закрытия', () => {
    cy.get('[data-cy=ingredient-card]').first().click();

    cy.get('[data-cy=modal]').should('exist');

    cy.get('[data-cy=modal-close]').click();

    cy.get('[data-cy=modal]').should('not.exist');
  });

  // ============================================================
  // 6. Закрытие по Escape
  // ============================================================

  it('Модалка закрывается по клавише Escape', () => {
    cy.get('[data-cy=ingredient-card]').first().click();

    cy.get('[data-cy=modal]').should('exist');

    cy.get('body').type('{esc}');

    cy.get('[data-cy=modal]').should('not.exist');
  });
});