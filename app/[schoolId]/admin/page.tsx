'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import AdminDashboard from '@/components/admin-dashboard';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = typeof params?.schoolId === 'string' ? params.schoolId : 'savio';
  const { isAuthenticated, userRole } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || userRole !== 'admin')) {
      router.push(`/${schoolId}`);
    }
  }, [isAuthenticated, userRole, mounted, router, schoolId]);

  if (!mounted || !isAuthenticated || userRole !== 'admin') {
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
