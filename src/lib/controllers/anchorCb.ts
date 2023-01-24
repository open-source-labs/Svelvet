// these are callbacks used to define anchor positions relative to the node they are attached to
// These may be provided to developers as examples of how to write their own custom callbacks for adjustable anchors
// It calculates the position of an anchor (x,y) coordinates given a node parameterized by (x,y,width, height)
export const rightCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode + widthNode;
  const yAnchor = yNode + heightNode / 2;
  return [xAnchor, yAnchor];
};

export const leftCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode;
  const yAnchor = yNode + heightNode / 2;
  return [xAnchor, yAnchor];
};

export const topCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode + widthNode / 2;
  const yAnchor = yNode;
  return [xAnchor, yAnchor];
};

export const bottomCb = (
  xNode: number,
  yNode: number,
  widthNode: number,
  heightNode: number
) => {
  const xAnchor = xNode + widthNode / 2;
  const yAnchor = yNode + heightNode;
  return [xAnchor, yAnchor];
};
