import { Surreal } from 'surrealdb.js';

export class SurrealConnection {
	private static instance: Surreal | undefined;
	private static config = {
		url: 'ws://localhost:8000',
		username: 'root',
		password: 'root',
		namespace: 'test',
		database: 'test',
		scope: 'global'
	};

	private constructor() {}

	static async getInstance(): Promise<Surreal> {
		if (!this.instance) {
			this.instance = new Surreal();
			try {
				await this.instance.connect(this.config.url);
				await this.instance.signin({
					username: this.config.username,
					password: this.config.password,
					scope: this.config.scope
				});
				await this.instance.use({
					namespace: this.config.namespace,
					database: this.config.database
				});
			} catch (error) {
				throw new Error(`Database connection failed: ${error}`);
			}
		}
		return this.instance;
	}

	static async cleanup(): Promise<void> {
		if (this.instance) {
			await this.instance.close();
			this.instance = undefined;
		}
	}
}
