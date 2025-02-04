export interface Product {
    id: string; 
    title: string;
    categories: string[];
    description: string;
    price: number;
    discountPrice: number;
    imagePath: string;
    active: boolean;
    options: string[];
    information: {
      material: string;
      countryOfOrigin: string;
      type: string;
      weight: string;
      dimensions: string;
    };
}
