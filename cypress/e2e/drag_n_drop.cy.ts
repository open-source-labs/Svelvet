
describe('Moves nodes in the Svelvet Component', () => {
  it('navigate to the home page', () => {
    cy.visit('/testingplayground')
  })
  describe('Drag n Drop', () => {

    describe('move a node', () => {
      const moveNode = (number, x, y) => {
        cy.get(`#${number}`)
          .trigger('mousedown', { eventConstructor: 'MouseEvent', button: 1 })
          .trigger('mousemove', { eventConstructor: 'MouseEvent', button: 1, movementX: x, movementY: y })
          .trigger('mouseup')
      }
      it('moves all nodes to a new locations', () => {
        cy.viewport(1000, 1000)
        // //cy.get(`#10`).then(() => moveNode(10, -50, -150)).should('have.attr', 'style')
        cy.get(`#10`).then(($div) => {
          const style1 = $div[0].attributes[2].textContent
          console.log('div-->', $div)
          console.log('div-->', style1)
          moveNode(10, -50, -150)
          cy.get('#10').then(($div2) => {
            const style2 = $div2[0].attributes[2].textContent
            expect(style1).not.to.eq(style2)
          })
        })
        moveNode(10, -50, -150)
        moveNode(9, 0, -200)
        moveNode(8, -100, -200)
        moveNode(7, 0, 200)
        moveNode(6, -200, -700)
        moveNode(5, -700, 0)
        moveNode(4, 50, -200)
        moveNode(3, 300, 700)
        moveNode(2, 200, 70)
        moveNode(1, 160, 80)
      })
    })
  })
})