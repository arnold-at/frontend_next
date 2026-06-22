'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001/api';

export default function RegisterPage() {

    const router = useRouter();

    const [nombre, setNombre] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [role, setRole] =
        useState('CUSTOMER');

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
                `${API_URL}/auth/register`,
                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        nombre,
                        email,
                        password,
                        role
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                setError(
                    data.message ||
                    'Error al registrarse'
                );

                return;
            }

            router.push('/login');

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

            <div className="bg-white border rounded-lg p-8">

                <h1 className="text-3xl font-bold mb-6">

                    Crear Cuenta

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Nombre"
                        required
                        value={nombre}
                        onChange={(e) =>
                            setNombre(
                                e.target.value
                            )
                        }
                        className="w-full border p-3 rounded"
                    />

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
                        className="w-full border p-3 rounded"
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
                        className="w-full border p-3 rounded"
                    />

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(
                                e.target.value
                            )
                        }
                        className="w-full border p-3 rounded"
                    >

                        <option value="CUSTOMER">
                            CUSTOMER
                        </option>

                        <option value="ADMIN">
                            ADMIN
                        </option>

                    </select>

                    {error && (

                        <p className="text-red-600 text-sm">

                            {error}

                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded"
                    >

                        {loading
                            ? 'Registrando...'
                            : 'Registrarse'}

                    </button>

                </form>

            </div>

        </div>
    );
}