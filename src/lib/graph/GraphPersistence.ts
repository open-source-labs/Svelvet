import type { SerializedNode, SerializedEdge, SaveResult } from '../types/graph-persistence';
import { SurrealManager } from '../db/SurrealManager';

export class GraphPersistence {
	async saveGraph(
		graphId: string,
		nodes: SerializedNode[],
		edges: SerializedEdge[]
	): Promise<SaveResult> {
		return await SurrealManager.transaction(async (tx) => {
			const result: SaveResult = {
				success: true,
				graphId,
				stats: {
					nodes: { saved: 0, failed: [] },
					edges: { saved: 0, failed: [] }
				}
			};

			// Save nodes with hierarchy
			for (const node of nodes) {
				try {
					await tx.query(`CREATE node:${node.id} CONTENT $data`, { data: node });
					result.stats.nodes.saved++;
				} catch (e) {
					result.stats.nodes.failed.push(node.id);
				}
			}

			// Create relationships
			for (const edge of edges) {
				try {
					await tx.query(
						`RELATE node:${edge.source}->edge:${edge.id}->node:${edge.target} 
                         CONTENT $data`,
						{ data: edge }
					);
					result.stats.edges.saved++;
				} catch (e) {
					result.stats.edges.failed.push(edge.id);
				}
			}

			return result;
		});
	}

	async loadGraph(graphId: string): Promise<{
		nodes: SerializedNode[];
		edges: SerializedEdge[];
	}> {
		const db = await SurrealManager.connect();

		const nodes = await db.query<SerializedNode[]>('SELECT * FROM node WHERE graph = $graphId', {
			graphId
		});

		const edges = await db.query<SerializedEdge[]>('SELECT * FROM edge WHERE graph = $graphId', {
			graphId
		});

		return {
			nodes: nodes[0],
			edges: edges[0]
		};
	}
}
