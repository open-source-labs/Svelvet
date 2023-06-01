import type { CSSColorString, Direction } from '$lib/types'

export interface AnchorProps {
  invisible: boolean | undefined;
  nodeConnect: boolean | undefined;
  input: boolean | undefined;
  output: boolean | undefined;
  multiple: boolean | undefined;
  direction: Direction | undefined;
  dynamic: boolean | undefined;
  anchorEdgeLabel: string | undefined;
  anchorLocked: boolean | undefined;
  anchorBgColor: CSSColorString | undefined;
}