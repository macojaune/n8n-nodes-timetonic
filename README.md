# n8n-nodes-timetonic

This is an n8n community node that provides integration with the TimeTonic API. It allows you to interact with TimeTonic's workflow automation platform directly from your n8n workflows.

[TimeTonic](https://timetonic.com/) is a comprehensive business management platform that offers project management, CRM, and workflow automation capabilities.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-timetonic` in **Enter npm package name**
4. Agree to the risks of using community nodes: select **I understand the risks of installing unverified code from a public source**
5. Select **Install**

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

### Manual Installation

```bash
npm install n8n-nodes-timetonic
```

## Credentials

To use this node, you need to configure TimeTonic API credentials:

1. **OAuth Key**: Your TimeTonic OAuth key
2. **OAuth User ID**: Your OAuth user ID (o_u parameter)
3. **User ID**: Your user ID (u_c parameter, usually same as OAuth User ID)
4. **Base URL**: The TimeTonic API base URL (default: https://timetonic.com/live/api.php)

### Getting Your Credentials

To obtain your TimeTonic API credentials:

1. Log in to your TimeTonic account
2. Navigate to your account settings or developer section
3. Generate or locate your OAuth key and user IDs
4. Refer to the [TimeTonic API documentation](https://timetonic.com/live/apidoc/) for detailed instructions

## Supported Operations

### Authentication
- **Create Session Key**: Generate a session key for API requests
- **Drop All Sessions**: Drop all open sessions except the current one

### User
- **Get User Info**: Retrieve user information (placeholder - requires specific API endpoint)

## Example Usage

### Basic Authentication Flow

1. Add the TimeTonic node to your workflow
2. Configure your credentials
3. Select "Authentication" as the resource
4. Choose "Create Session Key" as the operation
5. Execute the workflow to get a session key for further API calls

### Session Management

The node automatically handles session creation for operations that require authentication. The session key is used internally for API requests that need it.

## Development

### Prerequisites

- Node.js (version 20.15 or higher)
- npm
- n8n installed globally: `npm install n8n -g`

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/marvinl/n8n-nodes-timetonic.git
   cd n8n-nodes-timetonic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the node:
   ```bash
   npm run build
   ```

4. Link the package for local development:
   ```bash
   npm link
   ```

5. Link to your global n8n installation:
   ```bash
   cd ~/.n8n
   npm link n8n-nodes-timetonic
   ```

### Development Workflow

1. Make changes to the source code
2. Run the build command: `npm run build`
3. Restart n8n to see your changes

### Code Quality

- **Linting**: `npm run lint`
- **Auto-fix linting issues**: `npm run lintfix`
- **Format code**: `npm run format`

### Testing

To test your node:

1. Start n8n: `n8n start`
2. Create a new workflow
3. Add your TimeTonic node
4. Configure credentials and test operations

## API Reference

This node is built based on the [TimeTonic API documentation](https://timetonic.com/live/apidoc/). Key features include:

- Session-based authentication using OAuth keys
- RESTful API endpoints
- JSON response format
- Error handling with status codes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style
2. Add appropriate error handling
3. Update documentation for new features
4. Test your changes thoroughly
5. Follow n8n's [community node guidelines](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/)

## License

[MIT](LICENSE.md)

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [TimeTonic API documentation](https://timetonic.com/live/apidoc/)
- [n8n node development guide](https://docs.n8n.io/integrations/creating-nodes/overview/)

## Support

If you encounter any issues or have questions:

1. Check the [TimeTonic API documentation](https://timetonic.com/live/apidoc/)
2. Review the [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
3. Open an issue in this repository

## Version History

### 0.1.0
- Initial release
- Basic authentication operations
- Session management
- User information retrieval (placeholder)