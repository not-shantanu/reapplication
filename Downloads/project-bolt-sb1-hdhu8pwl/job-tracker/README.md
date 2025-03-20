# Job Tracker

A modern web application for tracking job applications and managing your job search process.

## Features

- User authentication with email verification
- Job application tracking
- Modern UI with Tailwind CSS
- Secure data storage with Supabase

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
ENCRYPTION_KEY=your_encryption_key
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Change this in production
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment

This project is deployed on Netlify. Make sure to:
1. Set up all environment variables in Netlify dashboard
2. Configure build settings
3. Update redirect rules for authentication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, ShadcnUI
- **Backend**: Supabase (Authentication, Database)
- **State Management**: React Hooks
- **Deployment**: Netlify (recommended)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reapplication.git
   ```

2. Install dependencies:
   ```bash
   cd reapplication
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- Tailwind CSS team for the styling utilities
- All other open-source contributors
