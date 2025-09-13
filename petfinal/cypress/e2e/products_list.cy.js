describe('Admin Product List (real API)', () => {
  const admin = { email: Cypress.env('adminEmail'), password: Cypress.env('adminPass') };
  beforeEach(() => cy.loginAs(admin.email, admin.password));
  it('Bảng hiển thị & khớp dữ liệu API', () => {
    cy.request('GET', `${Cypress.env('apiHost')}/api/products?page=1&size=10`)
      .its('body').then(j => {
        const items = j.list || [];
        cy.visit('/admin/products');
        cy.get('table tbody tr').its('length')
          .should('be.gte', Math.min(items.length, 10));
        if (items.length) cy.contains(items[0].name).should('be.visible');
      });
  });
});
