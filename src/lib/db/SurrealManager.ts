import { Surreal } from 'surrealdb.js';

export class SurrealManager {
	private static instance: Surreal | undefined;

	static async connect(
		config = {
			url: 'ws://localhost:8000',
			namespace: 'svelvet',
			database: 'graphs'
		}
	): Promise<Surreal> {
		if (!this.instance) {
			this.instance = new Surreal();
			await this.instance.connect(config.url);
			await this.instance.use({
				namespace: config.namespace,
				database: config.database
			});
		}
		return this.instance;
	}

	static async transaction<T>(callback: (tx: Surreal) => Promise<T>): Promise<T> {
		const db = await this.connect();
		return await db.transaction(callback);
	}
}
