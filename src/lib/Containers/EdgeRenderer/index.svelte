<script lang="typescript">
// import React, { memo, CSSProperties } from 'react';
import shallow from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../store';
import ConnectionLine from '../../components/ConnectionLine/index';
import MarkerDefinitions from './MarkerDefinitions';
import { getEdgePositions, getHandle, getNodeData } from './utils';
import {
  Position,
  Edge,
  ConnectionLineType,
  ConnectionLineComponent,
  ConnectionMode,
  OnEdgeUpdateFunc,
  HandleType,
  ReactFlowState,
  EdgeTypesWrapped,
} from '../types'; //change to SvelvetState later
import useVisibleEdges from '../hooks/useVisibleEdges';

interface EdgeRendererProps {
  edgeTypes: EdgeTypesWrapped;
  connectionLineType: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  onEdgeClick?: (event: anyde: Edge) => void; //React.MouseEvent
  onEdgeDoubleClick?: (event: any, edge: Edge) => void; //React.MouseEvent
  defaultMarkerColor: string;
  onlyRenderVisibleElements: boolean;
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onEdgeContextMenu?: (event: any, edge: Edge) => void; //React.MouseEvent
  onEdgeMouseEnter?: (event: any, edge: Edge) => void; //React.MouseEvent
  onEdgeMouseMove?: (event: any, edge: Edge) => void; //React.MouseEvent
  onEdgeMouseLeave?: (event: any, edge: Edge) => void; //React.MouseEvent
  onEdgeUpdateStart?: (event: any, edge: Edge, handleType: HandleType) => void;
  onEdgeUpdateEnd?: (event: any, edge: Edge, handleType: HandleType) => void; //MouseEvent
  edgeUpdaterRadius?: number;
  noPanClassName?: string;
  elevateEdgesOnSelect: boolean;
}

const selector = (s: ReactFlowState) => ({ //change to s: SvelvetState later
  connectionNodeId: s.connectionNodeId,
  connectionHandleId: s.connectionHandleId,
  connectionHandleType: s.connectionHandleType,
  connectionPosition: s.connectionPosition,
  nodesConnectable: s.nodesConnectable,
  elementsSelectable: s.elementsSelectable,
  width: s.width,
  height: s.height,
  connectionMode: s.connectionMode,
  nodeInternals: s.nodeInternals,
});

const EdgeRenderer = (props: EdgeRendererProps) => {
  const {
    connectionNodeId,
    connectionHandleId,
    connectionHandleType,
    connectionPosition,
    nodesConnectable,
    elementsSelectable,
    width,
    height,
    connectionMode,
    nodeInternals,
  } = useStore(selector, shallow); //change useStore
  const edgeTree = useVisibleEdges(props.onlyRenderVisibleElements, nodeInternals, props.elevateEdgesOnSelect);

  if (!width) {
    return null;
  }

  const { connectionLineType, defaultMarkerColor, connectionLineStyle, connectionLineComponent } = props;
  const renderConnectionLine = connectionNodeId && connectionHandleType;
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
</script>


return (
    <>
      {edgeTree.map(({ level, edges, isMaxLevel }) => (
        <svg
          key={level}
          style={{ zIndex: level }}
          width={width}
          height={height}
          class="react-flow__edges react-flow__container"
        >
          {isMaxLevel && <MarkerDefinitions defaultColor={defaultMarkerColor} />}
          <g>
            {edges.map((edge: Edge) => {
              const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals, edge.source);
              const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals, edge.target);

              {#if !sourceIsValid || !targetIsValid}
                return null;
              {/if}

              const edgeType = edge.type || 'default';
              const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
              // when connection type is loose we can define all handles as sources
              const targetNodeHandles =
                connectionMode === ConnectionMode.Strict
                  ? targetHandleBounds!.target
                  : targetHandleBounds!.target || targetHandleBounds!.source;
              const sourceHandle = getHandle(sourceHandleBounds!.source!, edge.sourceHandle || null);
              const targetHandle = getHandle(targetNodeHandles!, edge.targetHandle || null);
              const sourcePosition = sourceHandle?.position || Position.Bottom;
              const targetPosition = targetHandle?.position || Position.Top;

              {#if !sourceHandle} 
                // @ts-ignore
                {#if process.env.NODE_ENV === 'development'} 
                  console.warn(
                    `[React Flow]: Couldn't create edge for source handle id: ${edge.sourceHandle}; edge id: ${edge.id}. Help: https://reactflow.dev/error#800`
                  );
                {/if}
                return null;
              {/if}

              {#if !targetHandle} 
                // @ts-ignore
                {#if process.env.NODE_ENV === 'development'}
                  console.warn(
                    `[React Flow]: Couldn't create edge for target handle id: ${edge.targetHandle}; edge id: ${edge.id}. Help: https://reactflow.dev/error#800`
                  );
                {/if}
                return null;
              {/if}

              const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
                sourceNodeRect,
                sourceHandle,
                sourcePosition,
                targetNodeRect,
                targetHandle,
                targetPosition
              );

              return (
                <EdgeComponent
                  key={edge.id}
                  id={edge.id}
                  class={cc([edge.className, props.noPanClassName])}
                  type={edgeType}
                  data={edge.data}
                  selected={!!edge.selected}
                  animated={!!edge.animated}
                  hidden={!!edge.hidden}
                  label={edge.label}
                  labelStyle={edge.labelStyle}
                  labelShowBg={edge.labelShowBg}
                  labelBgStyle={edge.labelBgStyle}
                  labelBgPadding={edge.labelBgPadding}
                  labelBgBorderRadius={edge.labelBgBorderRadius}
                  style={edge.style}
                  source={edge.source}
                  target={edge.target}
                  sourceHandleId={edge.sourceHandle}
                  targetHandleId={edge.targetHandle}
                  markerEnd={edge.markerEnd}
                  markerStart={edge.markerStart}
                  sourceX={sourceX}
                  sourceY={sourceY}
                  targetX={targetX}
                  targetY={targetY}
                  sourcePosition={sourcePosition}
                  targetPosition={targetPosition}
                  elementsSelectable={elementsSelectable}
                  onEdgeUpdate={props.onEdgeUpdate}
                  onContextMenu={props.onEdgeContextMenu}
                  onMouseEnter={props.onEdgeMouseEnter}
                  onMouseMove={props.onEdgeMouseMove}
                  onMouseLeave={props.onEdgeMouseLeave}
                  onClick={props.onEdgeClick}
                  edgeUpdaterRadius={props.edgeUpdaterRadius}
                  onEdgeDoubleClick={props.onEdgeDoubleClick}
                  onEdgeUpdateStart={props.onEdgeUpdateStart}
                  onEdgeUpdateEnd={props.onEdgeUpdateEnd}
                />
              );
            })}
            {renderConnectionLine && isMaxLevel && (
              <ConnectionLine
                connectionNodeId={connectionNodeId!}
                connectionHandleId={connectionHandleId}
                connectionHandleType={connectionHandleType!}
                connectionPositionX={connectionPosition.x}
                connectionPositionY={connectionPosition.y}
                connectionLineStyle={connectionLineStyle}
                connectionLineType={connectionLineType}
                isConnectable={nodesConnectable}
                CustomConnectionLineComponent={connectionLineComponent}
              />
            )}
          </g>
        </svg>
      ))}
    </>
  );
