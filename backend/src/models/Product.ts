export interface Product {
    id: string; 
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
    options: string[];
    information: {
      material: string;
      countryOfOrigin: string;
      type: string;
      weight: string;
      dimensions: string;
    };
}
