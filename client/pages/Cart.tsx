import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  calculateTotal,
  clearCart,
} from "@/lib/cart";
import { sampleProducts } from "@/lib/sampleData";
import { Cart as CartType, Product } from "@shared/types";

export default function Cart() {
  const [cart, setCart] = useState<CartType>({ items: [], total: 0 });
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const currentCart = getCart();
    const total = calculateTotal(currentCart, products);
    setCart({ ...currentCart, total });
  }, [products]);

  const handleQuantityUpdate = async (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string,
  ) => {
    setIsUpdating(productId);
    try {
      const updatedCart = updateQuantity(
        productId,
        quantity,
        selectedSize,
        selectedColor,
      );
      const total = calculateTotal(updatedCart, products);
      setCart({ ...updatedCart, total });
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = (
    productId: string,
    selectedSize?: string,
    selectedColor?: string,
  ) => {
    const updatedCart = removeFromCart(productId, selectedSize, selectedColor);
    const total = calculateTotal(updatedCart, products);
    setCart({ ...updatedCart, total });
    window.dispatchEvent(new Event("storage"));
  };

  const handleClearCart = () => {
    const emptyCart = clearCart();
    setCart(emptyCart);
    window.dispatchEvent(new Event("storage"));
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link to="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button variant="outline" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <div
                  key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white rounded-lg border p-6"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-32 md:h-32 w-full h-48">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.company}
                          </p>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">
                              Size: {item.selectedSize}
                            </p>
                          )}
                          {item.selectedColor && (
                            <p className="text-sm text-gray-500">
                              Color: {item.selectedColor}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityUpdate(
                                  item.productId,
                                  item.quantity - 1,
                                  item.selectedSize,
                                  item.selectedColor,
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating === item.productId
                              }
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityUpdate(
                                  item.productId,
                                  item.quantity + 1,
                                  item.selectedSize,
                                  item.selectedColor,
                                )
                              }
                              disabled={isUpdating === item.productId}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹
                            {(
                              product.ourPrice * item.quantity
                            ).toLocaleString()}
                          </p>
                          {product.mrp > product.ourPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{(product.mrp * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal (
                    {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-medium">
                    ₹{cart.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ₹{Math.round(cart.total * 0.18).toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{Math.round(cart.total * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Secure checkout with 256-bit SSL encryption
                </p>
              </div>

              {/* Offers */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">
                  Available Offers
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Free shipping on orders above ₹500</li>
                  <li>• Get 5% cashback with our credit card</li>
                  <li>• Buy 3 items and get 10% off</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}