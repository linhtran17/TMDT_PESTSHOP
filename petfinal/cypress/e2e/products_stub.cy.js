describe('Product list (stubbed)', () => {
  it('Hiển thị dữ liệu giả khi intercept API', () => {
    cy.intercept('GET', '**/api/products*', { fixture: 'products.json' }).as('getProducts');
    cy.visit('/admin/products');
    cy.wait('@getProducts');
    cy.contains('Thức ăn chó cao cấp').should('be.visible');
    cy.get('table tbody tr').its('length').should('be.gte', 2);
  });
});
