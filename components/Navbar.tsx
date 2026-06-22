'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function Navbar() {

    const [role, setRole] =
        useState<string | null>(null);

    useEffect(() => {

        const savedRole =
            localStorage.getItem('role');

        setRole(savedRole);

    }, []);

    const handleLogout = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('role');

        window.location.href = '/';
    };

    return (

        <nav className="bg-white border-b border-gray-200">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between h-16 items-center">

                    <Link
                        href="/"
                        className="text-xl font-semibold text-gray-900"
                    >

                        ProductStore

                    </Link>

                    <div className="flex gap-6 items-center">

                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900"
                        >

                            Productos

                        </Link>

                        {!role && (

                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-gray-900"
                                >

                                    Login

                                </Link>

                                <Link
                                    href="/register"
                                    className="text-gray-600 hover:text-gray-900"
                                >

                                    Register

                                </Link>
                            </>

                        )}

                        {role === 'ADMIN' && (

                            <Link
                                href="/admin"
                                className="text-gray-600 hover:text-gray-900"
                            >

                                Admin

                            </Link>

                        )}

                        {role && (

                            <button
                                onClick={handleLogout}
                                className="text-red-600"
                            >

                                Logout

                            </button>

                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}