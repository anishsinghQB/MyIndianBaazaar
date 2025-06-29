import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SubCategory {
  name: string;
  items: string[];
}

interface Category {
  name: string;
  subCategories: SubCategory[];
}

const categories: Category[] = [
  {
    name: "Trending",
    subCategories: [
      {
        name: "Hot Deals",
        items: [
          "Today's Specials",
          "Flash Sales",
          "Limited Time Offers",
          "Bundle Deals",
          "Clearance Items",
        ],
      },
      {
        name: "Popular Products",
        items: [
          "Best Sellers",
          "Customer Favorites",
          "Most Reviewed",
          "New Arrivals",
          "Recently Viewed",
        ],
      },
    ],
  },
  {
    name: "Fastavel",
    subCategories: [
      {
        name: "Quick Delivery",
        items: [
          "Same Day Delivery",
          "Express Shipping",
          "2-Hour Delivery",
          "Overnight Shipping",
          "Priority Orders",
        ],
      },
      {
        name: "Ready to Ship",
        items: [
          "In Stock Items",
          "Pre-packed Orders",
          "Local Warehouse",
          "Fast Track Items",
          "Instant Checkout",
        ],
      },
    ],
  },
  {
    name: "Gift",
    subCategories: [
      {
        name: "Gift Categories",
        items: [
          "Birthday Gifts",
          "Anniversary Gifts",
          "Wedding Gifts",
          "Festival Gifts",
          "Corporate Gifts",
        ],
      },
      {
        name: "Gift Services",
        items: [
          "Gift Wrapping",
          "Gift Cards",
          "Personalized Gifts",
          "Gift Boxes",
          "Message Cards",
        ],
      },
    ],
  },
  {
    name: "Kids",
    subCategories: [
      {
        name: "Toys & Games",
        items: [
          "Learning Toys",
          "Educational Toys",
          "Musical Toy Instruments",
          "Vehicle Toys",
          "Puzzles",
          "Baby Toys",
          "Gaming Toys",
        ],
      },
      {
        name: "Baby Essentials",
        items: [
          "Baby Bath",
          "Baby Care",
          "Nursing & Feeding",
          "Diapers",
          "Baby Clothes",
          "Baby Furniture",
          "Baby Safety",
        ],
      },
    ],
  },
  {
    name: "Kitchen",
    subCategories: [
      {
        name: "Appliances",
        items: [
          "Mixer Grinders",
          "Microwave Ovens",
          "Electric Kettles",
          "Toasters",
          "Food Processors",
          "Pressure Cookers",
          "Induction Cooktops",
        ],
      },
      {
        name: "Cookware & Utensils",
        items: [
          "Non-stick Pans",
          "Stainless Steel Sets",
          "Kitchen Knives",
          "Cutting Boards",
          "Storage Containers",
          "Dinner Sets",
          "Kitchen Tools",
        ],
      },
    ],
  },
  {
    name: "Sales",
    subCategories: [
      {
        name: "Discounts",
        items: [
          "Up to 50% Off",
          "Up to 70% Off",
          "Mega Sale",
          "End of Season Sale",
          "Warehouse Sale",
        ],
      },
      {
        name: "Special Offers",
        items: [
          "Buy 1 Get 1",
          "Buy 2 Get 1 Free",
          "Combo Offers",
          "Bank Offers",
          "Cashback Deals",
        ],
      },
    ],
  },
  {
    name: "Offers",
    subCategories: [
      {
        name: "Coupons",
        items: [
          "First Order Discount",
          "Festive Offers",
          "Weekend Specials",
          "Student Discounts",
          "Loyalty Rewards",
        ],
      },
      {
        name: "Cashback",
        items: [
          "Wallet Cashback",
          "Credit Card Offers",
          "UPI Cashback",
          "App Exclusive",
          "Referral Bonus",
        ],
      },
    ],
  },
  {
    name: "Fashion",
    subCategories: [
      {
        name: "Men's Fashion",
        items: [
          "Shirts & T-Shirts",
          "Pants & Jeans",
          "Ethnic Wear",
          "Shoes & Footwear",
          "Accessories",
          "Winter Wear",
          "Sports Wear",
        ],
      },
      {
        name: "Women's Fashion",
        items: [
          "Dresses & Tops",
          "Sarees & Lehengas",
          "Jeans & Trousers",
          "Shoes & Sandals",
          "Jewelry & Accessories",
          "Beauty Products",
          "Handbags",
        ],
      },
    ],
  },
];

export default function CategoryNavbar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-gray-50 border-b border-gray-200 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-[#1690C7] font-medium text-sm transition-colors py-2">
                <span>{category.name}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Dropdown Menu */}
              {hoveredCategory === category.name && (
                <div className="absolute top-full left-0 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1">
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6">
                      {category.subCategories.map((subCategory, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                            {subCategory.name}
                          </h3>
                          <ul className="space-y-2">
                            {subCategory.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <button className="text-gray-600 hover:text-[#1690C7] text-sm transition-colors text-left">
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Background overlay for dropdown - only for visual effect, no mouse events */}
      {hoveredCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-5 z-40 pointer-events-none" />
      )}
    </div>
  );
}
