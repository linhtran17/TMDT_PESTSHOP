describe('Smoke', () => {
  it('Home page loads', () => {
    cy.visit('/')
    cy.contains('PetStore', { matchCase: false }) // tùy text header của bạn
  })
})
