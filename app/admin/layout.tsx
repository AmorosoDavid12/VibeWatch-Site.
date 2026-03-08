import { cookies } from 'next/headers';
import { AdminLoginForm } from './login-form';

export const metadata = {
  title: 'Admin — VibeWatch',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  const isAuthenticated = token?.value === 'authenticated';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
        <AdminLoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="border-b border-white/10 bg-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#FF6B6B] font-bold text-lg">VibeWatch</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 text-sm">Admin</span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}

function AdminLogoutButton() {
  return (
    <form
      action={async () => {
        'use server';
        const { cookies: getCookies } = await import('next/headers');
        const cookieStore = await getCookies();
        cookieStore.set('admin_token', '', { maxAge: 0, path: '/' });
      }}
    >
      <button
        type="submit"
        className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
      >
        Logout
      </button>
    </form>
  );
}
