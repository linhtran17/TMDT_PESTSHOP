// cypress/e2e/auth_guard.cy.js
describe('Router Guard /admin/products', () => {
  it('Guest -> redirect /login', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // đảm bảo không còn token trước khi app bootstrap
        win.localStorage.removeItem('token')
      }
    })

    // điều hướng vào route admin
    cy.window().its('__router__').invoke('push', '/admin/products')

    // phải bị đẩy sang /login
    cy.location('pathname', { timeout: 10000 }).should('include', '/login')
  })
})
