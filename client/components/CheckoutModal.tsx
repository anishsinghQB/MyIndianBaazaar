import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";
import { Cart, Product, CreateOrderRequest } from "@shared/types";
import axios from "axios";

const shippingSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().default("India"),
});

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  products: Product[];
  onOrderSuccess: (orderId: number) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  products,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const taxAmount = Math.round((cart.total || 0) * 0.18);
  const finalTotal = (cart.total || 0) + taxAmount;

  const onSubmit = async (shippingData: z.infer<typeof shippingSchema>) => {
    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Prepare order items
      const orderItems = cart.items
        .map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.our_price || 0,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          };
        })
        .filter(Boolean) as CreateOrderRequest["items"];

      // Create order
      const createOrderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "INR",
          items: orderItems,
          shippingAddress: shippingData,
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const { orderId, razorpayOrder } = await createOrderResponse.json();

      // Initialize Razorpay
      const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_key",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Clear cart
            localStorage.removeItem("indianbaazaar-cart");
            window.dispatchEvent(new Event("storage"));

            onOrderSuccess(orderId);
            onClose();
          } catch (error) {
            console.error("Payment verification error:", error);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3b82f6",
        },
      };

      // Check if Razorpay is loaded
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error(
          "Payment gateway not loaded. Please refresh and try again.",
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during checkout",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Checkout
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.selectedSize &&
                              ` • Size: ${item.selectedSize}`}
                            {item.selectedColor &&
                              ` • Color: ${item.selectedColor}`}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ₹
                        {(
                          (product.our_price || 0) * (item.quantity || 0)
                        )?.toLocaleString()}
                      </p>
                    </div>
                  );
                })}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{(cart.total || 0)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{(taxAmount || 0)?.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(finalTotal || 0)?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your street address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode *</FormLabel>
                            <FormControl>
                              <Input placeholder="6-digit pincode" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 "
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 bg-[#1690C7]"
                      >
                        <CreditCard className="h-4 w-4 mr-2 " />
                        {isProcessing
                          ? "Processing..."
                          : `Pay ₹${(finalTotal || 0)?.toLocaleString()}`}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
