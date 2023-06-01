import type { CSSColorString } from "../general";

export interface EdgeProps {
  width: number,
  targetColor: CSSColorString,
  color: CSSColorString,
  straight: boolean,
  step: boolean,
  cornerRadius: number,
  animate: false,
  label: string,
  labelColor: CSSColorString,
  textColor: CSSColorString
} 