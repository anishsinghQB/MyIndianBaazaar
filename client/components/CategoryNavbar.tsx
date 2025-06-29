import { useState } from "react";
import { ChevronDown, Star, Zap, Gift, Heart } from "lucide-react";

interface SubCategory {
  name: string;
  items: string[];
}

interface Category {
  name: string;
  subCategories: SubCategory[];
  featured?: string[];
  badge?: string;
  icon?: React.ComponentType<any>;
}

const categories: Category[] = [
  {
    name: "Trending",
    icon: Star,
    badge: "🔥 Hot",
    featured: ["iPhone 15", "Samsung Galaxy", "MacBook Air", "AirPods Pro"],
    subCategories: [
      {
        name: "Hot Deals",
        items: [
          "Today's Specials",
          "Flash Sales",
          "Limited Time Offers",
          "Bundle Deals",
          "Clearance Items",
          "Mega Discounts",
          "Best Sellers",
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
          "Trending Now",
          "Editor's Choice",
        ],
      },
      {
        name: "Categories",
        items: [
          "Electronics",
          "Fashion",
          "Home & Garden",
          "Sports",
          "Beauty",
          "Automotive",
        ],
      },
    ],
  },
  {
    name: "FastTravel",
    icon: Zap,
    badge: "⚡ Express",
    featured: ["Same Day", "2-Hour Delivery", "Express Shipping", "Priority"],
    subCategories: [
      {
        name: "Quick Delivery",
        items: [
          "Same Day Delivery",
          "Express Shipping",
          "2-Hour Delivery",
          "Overnight Shipping",
          "Priority Orders",
          "Rush Delivery",
          "Instant Fulfillment",
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
          "Quick Ship",
          "Express Processing",
        ],
      },
      {
        name: "Delivery Options",
        items: [
          "Free Shipping",
          "Premium Delivery",
          "Weekend Delivery",
          "Evening Slots",
          "Morning Delivery",
          "Flexible Timing",
        ],
      },
    ],
  },
  {
    name: "Gift",
    icon: Gift,
    badge: "🎁 Special",
    featured: ["Gift Cards", "Personalized", "Luxury Items", "Occasion Gifts"],
    subCategories: [
      {
        name: "Gift Categories",
        items: [
          "Birthday Gifts",
          "Anniversary Gifts",
          "Wedding Gifts",
          "Festival Gifts",
          "Corporate Gifts",
          "Baby Gifts",
          "Graduation Gifts",
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
          "Express Gifting",
          "Gift Delivery",
        ],
      },
      {
        name: "Occasions",
        items: [
          "Valentine's Day",
          "Mother's Day",
          "Father's Day",
          "Christmas",
          "Diwali",
          "New Year",
        ],
      },
    ],
  },
  {
    name: "Kids",
    badge: "👶 Family",
    featured: ["Educational Toys", "Baby Care", "Kids Fashion", "Learning"],
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
          "Board Games",
          "Action Figures",
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
          "Strollers",
          "Car Seats",
        ],
      },
      {
        name: "Kids Fashion",
        items: [
          "Boys Clothing",
          "Girls Clothing",
          "Kids Shoes",
          "School Uniforms",
          "Party Wear",
          "Casual Wear",
        ],
      },
    ],
  },
  {
    name: "Kitchen",
    badge: "🍳 Cook",
    featured: ["Air Fryers", "Mixers", "Cookware Sets", "Smart Appliances"],
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
          "Air Fryers",
          "Blenders",
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
          "Bakeware",
          "Serving Dishes",
        ],
      },
      {
        name: "Smart Kitchen",
        items: [
          "Smart Appliances",
          "Digital Scales",
          "Smart Cookers",
          "App-Controlled",
          "Voice Assistants",
          "IoT Devices",
        ],
      },
    ],
  },
  {
    name: "Sales",
    badge: "💰 Save",
    featured: ["Up to 70% Off", "Mega Sale", "Clearance", "End of Season"],
    subCategories: [
      {
        name: "Discounts",
        items: [
          "Up to 50% Off",
          "Up to 70% Off",
          "Mega Sale",
          "End of Season Sale",
          "Warehouse Sale",
          "Flash Deals",
          "Daily Deals",
          "Weekend Specials",
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
          "Free Gifts",
          "Bundle Discounts",
        ],
      },
      {
        name: "Seasonal Sales",
        items: [
          "Summer Sale",
          "Winter Sale",
          "Festival Sale",
          "New Year Sale",
          "Black Friday",
          "Cyber Monday",
        ],
      },
    ],
  },
  {
    name: "Offers",
    badge: "🎯 Deal",
    featured: ["Cashback", "Coupons", "Bank Offers", "Loyalty Rewards"],
    subCategories: [
      {
        name: "Coupons",
        items: [
          "First Order Discount",
          "Festive Offers",
          "Weekend Specials",
          "Student Discounts",
          "Loyalty Rewards",
          "Referral Bonus",
          "App Exclusive",
          "Email Subscribers",
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
          "Loyalty Points",
          "Reward Program",
        ],
      },
      {
        name: "Bank Offers",
        items: [
          "HDFC Bank",
          "SBI Bank",
          "ICICI Bank",
          "Axis Bank",
          "Credit Cards",
          "Debit Cards",
        ],
      },
    ],
  },
  {
    name: "Fashion",
    icon: Heart,
    badge: "👗 Style",
    featured: [
      "Designer Wear",
      "Ethnic Collection",
      "Western Wear",
      "Accessories",
    ],
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
          "Formal Wear",
          "Casual Wear",
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
          "Western Wear",
          "Ethnic Wear",
        ],
      },
      {
        name: "Fashion Trends",
        items: [
          "Latest Trends",
          "Designer Collections",
          "Seasonal Fashion",
          "Celebrity Style",
          "Street Fashion",
          "Sustainable Fashion",
        ],
      },
    ],
  },
];

export default function CategoryNavbar() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-white border-b border-gray-200 relative shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Left side categories */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-[#1690C7] font-medium text-sm transition-colors py-2 px-2 rounded-lg hover:bg-blue-50">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{category.name}</span>
                    <ChevronDown className="h-3 w-3" />
                    {category.badge && (
                      <span className="ml-1 text-xs bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-0.5 rounded-full">
                        {category.badge}
                      </span>
                    )}
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {hoveredCategory === category.name && (
                    <div className="absolute top-full left-0 w-[32rem] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 mt-2">
                      {/* Featured Section */}
                      {category.featured && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-xl border-b border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            Featured in {category.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {category.featured.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories Grid */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-8">
                          {category.subCategories
                            .slice(0, 2)
                            .map((subCategory, index) => (
                              <div key={index}>
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm border-b border-gray-100 pb-2">
                                  {subCategory.name}
                                </h3>
                                <ul className="space-y-2">
                                  {subCategory.items
                                    .slice(0, 6)
                                    .map((item, itemIndex) => (
                                      <li key={itemIndex}>
                                        <button className="text-gray-600 hover:text-[#1690C7] text-sm transition-colors text-left hover:bg-blue-50 px-2 py-1 rounded w-full">
                                          {item}
                                        </button>
                                      </li>
                                    ))}
                                  {subCategory.items.length > 6 && (
                                    <li>
                                      <button className="text-[#1690C7] text-sm font-medium hover:underline">
                                        View All ({subCategory.items.length - 6}{" "}
                                        more)
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ))}
                        </div>

                        {/* Additional categories if any */}
                        {category.subCategories.length > 2 && (
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-3 gap-4">
                              {category.subCategories
                                .slice(2)
                                .map((subCategory, index) => (
                                  <div key={index}>
                                    <h4 className="font-medium text-gray-900 mb-2 text-xs">
                                      {subCategory.name}
                                    </h4>
                                    <ul className="space-y-1">
                                      {subCategory.items
                                        .slice(0, 4)
                                        .map((item, itemIndex) => (
                                          <li key={itemIndex}>
                                            <button className="text-gray-600 hover:text-[#1690C7] text-xs transition-colors text-left">
                                              {item}
                                            </button>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                          <button className="text-[#1690C7] font-medium text-sm hover:underline">
                            Explore All {category.name} Products →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right side additional info */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>Free shipping above ₹500</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay for dropdown - only for visual effect, no mouse events */}
      {hoveredCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-5 z-40 pointer-events-none" />
      )}
    </div>
  );
}
