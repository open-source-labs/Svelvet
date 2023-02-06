# README

This document explains the "collapsible-nodes" feature. Please keep this document updated for future teams.

## Description

Feature was requested by: https://github.com/open-source-labs/Svelvet/issues/183
Feature mimics functionality at: https://reactflow.dev/docs/examples/layout/expand-collapse/
Demo feature at: http://localhost:3000/featureCollapsibleNodes/

## How it works

When enabled, one "Collapsible" object is created for every node. Collapsible tracks the state of each node (whether its children are expanded or collapsed), and "hideCount" which is a count of how many times ancestor nodes have been collapsed.

When a node is collapsed, we traverse the tree and increment the "hideCount" of descendent nodes. When a node is expanded, we traverse the tree and decrement the "hideCount" of descendent nodes.

Nodes are displayed when hideCount === 0, otherwise they are hidden.

There is some extra logic to make sure that edges/anchors/resizeNodes are also hidden when a node is hidden.

## Future work

The behavior of this feature is undefined for invalid trees (ie, nodes with more than one parent). The fix is to add edge case checks for invalid trees.

This feature is not compatible with features that add node-associated elements to the canvas, such as "interactiveNodes" which adds four temporaryAnchors per node. This is because we need extra logic to hide the temporaryAnchors when its parent node is hidden. While it is straightforward to code this, it scales poorly as hiding would need to be done for every additional feature. The optimal fix is to have a "cascading hide" where tables with foreign keys linking to the nodes row are hidden.

## Contact

If you have questions about this feature, email michael.chiang.dev5@gmail.com
