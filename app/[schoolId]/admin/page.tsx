'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSchool } from '@/context/SchoolContext';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import AdminDashboard from '@/components/admin-dashboard';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const { schoolId, isReady } = useSchool();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || userRole !== 'admin')) {
      router.push(`/${schoolId}`);
    }
  }, [isAuthenticated, userRole, mounted, router, schoolId]);

  if (!mounted || !isReady || !isAuthenticated || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-[10%] pt-20 md:pt-0">
        <Header />
        <AdminDashboard />
      </main>
    </div>
  );
}
