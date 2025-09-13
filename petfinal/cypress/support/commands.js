

function tokenFrom(body){ return body?.data?.token || body?.token || body?.accessToken }

Cypress.Commands.add('loginAs', (email, password) => {
  cy.request('POST', `${Cypress.env('apiHost')}/api/auth/login`, { email, password })
    .its('body').then(b => {
      const t = tokenFrom(b)
      expect(t, 'JWT').to.match(/^eyJ/)
      window.localStorage.setItem('token', t) // FE đọc token ở đây
    })
})
