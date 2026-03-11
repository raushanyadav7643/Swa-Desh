'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-[var(--color-primary)] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold flex items-center gap-2">
                            <span className="text-[#FFFDD0]">Swa Desh</span>
                        </Link>
                    </div>
                    {user && (
                        <div className="hidden md:flex space-x-8">
                            <Link href="/dashboard" className="hover:text-[var(--color-accent)] transition">Dashboard</Link>
                            <Link href="/heritage" className="hover:text-[var(--color-accent)] transition">Heritage Sites</Link>
                            <Link href="/map" className="hover:text-[var(--color-accent)] transition">Map View</Link>
                            <Link href="/artisans" className="hover:text-[var(--color-accent)] transition">Artisans</Link>
                            <Link href="/products" className="hover:text-[var(--color-accent)] transition">Products</Link>
                        </div>
                    )}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Logout</button>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 border rounded hover:bg-white hover:text-[var(--color-primary)] transition">Sign In</Link>
                                <Link href="/register" className="px-4 py-2 bg-[var(--color-accent)] text-black rounded hover:bg-yellow-500 transition">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
