import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { useState } from "react";

export default function ProductCard({ product, onCartUpdate }: any) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discountPercentage = Math.round(
    (((product.mrp || 0) - (product.our_price || 0)) / (product.mrp || 1)) * 100,
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);

    try {
      addToCart(product.id);
      onCartUpdate?.();
      // Trigger storage event for header update
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            {discountPercentage}% OFF
          </div>
        )}
        <button
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isLiked
              ? "bg-red-500 text-white"
              : "bg-white text-gray-400 hover:text-red-500"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-[#1690C7] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.company}</p>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{(product.our_price || 0)?.toLocaleString()}
            </span>
            {(product.mrp || 0) > (product.our_price || 0) && (
              <span className="text-sm text-gray-500 line-through">
                ₹{(product.mrp || 0)?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock || isAddingToCart}
          className="w-full bg-[#1690C7]"
          size="sm"
        >
          {isAddingToCart
            ? "Adding..."
            : !product.in_stock
              ? "Out of Stock"
              : "Add to Cart"}
        </Button>
      </div>
    </Link>
  );
}
