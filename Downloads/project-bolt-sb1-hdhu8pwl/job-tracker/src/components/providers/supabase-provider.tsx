'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const SupabaseContext = createContext<ReturnType<typeof createBrowserClient> | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => {
    try {
      return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      return undefined;
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.refresh();
      if (event === 'SIGNED_OUT') router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (!supabase) {
    return <div>Error initializing Supabase client. Check your environment variables.</div>;
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
} 