
// describe('My First Test', () => {
//   it('Visits the Kitchen Sink', () => {
//     cy.visit('https://example.cypress.io')
//     cy.contains('type').click()
//     cy.url().should('include', '/commands/actions')

//     cy.get('.action-email')
//       .type('fake@email.com')
//       .should('have.value', 'fake@email.com')
//   })
// })
describe('Visit Svelvet on localhost', () => {
  it('Visits http://localhost:3000', () => {
    cy.visit('/')
  })
})