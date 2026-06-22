'use client';

import { useState, useEffect } from 'react';

import { Product, ApiResponse } from '../../../types/product';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001/api';

interface Category {
    id: number;
    nombre: string;
}

export default function AdminPage() {

    const [authorized, setAuthorized] =
        useState(false);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [formData, setFormData] =
        useState({
            nombre: '',
            precio: '',
            descripcion: '',
            CategoryId: '',
            ImageUrl: ''
        });

    const [editingId, setEditingId] =
        useState<number | null>(null);

    useEffect(() => {

        const role =
            localStorage.getItem('role');

        if (role !== 'ADMIN') {

            window.location.href = '/';

            return;
        }

        setAuthorized(true);

        fetchProducts();

        fetchCategories();

    }, []);

    const fetchProducts = async () => {

        try {

            const res =
                await fetch(`${API_URL}/products`);

            const data:
                ApiResponse<Product[]> =
                await res.json();

            if (data.success) {
                setProducts(data.data);
            }

        } catch (error) {

            console.error('Error:', error);

        } finally {

            setLoading(false);

        }
    };

    const fetchCategories = async () => {

        try {

            const res =
                await fetch(`${API_URL}/categories`);

            const data =
                await res.json();

            if (data.success) {
                setCategories(data.data);
            }

        } catch (error) {

            console.error(error);

        }
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        const token =
            localStorage.getItem('token');

        const url = editingId
            ? `${API_URL}/products/${editingId}`
            : `${API_URL}/products`;

        const method =
            editingId ? 'PUT' : 'POST';

        try {

            const res = await fetch(url, {

                method,

                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({

                    nombre: formData.nombre,

                    precio: parseFloat(formData.precio),

                    descripcion:
                        formData.descripcion || undefined,

                    CategoryId:
                        formData.CategoryId || null,

                    ImageUrl:
                        formData.ImageUrl || null
                }),
            });

            if (res.ok) {

                setFormData({
                    nombre: '',
                    precio: '',
                    descripcion: '',
                    CategoryId: '',
                    ImageUrl: ''
                });

                setEditingId(null);

                fetchProducts();
            }

        } catch (error) {

            console.error('Error:', error);

        }
    };

    const handleEdit = (
        product: Product
    ) => {

        setFormData({

            nombre: product.nombre,

            precio:
                product.precio.toString(),

            descripcion:
                product.descripcion || '',

            CategoryId:
                product.CategoryId?.toString() || '',

            ImageUrl:
                product.ImageUrl || ''
        });

        setEditingId(product.id);
    };

    const handleDelete = async (
        id: number
    ) => {

        if (!confirm('¿Eliminar producto?'))
            return;

        const token =
            localStorage.getItem('token');

        try {

            const res = await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: 'DELETE',

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                fetchProducts();
            }

        } catch (error) {

            console.error(error);

        }
    };

    const handleCancel = () => {

        setFormData({
            nombre: '',
            precio: '',
            descripcion: '',
            CategoryId: '',
            ImageUrl: ''
        });

        setEditingId(null);
    };

    if (!authorized) {

        return (

            <div className="p-10">

                Verificando acceso...

            </div>

        );
    }

    if (loading) {

        return (

            <div className="p-10 text-center">

                Cargando...

            </div>

        );
    }

    return (

        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold mb-8">

                Panel Administrador

            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* FORM */}

                <div>

                    <div className="bg-white border rounded-lg p-6">

                        <h2 className="text-2xl font-semibold mb-5">

                            {editingId
                                ? 'Editar Producto'
                                : 'Crear Producto'}

                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            <input
                                type="text"
                                placeholder="Nombre"
                                required
                                value={formData.nombre}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nombre:
                                            e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            />

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Precio"
                                required
                                value={formData.precio}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        precio:
                                            e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            />

                            <textarea
                                rows={3}
                                placeholder="Descripción"
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        descripcion:
                                            e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            />

                            <select
                                value={formData.CategoryId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        CategoryId:
                                            e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            >

                                <option value="">
                                    Selecciona categoría
                                </option>

                                {categories.map(category => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.nombre}
                                    </option>

                                ))}

                            </select>

                            <input
                                type="text"
                                placeholder="URL Imagen"
                                value={formData.ImageUrl}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        ImageUrl:
                                            e.target.value
                                    })
                                }
                                className="w-full border p-3 rounded"
                            />

                            {formData.ImageUrl && (

                                <img
                                    src={formData.ImageUrl}
                                    alt="preview"
                                    className="w-full h-48 object-cover rounded"
                                />

                            )}

                            <div className="flex gap-2">

                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white p-3 rounded"
                                >

                                    {editingId
                                        ? 'Actualizar'
                                        : 'Crear'}

                                </button>

                                {editingId && (

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="border px-4 rounded"
                                    >

                                        Cancelar

                                    </button>

                                )}

                            </div>

                        </form>

                    </div>

                </div>

                {/* TABLA */}

                <div className="lg:col-span-2">

                    <div className="bg-white border rounded-lg overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="p-4 text-left">
                                        Imagen
                                    </th>

                                    <th className="p-4 text-left">
                                        Nombre
                                    </th>

                                    <th className="p-4 text-left">
                                        Categoría
                                    </th>

                                    <th className="p-4 text-left">
                                        Precio
                                    </th>

                                    <th className="p-4 text-right">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {products.map(product => (

                                    <tr
                                        key={product.id}
                                        className="border-t"
                                    >

                                        <td className="p-4">

                                            {product.ImageUrl && (

                                                <img
                                                    src={product.ImageUrl}
                                                    alt={product.nombre}
                                                    className="w-20 h-20 object-cover rounded"
                                                />

                                            )}

                                        </td>

                                        <td className="p-4">
                                            {product.nombre}
                                        </td>

                                        <td className="p-4">

                                            {product.Category?.nombre ||
                                                'Sin categoría'}

                                        </td>

                                        <td className="p-4">
                                            S/ {product.precio}
                                        </td>

                                        <td className="p-4 text-right">

                                            <button
                                                onClick={() =>
                                                    handleEdit(product)
                                                }
                                                className="mr-4 text-blue-600"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="text-red-600"
                                            >
                                                Eliminar
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}