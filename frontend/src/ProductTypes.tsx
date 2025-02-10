export type Product = {
  id: string;
  title: string;
  categories: string[];
  description: string;
  price: string;
  discountprice?: string;
  imagepath: string;
  options: any[];
  material: string;
  country_of_origin: string;
  type: string;
  weight: string;
  dimensions: string;
};
