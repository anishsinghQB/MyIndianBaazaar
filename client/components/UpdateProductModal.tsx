import { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/types";

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, productData: Partial<Product>) => void;
  product: Product | null;
}

export default function UpdateProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: UpdateProductModalProps) {
  const [formData, setFormData] : any = useState({
    name: "",
    description: "",
    images: ["", "", "", "", ""],
    mrp: "",
    our_price: "",
    discount: "",
    rating: "4.0",
    afterExchangePrice: "",
    offers: [""],
    coupons: [""],
    company: "",
    color: "",
    size: "",
    weight: "",
    height: "",
    category: "clothes" as Product["category"],
    in_stock: true,
    stockQuantity: "",
    faqs: [{ id: "1", question: "", answer: "" }] as Array<{id: string, question: string, answer: string}>,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        images:
          product?.images?.length > 0
            ? [...product.images, "", "", "", "", ""].slice(0, 5)
            : ["", "", "", "", ""],
        mrp: product.mrp?.toString() || "",
        our_price: product.our_price?.toString() || "",
        discount: product.discount?.toString() || "",
        rating: product.rating?.toString() || "4.0",
        afterExchangePrice: product.afterExchangePrice?.toString() || "",
        offers: product?.offers?.length > 0 ? product.offers : [""],
        coupons: product?.coupons?.length > 0 ? product.coupons : [""],
        company: product.company || "",
        color: product.color || "",
        size: product.size || "",
        weight: product.weight || "",
        height: product.height || "",
        category: product.category || "clothes",
        in_stock : product.in_stock ?? true,
        stockQuantity: product.stockQuantity?.toString() || "",
        faqs:
          product?.faqs?.length > 0
            ? product?.faqs?.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              }))
            : [{ question: "", answer: "" }],
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const productData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      images: formData.images.filter((img) => img.trim() !== ""),
      mrp: parseFloat(formData.mrp) || 0,
      our_price: parseFloat(formData.our_price) || 0,
      discount: parseFloat(formData.discount) || 0,
      rating: parseFloat(formData.rating) || 0,
      afterExchangePrice: formData.afterExchangePrice
        ? parseFloat(formData.afterExchangePrice)
        : undefined,
      offers: formData.offers.filter((offer) => offer.trim() !== ""),
      coupons: formData.coupons.filter((coupon) => coupon.trim() !== ""),
      company: formData.company,
      color: formData.color,
      size: formData.size,
      weight: formData.weight,
      height: formData.height,
      category: formData.category,
      in_stock: formData.in_stock,
      stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : undefined,
      faqs: formData.faqs
        .filter((faq : any) => faq.question.trim() !== "" && faq.answer.trim() !== "")
        .map((faq : any, index : any) => ({
          id: (index + 1).toString(),
          question: faq.question,
          answer: faq.answer,
        })),
    };

    onSave(product.id, productData);
    onClose();
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const addOfferField = () => {
    setFormData((prev) => ({
      ...prev,
      offers: [...prev.offers, ""],
    }));
  };

  const removeOfferField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index),
    }));
  };

  const updateOffer = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.map((offer, i) => (i === index ? value : offer)),
    }));
  };

  const addCouponField = () => {
    setFormData((prev) => ({
      ...prev,
      coupons: [...prev.coupons, ""],
    }));
  };

  const removeCouponField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      coupons: prev.coupons.filter((_, i) => i !== index),
    }));
  };

  const updateCoupon = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      coupons: prev.coupons.map((coupon, i) => (i === index ? value : coupon)),
    }));
  };

  const addFaqField = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { id: (prev.faqs.length + 1).toString(), question: "", answer: "" }],
    }));
  };

  const removeFaqField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const updateFaq = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Update Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as Product["category"],
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="clothes">Clothes</option>
                <option value="beauty">Beauty</option>
                <option value="mice">Mice</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="groceries">Groceries</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Images
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    placeholder={`Image URL ${index + 1}`}
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData?.images?.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImageField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.mrp}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mrp: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Our Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.our_price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      our_price: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  After-exchange Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.afterExchangePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      afterExchangePrice: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stockQuantity: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, size: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, weight: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, height: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      in_stock: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                In Stock
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
