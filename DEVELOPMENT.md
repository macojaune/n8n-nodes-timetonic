# Development Guide for n8n-nodes-timetonic

This guide provides detailed instructions for developing and testing the TimeTonic N8N community node.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Run linting**:
   ```bash
   npm run lint
   ```

## Project Structure

```
n8n-nodes-timetonic/
├── credentials/
│   └── TimetonicApi.credentials.ts    # API credentials configuration
├── nodes/
│   └── Timetonic/
│       ├── Timetonic.node.ts          # Main node implementation
│       └── timetonic.svg              # Node icon
├── dist/                              # Compiled output (generated)
├── package.json                       # Package configuration
├── tsconfig.json                      # TypeScript configuration
├── .eslintrc.js                       # ESLint configuration
├── .prettierrc.js                     # Prettier configuration
├── gulpfile.js                        # Build configuration
└── index.js                           # Package entry point
```

## Development Workflow

### 1. Local Development Setup

```bash
# Clone and setup
git clone <your-repo-url>
cd n8n-nodes-timetonic
npm install

# Build the project
npm run build

# Link for local development
npm link

# In your n8n directory
cd ~/.n8n
npm link n8n-nodes-timetonic
```

### 2. Testing Your Node

1. **Start n8n**:
   ```bash
   n8n start
   ```

2. **Create a test workflow**:
   - Open n8n in your browser (usually http://localhost:5678)
   - Create a new workflow
   - Search for "TimeTonic" in the nodes panel
   - Add the TimeTonic node to your workflow

3. **Configure credentials**:
   - Click on the TimeTonic node
   - Set up your TimeTonic API credentials
   - Test the connection

### 3. Code Quality

```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues
npm run lintfix

# Format code
npm run format
```

## TimeTonic API Integration

### Authentication Flow

The TimeTonic API uses a two-step authentication process:

1. **OAuth Key**: Initial authentication with `oauthkey`, `o_u`, and `u_c` parameters
2. **Session Key**: Generated session key (`sesskey`) for subsequent API calls

### Current Implementation

The node currently implements:

- **Authentication Resource**:
  - `createSesskey`: Creates a session key
  - `dropAllSessions`: Drops all sessions except current

- **User Resource**:
  - `getUserInfo`: Placeholder for user information retrieval

### Adding New Operations

To add new operations:

1. **Update the node description** in `Timetonic.node.ts`:
   ```typescript
   // Add new resource or operation options
   options: [
     {
       name: 'New Operation',
       value: 'newOperation',
       description: 'Description of the new operation',
       action: 'Perform new operation',
     },
   ]
   ```

2. **Implement the operation logic** in the `execute` method:
   ```typescript
   if (operation === 'newOperation') {
     // Implementation here
   }
   ```

3. **Test the new operation** thoroughly

## API Endpoints Reference

Based on the TimeTonic API documentation:

### Authentication
- `req=createSesskey`: Create session key
- `req=dropAllSessions`: Drop all sessions

### Common Parameters
- `version`: API version (optional)
- `oauthkey`: OAuth key for authentication
- `o_u`: OAuth user ID
- `u_c`: User ID
- `sesskey`: Session key (for authenticated requests)

## Testing Checklist

- [ ] Node appears in n8n nodes panel
- [ ] Credentials can be configured and tested
- [ ] Authentication operations work correctly
- [ ] Error handling works properly
- [ ] Node icon displays correctly
- [ ] All linting checks pass
- [ ] TypeScript compilation succeeds

## Publishing

### Before Publishing

1. **Update version** in `package.json`
2. **Run all checks**:
   ```bash
   npm run lint
   npm run build
   ```
3. **Test thoroughly** with real TimeTonic API credentials
4. **Update documentation** if needed

### Publishing to npm

```bash
# Login to npm (if not already logged in)
npm login

# Publish the package
npm publish
```

### Submitting for Verification

To make your node available in n8n Cloud:

1. Ensure your node follows [n8n's community node guidelines](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/)
2. Submit your node for verification through n8n's process

## Troubleshooting

### Common Issues

1. **Node not appearing in n8n**:
   - Check if the package is properly linked
   - Restart n8n after linking
   - Verify the `package.json` n8n configuration

2. **TypeScript compilation errors**:
   - Check `tsconfig.json` configuration
   - Ensure all dependencies are installed
   - Verify import statements

3. **API authentication issues**:
   - Verify TimeTonic credentials are correct
   - Check API endpoint URLs
   - Review TimeTonic API documentation

### Debug Mode

To enable debug logging in n8n:

```bash
N8N_LOG_LEVEL=debug n8n start
```

## Resources

- [TimeTonic API Documentation](https://timetonic.com/live/apidoc/)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/overview/)
- [n8n Community Nodes Guidelines](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/)
- [n8n Node Starter Repository](https://github.com/n8n-io/n8n-nodes-starter)

## Contributing

When contributing:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Ensure your code follows the existing style and passes all linting checks.