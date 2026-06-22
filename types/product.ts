export interface Product {

    id: number;

    nombre: string;

    precio: number;

    descripcion?: string;

    CategoryId?: number;

    ImageUrl?: string;

    Category?: {

        id: number;

        nombre: string;

    };

    createdAt?: string;

    updatedAt?: string;
}

export interface ApiResponse<T> {

    success: boolean;

    message: string;

    data: T;
}