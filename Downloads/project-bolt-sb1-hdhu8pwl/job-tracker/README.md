# Reapplication - Job Application Tracker

A modern web application built with Next.js, Supabase, and Tailwind CSS to help job seekers track their job applications efficiently.

## Features

- User authentication with email/password
- Dashboard with application statistics
- Track job applications with status updates
- Modern, responsive UI with dark mode support
- Secure data storage with Supabase

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, ShadcnUI
- **Backend**: Supabase (Authentication, Database)
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

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
