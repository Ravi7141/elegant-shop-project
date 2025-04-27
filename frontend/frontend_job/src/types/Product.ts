export interface Product {
    id: number;
    name: string;
    description: string;
    brand: string;
    price: number;
    category: string;
    releaseDate: string;
    productAvailable: boolean;
    stockQuantity: number;
    imageName: string;
    imageType: string;
    imageData?: string; // Base64 encoded image data
} 