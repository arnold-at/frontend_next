'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001/api';

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError('');

        setLoading(true);

        try {

            const res = await fetch(
                `${API_URL}/auth/login`,
                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                setError(
                    data.message ||
                    'Error al iniciar sesión'
                );

                setLoading(false);

                return;
            }

            localStorage.setItem(
                'token',
                data.token
            );

            localStorage.setItem(
                'role',
                data.role
            );

            router.push('/');

            router.refresh();

        } catch (error) {

            setError(
                'Error de conexión'
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="max-w-md mx-auto py-20 px-4">

            <div className="bg-white border rounded-lg p-8 shadow-sm">

                <h1 className="text-3xl font-bold mb-6">

                    Iniciar Sesión

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        placeholder="Correo"
                        required
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        required
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        className="w-full border p-3 rounded-lg"
                    />

                    {error && (

                        <p className="text-red-600 text-sm">

                            {error}

                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg"
                    >

                        {loading
                            ? 'Ingresando...'
                            : 'Ingresar'}

                    </button>

                </form>

            </div>

        </div>
    );
}