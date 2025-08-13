import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Timetonic implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TimeTonic',
		name: 'timetonic',
		icon: 'file:timetonic.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with TimeTonic API',
		defaults: {
			name: 'TimeTonic',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'timetonicApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authentication',
						value: 'authentication',
						description: 'Manage authentication sessions',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage user information',
					},
				],
				default: 'authentication',
			},
			// Authentication Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
					},
				},
				options: [
					{
						name: 'Create Session Key',
						value: 'createSesskey',
						description: 'Create a new session key for API requests',
						action: 'Create a session key',
					},
					{
						name: 'Drop All Sessions',
						value: 'dropAllSessions',
						description: 'Drop all open sessions except the current one',
						action: 'Drop all sessions',
					},
				],
				default: 'createSesskey',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get User Info',
						value: 'getUserInfo',
						description: 'Get user information',
						action: 'Get user information',
					},
				],
				default: 'getUserInfo',
			},
			// Additional Options
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						default: '',
						description: 'Version of API/server',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('timetonicApi');

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i) as any;

				let responseData: any;

				if (resource === 'authentication') {
					if (operation === 'createSesskey') {
						const qs: any = {
							req: 'createSesskey',
							oauthkey: credentials.oauthkey,
							o_u: credentials.oauthUserId,
							u_c: credentials.userId,
						};

						if (additionalFields.version) {
							qs.version = additionalFields.version;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'timetonicApi',
						{
							method: 'POST',
							url: '',
							qs,
						},
					);
					} else if (operation === 'dropAllSessions') {
						// First create a session key to use for the drop operation
						const sessionResponse = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'timetonicApi',
						{
							method: 'POST',
							url: '',
							qs: {
								req: 'createSesskey',
								oauthkey: credentials.oauthkey,
								o_u: credentials.oauthUserId,
								u_c: credentials.userId,
							},
						},
					);

						if (sessionResponse.status !== 'ok') {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to create session: ${sessionResponse.errorMessage}`,
							);
						}

						const qs: any = {
							req: 'dropAllSessions',
							sesskey: sessionResponse.sesskey,
							o_u: credentials.oauthUserId,
							u_c: credentials.userId,
						};

						if (additionalFields.version) {
							qs.version = additionalFields.version;
						}

						responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: credentials.baseUrl as string,
						qs,
					});
					}
				} else if (resource === 'user') {
					if (operation === 'getUserInfo') {
						// First create a session key
					const sessionResponse = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'timetonicApi',
						{
							method: 'POST',
							url: '',
							qs: {
								req: 'createSesskey',
								oauthkey: credentials.oauthkey,
								o_u: credentials.oauthUserId,
								u_c: credentials.userId,
							},
						},
					);

						if (sessionResponse.status !== 'ok') {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to create session: ${sessionResponse.errorMessage}`,
							);
						}

						// Use session key to get user info (placeholder - actual endpoint would need to be determined from API docs)
						const qs: any = {
							req: 'getUserInfo', // This would need to be the actual API request parameter
							sesskey: sessionResponse.sesskey,
							o_u: credentials.oauthUserId,
							u_c: credentials.userId,
						};

						if (additionalFields.version) {
							qs.version = additionalFields.version;
						}

						responseData = await this.helpers.httpRequest.call(this, {
						method: 'POST',
						url: credentials.baseUrl as string,
						qs,
					});
					}
				}

				if (responseData.status !== 'ok') {
					throw new NodeOperationError(
						this.getNode(),
						`TimeTonic API Error: ${responseData.errorMessage || 'Unknown error'}`,
					);
				}

				returnData.push({
					json: responseData,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}