describe('Drag n Drop', () => {
  describe('move a node', () => {
    const moveNode = (number: number, x: number, y: number): void => {
      cy.get(`#svelvet-${number}`)
        .trigger('mousedown', { eventConstructor: 'MouseEvent', button: 1 })
        .trigger('mousemove', {
          eventConstructor: 'MouseEvent',
          button: 1,
          movementX: x,
          movementY: y,
        })
        .trigger('mouseup');
    };
    const checkNode = (nodeId: number, x: number, y: number): void => {
      cy.get(`#svelvet-${nodeId}`).then(($div) => {
        const startX: number = Number($div[0].style.left.match(/\d+/)[0]);
        const startY: number = Number($div[0].style.top.match(/\d+/)[0]);

        moveNode(nodeId, x, y);
        cy.get(`#svelvet-${nodeId}`).then(($div2) => {
          const endX: number = Number($div2[0].style.left.match(/\d+/)[0]);
          const endY: number = Number($div2[0].style.top.match(/\d+/)[0]);

          expect(endX - startX).to.eq(x);
          expect(endY - startY).to.eq(y);
        });
      });
    };
    it('moves all nodes to new locations', () => {
      cy.visit('/testingplayground');
      cy.viewport(1000, 1000);
      // checkNode(10, -50, -150)
      checkNode(9, 0, -200);
      checkNode(8, -100, -200);
      checkNode(7, 0, 200);
      checkNode(6, -200, -700);
      checkNode(5, -700, 0);
      checkNode(4, 50, -200);
      checkNode(3, 300, 700);
      checkNode(2, 200, 70);
      checkNode(1, 160, 80);
    });
  });
});
