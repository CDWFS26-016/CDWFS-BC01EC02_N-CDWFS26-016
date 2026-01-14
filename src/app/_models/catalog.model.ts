export interface Product {
  reference_produit: string;
  reference_image: string;
  nom: string;
  nombre_pieces: number;
  description: string;
  ingredients: string[];
  informations_nutritionnelles: { lien_pdf: string };
  allergenes: string[];
  categorie: number;
  collection: number | null;
  url: string;
  prix_lot: number;
  prix_unitaire: number;
}

export interface Category {
  id: number;
  titre: string;
  description: string;
  image?: string;
}

export interface Collection {
  id: number;
  titre: string;
  description: string;
}
