describe('The Home Page', () => {
  const navLinks = ['Docs', 'Github', 'REPL'];
  const buttons = ['Get Started', 'Learn More', 'Install Now', 'See Svelvet on GitHub'];
    it('successfully loads home page', () => {
      cy.visit('/')
    })
    it('contains correct links in Nav Bar', () => {
      cy.contains('Docs')
      cy.contains('Blog')
      cy.contains('Github')
      cy.contains('REPL')
      cy.contains('Log In')
    })
    it('checks that the nav bar links are working, excluding GitHub OAuth', () => {
      navLinks.forEach(page => {
        cy.contains(page)
          .then((link) => {
            cy.request(link.prop('href'))
          })
      })
    })
    it('checks that all the button links are working, excluding GitHub OAuth', () => {
      buttons.forEach(page => {
        cy.contains(page)
          .then((link) => {
            cy.request(link.prop('href'))
          })
      })
    })
    it('checks for a rendered Svelvet Component', () => {
      cy.get('.Svelvet')
        .should('be.visible')
    })
  })
