import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ImageZoom from "@/components/ImageZoom";
import CheckoutModal from "@/components/CheckoutModal";
import ReviewSection from "@/components/ReviewSection";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { Product, Cart } from "@shared/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [reviewKey, setReviewKey] = useState(0);
  const [productReviews, setProducteviews] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const foundProduct = await api.getProductById(id);
        const productReview = await api.getProductsReviews(id);
        setProduct(foundProduct);
        setProducteviews(productReview);

        // Get related products from same category
        if (foundProduct) {
          const allProducts = await api.getProducts();
          const related = allProducts
            .filter(
              (p) =>
                p.id !== foundProduct.id &&
                p.category === foundProduct.category,
            )
            .slice(0, 4);

          // If not enough from same category, add from other categories
          if (related?.length < 4) {
            const additional = allProducts
              .filter(
                (p) =>
                  p.id !== foundProduct.id &&
                  !related.some((r) => r.id === p.id),
              )
              .slice(0, 4 - related?.length);
            setRelatedProducts([...related, ...additional]);
          } else {
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-500 text-lg mt-4">Loading product...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {error || "Product Not Found"}
              </h1>
              <Link to="/" className="text-[#1690C7]">
                <Button className="text-[#1690C7]">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const discountPercentage = Math.round(
    (((product.mrp || 0) - (product.our_price || 0)) / (product.mrp || 1)) *
      100,
  );

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(product.id, quantity);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/account");
      return;
    }

    // Add to cart first
    addToCart(product.id, quantity);

    // Open checkout modal
    setShowCheckout(true);
  };

  const handleOrderSuccess = (orderId: number) => {
    navigate("/account", {
      state: { message: `Order #${orderId} placed successfully!` },
    });
  };

  const handleReviewAdded = () => {
    // Refresh the product data to get updated reviews
    setReviewKey((prev) => prev + 1);
  };

  // Create cart object for checkout
  const currentCart: Cart = product
    ? {
        items: [
          {
            productId: product.id,
            quantity: quantity,
          },
        ],
        total: (product.our_price || 0) * quantity,
      }
    : { items: [], total: 0 };

  console.log("one", product);

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#1690C7]">
              Home
            </Link>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-[#1690C7] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-8">
              <div className="aspect-square bg-white rounded-lg border">
                <ImageZoom
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="aspect-square rounded-lg"
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

               {product.faqs?.length > 0 && (
                <div className="bg-white p-6 rounded-lg border mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {product.faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mb-2">{product.company}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-medium ml-1">
                      {product.rating}
                    </span>
                    <span className="text-gray-600 ml-2">
                      ({product.reviews?.length} reviews)
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{(product.our_price || 0)?.toLocaleString()}
                  </span>
                  {(product.mrp || 0) > (product.our_price || 0) && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{(product.mrp || 0)?.toLocaleString()}
                      </span>
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium w-fit">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                {product.afterExchangePrice && (
                  <p className="text-sm text-gray-600 mb-4">
                    Exchange Price: ₹
                    {(product.afterExchangePrice || 0)?.toLocaleString()}
                  </p>
                )}

                {/* Offers */}
                {product.offers?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Available Offers
                    </h3>
                    <ul className="space-y-1">
                      {product.offers.map((offer, index) => (
                        <li key={index} className="text-sm text-green-600">
                          • {offer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coupons */}
                {product.coupons?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Coupons for you
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.coupons.map((coupon, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {coupon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-4">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Color:</span>
                    <span className="ml-2 font-medium">{product.color}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 font-medium">{product.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-medium">{product.weight}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Height:</span>
                    <span className="ml-2 font-medium">{product.height}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Availability:</span>
                    <span
                      className={`ml-2 font-medium ${product.in_stock ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product.stockQuantity !== undefined && (
                    <div>
                      <span className="text-gray-600">Stock Quantity:</span>
                      <span className="ml-2 font-medium">
                        {product.stockQuantity}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-4 mb-4">
                  <label className="font-medium text-gray-900">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock || isAddingToCart}
                    className="w-full bg-[#1690C7]"
                    size="lg"
                  >
                    {isAddingToCart
                      ? "Adding..."
                      : !product.in_stock
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleBuyNow}
                    disabled={!product.in_stock}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Services */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Truck className="h-8 w-8 text-[#1690C7] mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <RotateCcw className="h-8 w-8 text-[#1690C7] mx-auto mb-2" />
                  <p className="text-sm font-medium">Warranty</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Shield className="h-8 w-8 text-[#1690C7] mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                </div>
              </div>


            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <ReviewSection
              key={reviewKey}
              productId={product.id}
              reviews={productReviews.reviews || []}
              onReviewAdded={handleReviewAdded}
            />
          </div>

          {/* Related Products */}
          {relatedProducts?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onCartUpdate={() =>
                      window.dispatchEvent(new Event("storage"))
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={currentCart}
        products={product ? [product] : []}
        onOrderSuccess={handleOrderSuccess}
      />
    </Layout>
  );
}
