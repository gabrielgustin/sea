'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import AdminDashboard from '@/components/admin-dashboard';
import WhatsAppButton from '@/components/whatsapp-button';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-[10%] pt-20 md:pt-0">
        <Header />
        <AdminDashboard />
      </main>
      <WhatsAppButton />
    </div>
  );
}
