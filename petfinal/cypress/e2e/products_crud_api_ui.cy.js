describe('Create & Delete Product (hybrid)', () => {
  const admin = { email: Cypress.env('adminEmail'), password: Cypress.env('adminPass') };
  let newId; const name = 'Snack demo (cypress)';

  before(() => cy.loginAs(admin.email, admin.password));

  it('Tạo bằng API và hiện trên UI', () => {
    cy.request('POST', `${Cypress.env('apiHost')}/api/products`, {
      name,
      picture: Cypress.env('pictureUrl'),
      cat_pro: Cypress.env('catProId'),
      cat_pet: Cypress.env('catPetId'),
      price: 99000, discount: 5, sale: 0, description: 'demo'
    }).its('body').then(b => {
      newId = b.id || b.data?.id;
      expect(newId).to.exist;
    });

    cy.visit('/admin/products');
    cy.contains(name).should('be.visible');
  });

  it('Xoá bằng API & không còn trên UI', () => {
    cy.request('DELETE', `${Cypress.env('apiHost')}/api/products/${newId}`)
      .its('status').should('be.oneOf', [200, 204]);
    cy.visit('/admin/products');
    cy.contains(name).should('not.exist');
  });
});
