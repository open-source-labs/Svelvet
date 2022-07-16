
describe('Moves nodes in the Svelvet Component', () => {
  it('navigate to the home page', () => {
    cy.visit('/testingplayground')
    cy.viewport(500,350)

  })
  describe('Drag n Drop', () => {

    describe('move a node', () => {
      const moveNode = (number) => {
        //cy.trigger
        cy.get(`#${number}`)
          .trigger('mousedown', { eventConstructor: 'MouseEvent', button: 1, screenX: 2617, screenY: 365 })

          .trigger('mousemove', { eventConstructor: 'MouseEvent', button: 1, screenX: 2618, screenY: 365 })
          .trigger('mousemove', { eventConstructor: 'MouseEvent', button: 1, screenX: 2619, screenY: 365 })
          .trigger('mousemove', { eventConstructor: 'MouseEvent', button: 1, screenX: 2620, screenY: 365 })

          // .trigger('mousemove', { eventConstructor: 'MouseEvent', clientX: 200, clientY: 150, pageX: 200, PageY: 150 })
          // .trigger('mousemove', { eventConstructor: 'MouseEvent', clientX: 352, clientY: 344, pageX: 352, PageY: 344, screenX: 2080, screenY: 471 })
          // .trigger('mousemove', { eventConstructor: 'MouseEvent', clientX: x, clientY: y })
          //.trigger('mouseright', { which: 1, pageX: x, pageY: y })
          //.trigger('mouseup', { force: false })
          .trigger('mouseup')
      }
      it('moves a node to a new location', () => {
        moveNode(1)
        
      })
    })
  })
})