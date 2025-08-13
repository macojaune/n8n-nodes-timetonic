import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TimetonicApi implements ICredentialType {
	name = 'timetonicApi';
	displayName = 'TimeTonic API';
	documentationUrl = 'https://timetonic.com/live/apidoc/';
	properties: INodeProperties[] = [
	
		{
			displayName: 'OAuth User ID',
			name: 'oauthUserId',
			type: 'string',
			default: '',
			description: 'The OAuth user ID (o_u parameter)',
			required: true,
		},
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			default: '',
			description: 'The user ID (u_c parameter, usually same as OAuth User ID)',
			required: true,
		},
		{
			displayName: 'Session Key',
			name: 'sesskey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The session key for API authentication',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://timetonic.com/live/api.php',
			description: 'The base URL for TimeTonic API',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				o_u: '={{$credentials.oauthUserId}}',
				u_c: '={{$credentials.userId}}',
				sesskey: '={{$credentials.sesskey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '',
			method: 'POST',
			qs: {
				req: 'getUserInfo',
				o_u: '={{$credentials.oauthUserId}}',
				u_c: '={{$credentials.userId}}',
				sesskey: '={{$credentials.sesskey}}',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
				message: 'Authentication successful',
				key: 'status',
				value: 'ok',
			},
			},
		],
	};
}