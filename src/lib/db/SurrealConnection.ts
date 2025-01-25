import { Surreal } from 'surrealdb.js';

export class SurrealConnection {
	private static instance: Surreal;
	private static config = {
		url: 'ws://localhost:8000',
		user: 'root',
		pass: 'root',
		namespace: 'test',
		database: 'test'
	};

	private constructor() {}

	static async getInstance(): Promise<Surreal> {
		if (!this.instance) {
			this.instance = new Surreal();
			try {
				await this.instance.connect(this.config.url);
				await this.instance.signin({
					user: this.config.user,
					pass: this.config.pass
				});
				await this.instance.use(this.config.namespace, this.config.database);
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
