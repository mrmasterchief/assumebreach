export interface Product {
    title: string;
    categories: string[];
    description: string;
    price: number;
    discountPrice: number;
    imagepath: string;
    active: boolean;
    quantity: number;
    options: string[];
    information: {
      material: string;
      countryOfOrigin: string;
      type: string;
      weight: string;
      dimensions: string;
    };
}
