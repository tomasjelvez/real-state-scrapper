export interface Property {
  title: string;
  price?: string;
  currency?: "UF" | "CLP";
  location?: string;
  features?: string[];
  imageUrl?: string;
  href?: string;
}
