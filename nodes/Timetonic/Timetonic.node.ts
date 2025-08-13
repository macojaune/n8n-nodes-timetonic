/* eslint-disable n8n-nodes-base/node-class-description-inputs-wrong-regular-node */
/* eslint-disable n8n-nodes-base/node-class-description-outputs-wrong */
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
					{
						name: 'Table',
						value: 'table',
						description: 'Manage table operations',
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
						name: 'Drop All Sessions',
						value: 'dropAllSessions',
						description: 'Drop all open sessions except the current one',
						action: 'Drop all sessions',
					},
				],
				default: 'dropAllSessions',
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
			// Table Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['table'],
					},
				},
				options: [
					{
						name: 'List Table Rows by ID',
						value: 'listTableRowsById',
						description: 'List table rows by their IDs',
						action: 'List table rows by ID',
					},
					{
						name: 'Create or Update Table Row',
						value: 'createOrUpdateTableRow',
						description: 'Create a new row or update an existing row in a table',
						action: 'Create or update table row',
					},
				],
				default: 'listTableRowsById',
			},
			// Required fields for listTableRowsById
			{
				displayName: 'Book Owner (B_o)',
				name: 'bookOwner',
				type: 'string',
				required: true,
				default: '',
				description: 'Book owner identifier',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['listTableRowsById', 'createOrUpdateTableRow'],
					},
				},
			},
			{
				displayName: 'Category ID (catId)',
				name: 'categoryId',
				type: 'number',
				required: true,
				default: 0,
				description: 'Category (table) ID',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['listTableRowsById'],
					},
				},
			},
			{
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				required: true,
				default: '',
				description: 'Row ID to update, or "tmpNEW_ROW" to create a new row',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createOrUpdateTableRow'],
					},
				},
			},
			{
				displayName: 'Field Values',
				name: 'fieldValues',
				type: 'json',
				required: true,
				default: '{}',
				description:
					'JSON object with field IDs as keys and values to set. Example: {"fieldID1": "value1", "fieldID2": "value2"}.',
				displayOptions: {
					show: {
						resource: ['table'],
						operation: ['createOrUpdateTableRow'],
					},
				},
			},
			// Optional fields for listTableRowsById
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {},
				options: [
					{
						displayName: 'Bypass URL Trigger',
						name: 'bypassUrlTrigger',
						type: 'boolean',
						default: true,
						description: 'Whether to bypass URL triggers and automations',
						displayOptions: {
							show: {
								'/resource': ['table'],
								'/operation': ['createOrUpdateTableRow'],
							},
						},
					},
					{
						displayName: 'Category ID',
						name: 'catId',
						type: 'string',
						default: '',
						description:
							'The ID of the category in which the new row must be created (optional if fieldValues is passed)',
						displayOptions: {
							show: {
								'/resource': ['table'],
								'/operation': ['createOrUpdateTableRow'],
							},
						},
					},

					{
						displayName: 'Encrypted Field Passwords',
						name: 'encryptedFieldPasswords',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						description:
							'JSON string which associates the encrypted field ID with its password (e.g. {"field1": "password1","field2": "password2"})',
						displayOptions: {
							show: {
								'/resource': ['table'],
								'/operation': ['createOrUpdateTableRow'],
							},
						},
					},
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						default: 'columns',
						description: 'The output format',
						options: [
							{
								name: 'Columns',
								value: 'columns',
							},
							{
								name: 'Rows',
								value: 'rows',
							},
							{
								name: 'Diff Ready Rows',
								value: 'diff_ready_rows',
							},
						],
					},

					{
						displayName: 'Last Modified After',
						name: 'lastModifiedAfter',
						type: 'number',
						default: 0,
						description: 'Server timestamp after which the row must have been modified',
					},

					{
						displayName: 'Link Separator',
						name: 'linkSeparator',
						type: 'string',
						default: ',',
						description: 'The text separator used to separate link values',
						displayOptions: {
							show: {
								'/resource': ['table'],
								'/operation': ['createOrUpdateTableRow'],
							},
						},
					},
					{
						displayName: 'Max Rows',
						name: 'maxRows',
						type: 'number',
						default: 0,
						description: 'Maximum number of rows to return',
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						default: '',
						description: 'Version of API/server',
					},
					{
						displayName: 'View ID',
						name: 'viewId',
						type: 'number',
						default: 0,
						description: 'ID of the view to apply',
					},
				],
			},
		],
	};
	// eslint-disable-next-line no-unused-vars
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
					if (operation === 'dropAllSessions') {
						const qs: any = {
							req: 'dropAllSessions',
							sesskey: credentials.sesskey,
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
						// Use session key to get user info (placeholder - actual endpoint would need to be determined from API docs)
						const qs: any = {
							req: 'getUserInfo', // This would need to be the actual API request parameter
							sesskey: credentials.sesskey,
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
				} else if (resource === 'table') {
					if (operation === 'listTableRowsById') {
						const bookOwner = this.getNodeParameter('bookOwner', i) as string;
						const categoryId = this.getNodeParameter('categoryId', i) as number;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as any;

						const qs: any = {
							req: 'listTableRowsById',
							b_o: bookOwner,
							catId: categoryId,
							o_u: credentials.oauthUserId,
							u_c: credentials.userId,
							sesskey: credentials.sesskey,
						};

						// Add optional parameters
						if (additionalFields.viewId) {
							qs.viewId = additionalFields.viewId;
						}
						if (additionalFields.format) {
							qs.format = additionalFields.format;
						}
						if (additionalFields.maxRows) {
							qs.maxRows = additionalFields.maxRows;
						}
						if (additionalFields.lastModifiedAfter) {
							qs.lastModifiedAfter = additionalFields.lastModifiedAfter;
						}
						if (additionalFields.version) {
							qs.version = additionalFields.version;
						}

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: credentials.baseUrl as string,
							qs,
						});
					} else if (operation === 'createOrUpdateTableRow') {
						const bookOwner = this.getNodeParameter('bookOwner', i) as string;
						const rowId = this.getNodeParameter('rowId', i) as string;

						const fieldValues = this.getNodeParameter('fieldValues', i) as string;
						const bypassUrlTrigger = this.getNodeParameter(
							'bypassUrlTrigger',
							i,
							true,
						) as boolean;

						const qs: any = {
							req: 'createOrUpdateTableRow',
							o_u: credentials.oauthUserId,
							u_c: credentials.userId,
							sesskey: credentials.sesskey,
							rowId,
							b_o: bookOwner,
							fieldValues,
							bypassUrlTrigger,
						};

						// Add optional parameters
						if (additionalFields.catId) {
							qs.catId = additionalFields.catId;
						}
						if (additionalFields.linkSeparator) {
							qs.linkSeparator = additionalFields.linkSeparator;
						}
						if (additionalFields.encryptedFieldPasswords) {
							qs.encryptedFieldPasswords = additionalFields.encryptedFieldPasswords;
						}
						if (additionalFields.bypassUrlTrigger !== undefined) {
							qs.bypassUrlTrigger = additionalFields.bypassUrlTrigger;
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
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error occurred';
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
