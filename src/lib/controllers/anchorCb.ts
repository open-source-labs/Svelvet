
/** 
 *  These are callbacks used to define anchor positions relative to the node they are attached to.
 *  These may be provided to developers as examples of how to write their own custom callbacks for adjustable anchors
 *  It calculates the position of an anchor (x,y) coordinates given a node parameterized by (x,y,width, height)
*/

/**
 * @function rightCb - This is a callback function to define the anchor position on the node to be on the right side of the node.
 * @param xNode - positionX of the attached node
 * @param yNode - positionY of the attached node
 * @param widthNode -  width of the attached node
 * @param heightNode - height of the attached node
 * @returns [xAnchor, yAnchor, 0] 
 * xAnchor - positionX for the anchor
 * yAnchor - positionY for the anchor
 * 0 - explain the 0**
 * @export rightCb
 */
export const rightCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode + widthNode;
  const yAnchor = yNode + heightNode / 2;
  return [xAnchor, yAnchor, 0];
};

/**
 * @function leftCb - This is a callback function to define the anchor position on the node to be on the left side of the node.
 * @param xNode - positionX of the attached node
 * @param yNode - positionY of the attached node
 * @param widthNode - width of the attached node
 * @param heightNode - height of the attached node
 * @returns [xAnchor, yAnchor, 180] 
 *   xAnchor - positionX for the anchor
 *   yAnchor - positionY for the anchor
 *   180 - explain the 180**
 * @export leftCb
*/
export const leftCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode;
  const yAnchor = yNode + heightNode / 2;
  return [xAnchor, yAnchor, 180];
};

/**
 * @function topCb - This is a callback function to define the anchor position on the node to be on the top of the node.
 * @param xNode - positionX of the attached node
 * @param yNode - positionY of the attached node
 * @param widthNode - width of the attached node
 * @param heightNode - height of the attached node
 * @returns [xAnchor, yAnchor, 90] 
 *   xAnchor - positionX for the anchor
 *   yAnchor - positionY for the anchor
 *   90 - explain the 90**
 * @export topCb
 */

export const topCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode + widthNode / 2;
  const yAnchor = yNode;
  return [xAnchor, yAnchor, 90];
};

/**
 * @function bottomCb - This is a callback function to define the anchor position on the node to be on the bottom of the node.
 * @param xNode - positionX of the attached node
 * @param yNode - positionY of the attached node
 * @param widthNode - width of the attached node
 * @param heightNode - height of the attached node
 * @returns - [xAnchor, yAnchor, 90] 
 *   xAnchor - positionX for the anchor
 *   yAnchor - positionY for the anchor
 *   270 - explain the 270**
 * @export bottomCb
 */
export const bottomCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode + widthNode / 2;
  const yAnchor = yNode + heightNode;
  return [xAnchor, yAnchor, 270];
};
