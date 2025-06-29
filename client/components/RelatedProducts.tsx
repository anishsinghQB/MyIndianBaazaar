import { useState, useEffect } from "react";
import { Product } from "@shared/types";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
  onCartUpdate?: () => void;
}

export default function RelatedProducts({
  category,
  currentProductId,
  onCartUpdate,
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const products = await api.getProductsByCategory(category);
        const filteredProducts = products
          .filter((product: Product) => product.id !== currentProductId)
          .slice(0, 4);

        // If not enough products from same category, get from all products
        if (filteredProducts.length < 4) {
          const allProducts = await api.getProducts();
          const additionalProducts = allProducts
            .filter(
              (product: Product) =>
                product.id !== currentProductId &&
                !filteredProducts.some((p: Product) => p.id === product.id),
            )
            .slice(0, 4 - filteredProducts.length);

          setRelatedProducts([...filteredProducts, ...additionalProducts]);
        } else {
          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border p-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onCartUpdate={onCartUpdate}
          />
        ))}
      </div>
    </div>
  );
}
