export interface UserNodeType {
  id: string;
  width: number;
  height: number;
  bgColor: string;
  data: object;
  position: { x: number; y: number };
  borderColor?: string | undefined;
  image?: boolean;
  src?: string;
  textColor?: string;
  targetPosition?: 'left' | 'right' | 'top' | 'bottom';
  sourcePosition?: 'left' | 'right' | 'top' | 'bottom';
  borderRadius?: number;
  childNodes?: string[];
  className?: string;
  clickCallback?: Function;
}

export interface UserEdgeType {
  id: string;
  source: string;
  target: string;
  sourceAnchorCb?: Function;
  targetAnchorCb?: Function;
  label?: string;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
  type?: 'straight' | 'smoothstep' | 'step' | 'bezier' | undefined;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;
  clickCallback?: Function;
  className?: string;
}
