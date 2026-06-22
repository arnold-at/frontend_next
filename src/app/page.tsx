'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Product, ApiResponse } from '../../types/product';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001/api';

interface Category {
    id: number;
    nombre: string;
}

export default function HomePage() {

    const [products, setProducts] = useState<Product[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchProducts = async (categoryId = '') => {

        try {

            let url = `${API_URL}/products`;

            if (categoryId) {
                url += `?category=${categoryId}`;
            }

            const res = await fetch(url);

            const data: ApiResponse<Product[]> =
                await res.json();

            if (data.success) {
                setProducts(data.data);
            }

        } catch (error) {

            console.error(
                'Error fetching products:',
                error
            );

        }
    };

    const fetchCategories = async () => {

        try {

            const res = await fetch(
                `${API_URL}/categories`
            );

            const data = await res.json();

            if (data.success) {
                setCategories(data.data);
            }

        } catch (error) {

            console.error(
                'Error fetching categories:',
                error
            );

        }
    };

    useEffect(() => {

        fetchProducts();

        fetchCategories();

    }, []);

    const handleCategoryChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const categoryId = e.target.value;

        setSelectedCategory(categoryId);

        fetchProducts(categoryId);
    };

    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div className="flex items-center justify-between mb-8">

                <h1 className="text-xl font-bold text-gray-900">
                    Productos
                </h1>

                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                >

                    <option value="">
                        Todas las categorías
                    </option>

                    {categories.map((category) => (

                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.nombre}
                        </option>

                    ))}

                </select>

            </div>

            {products.length === 0 ? (

                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">

                    <p className="text-gray-500">
                        No hay productos disponibles
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {products.map((product) => (

                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >

                            {product.ImageUrl && (

                                <img
                                    src={product.ImageUrl}
                                    alt={product.nombre}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />

                            )}

                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {product.nombre}
                            </h2>

                            <p className="text-2xl font-bold text-gray-900 mb-3">
                                S/ {product.precio}
                            </p>

                            {product.descripcion && (

                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {product.descripcion}
                                </p>

                            )}

                            {(product as any).Category && (

                                <p className="text-sm text-blue-600 mt-3">
                                    Categoría:
                                    {' '}
                                    {(product as any).Category.nombre}
                                </p>

                            )}

                        </Link>

                    ))}

                </div>

            )}

        </div>
    );
}