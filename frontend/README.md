# Arbitrage Bot Frontend

A modern React TypeScript frontend for the Arbitrage Bot with real-time workspace management, analytics, and contract interaction capabilities.

## Features

### Core Functionality
- **Workspace Management**: Create, manage, and switch between multiple workspaces
- **Real-time Data**: Live updates via WebSocket connections for all metrics
- **Multi-chain Support**: Support for different blockchain networks and contract types
- **Responsive Design**: Mobile-first responsive UI built with Tailwind CSS

### Workspace Views
- **Overview**: Dashboard with key metrics, performance summary, and quick actions
- **Assets**: TVL tracking, asset allocation, and performance charts
- **Transactions**: Real-time transaction history with filtering and status tracking
- **Data Tracking**: Custom data point management and historical tracking
- **Source Code**: Contract source code viewing and method interaction
- **History**: Historical performance data and export capabilities
- **Token Stats**: Token performance analysis and market overview

### Charts & Analytics
- **TVL Chart**: Real-time Total Value Locked tracking with time range selection
- **Profit/Loss Chart**: Historical performance analysis with customizable timeframes
- **Interactive Charts**: Zoom, pan, and hover functionality for detailed analysis

### Technical Features
- **State Management**: Redux Toolkit with RTK Query for API integration
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Comprehensive error boundaries and toast notifications
- **Loading States**: Skeleton loaders and loading spinners for optimal UX
- **API Integration**: RESTful API with WebSocket real-time updates

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with strict configuration
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management with RTK Query
- **React Router**: Client-side routing
- **Recharts**: Charting library for data visualization

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Commitlint**: Commit message validation

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Common/        # Shared components
│   │   ├── Charts/        # Chart components
│   │   ├── Layout/        # Layout components
│   │   └── Workspace/     # Workspace-specific views
│   ├── store/             # Redux store configuration
│   │   ├── api/          # RTK Query API definitions
│   │   └── slices/       # Redux slices
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles
├── tests/                # Test files
└── docs/                 # Documentation
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoints and configuration
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_NETWORK=stagenet
VITE_DEFAULT_CHAIN=ethereum
```

### API Integration

The frontend is designed to integrate with the Stagenet API for real-time data. Key endpoints include:

- `GET /api/workspaces` - List all workspaces
- `GET /api/workspaces/:id` - Get workspace details
- `GET /api/workspaces/:id/tvl` - Get TVL data
- `GET /api/workspaces/:id/profit-loss` - Get profit/loss data
- `GET /api/workspaces/:id/transactions` - Get transaction history
- `GET /api/workspaces/:id/token-stats` - Get token statistics

### WebSocket Integration

Real-time updates are handled via WebSocket connections:

```typescript
// Example WebSocket connection
const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws`)
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle real-time updates
}
```

## Development

### Code Style
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error boundaries
- Add TypeScript types for all props and state

### Component Guidelines
- Keep components small and focused
- Use composition over inheritance
- Implement proper loading and error states
- Add accessibility attributes (ARIA labels, etc.)
- Use semantic HTML elements

### State Management
- Use Redux Toolkit for global state
- Implement RTK Query for API calls
- Use local state for component-specific data
- Follow Redux best practices for actions and reducers

### Testing
- Write unit tests for components
- Test API integration with RTK Query
- Use React Testing Library for component testing
- Test responsive design and accessibility

## Deployment

### Build Process
```bash
npm run build
```

### Production Environment
- Set production environment variables
- Configure reverse proxy (nginx, etc.)
- Set up SSL certificates
- Configure caching and compression

### Docker Deployment
```bash
# Build Docker image
docker build -t arbitrage-frontend .

# Run container
docker run -p 3000:80 arbitrage-frontend
```

## API Integration

### Workspace API
```typescript
// Example API call using RTK Query
const { data: workspaces, isLoading } = useGetWorkspacesQuery()

// Example mutation
const [createWorkspace] = useCreateWorkspaceMutation()
```

### Real-time Updates
```typescript
// WebSocket connection for real-time data
useEffect(() => {
  const ws = new WebSocket(wsUrl)
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data)
    dispatch(updateWorkspaceData(update))
  }
  return () => ws.close()
}, [])
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure all dependencies are properly installed and TypeScript configuration is correct.

2. **API Connection**: Verify API endpoints and CORS configuration.

3. **WebSocket Issues**: Check WebSocket server configuration and network connectivity.

4. **Build Errors**: Clear node_modules and reinstall dependencies if build fails.

### Debugging

- Use browser developer tools for network and console debugging
- Check Redux DevTools for state management issues
- Use React DevTools for component debugging
- Monitor WebSocket connections in network tab

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following code style guidelines
4. Write tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the documentation
- Review existing issues
- Join our Discord community
- Contact the development team

## Changelog

### v1.0.0
- Initial release with core workspace functionality
- Real-time data integration
- Chart components for analytics
- Responsive design implementation