<script lang='ts'>
  import type { NodeConfig, CSSColorString} from '$lib/types'; 

  const defaultNodes: NodeConfig[] = [];

  // types for node creation
  export let bgColor: CSSColorString | undefined;
  export let borderColor: CSSColorString | undefined;
  export let label: string | undefined;
  export let width: number = 200;
  export let height: number = 100;
  export let nodeDirection: string | undefined;
  export let inputs: number | undefined;
  export let outputs: number | undefined;
  export let locked: boolean | undefined;
  export let center: boolean | undefined;
  export let rotation: number | undefined;
  export let zIndex: number | undefined;
  export let TD: boolean | undefined;
  export let LR: boolean | undefined;
  export let useDefaults: boolean | undefined;

</script>