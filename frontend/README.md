# ArbitrageBot Frontend

This is the frontend for the ArbitrageBot application.

## Development

To run the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

## Build

To build for production:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory.

## Vercel Deployment

This frontend is configured to deploy to Vercel with the following settings:
- Build command: `npm run build` (from frontend directory)
- Output directory: `frontend/dist`
- Development files are properly compiled to JavaScript before deployment