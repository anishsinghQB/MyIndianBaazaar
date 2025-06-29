import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<
    string | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
        setActiveMobileCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clean up timeout on unmount
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMobileCategoryClick = (categoryName: string) => {
    setActiveMobileCategory(
      activeMobileCategory === categoryName ? null : categoryName,
    );
  };

  const handleMouseEnter = (categoryName: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategory(categoryName);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow mouse movement to dropdown
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    // Cancel the close timeout if mouse enters dropdown
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    // Close immediately when leaving dropdown
    setHoveredCategory(null);
  };

  return (
    <div
      className="bg-gray-50 border-b border-gray-200 relative"
      ref={containerRef}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center py-3">
          <div className="flex items-center space-x-6 lg:space-x-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#1690C7] font-medium text-sm transition-colors py-3 px-3 rounded hover:bg-blue-50">
                  <span>{category.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Invisible bridge to prevent hover gaps */}
                {hoveredCategory === category.name && (
                  <div className="absolute top-full left-0 right-0 h-2 z-40" />
                )}

                {/* Desktop Dropdown Menu - Improved positioning with no gap */}
                {hoveredCategory === category.name && (
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-80 lg:w-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 mt-1"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <div className="p-4 lg:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                      {/* Additional categories for larger screens */}
                      {category.subCategories.length > 2 && (
                        <div className="mt-6 pt-4 border-t border-gray-100 hidden lg:block">
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
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Shop by Category
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-[#1690C7] transition-colors"
            >
              <Menu className="h-4 w-4" />
              <span className="text-sm">Menu</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <button
                        onClick={() => handleMobileCategoryClick(category.name)}
                        className="flex items-center justify-between w-full py-3 text-left text-gray-700 hover:text-[#1690C7] transition-colors"
                      >
                        <span className="font-medium">{category.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeMobileCategory === category.name
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {/* Mobile Subcategories */}
                      {activeMobileCategory === category.name && (
                        <div className="pb-4 pl-4 space-y-3">
                          {category.subCategories.map((subCategory, index) => (
                            <div key={index}>
                              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                {subCategory.name}
                              </h3>
                              <ul className="space-y-1 pl-2">
                                {subCategory.items
                                  .slice(0, 4)
                                  .map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      <button className="text-gray-600 hover:text-[#1690C7] text-sm transition-colors text-left block w-full py-1">
                                        {item}
                                      </button>
                                    </li>
                                  ))}
                                {subCategory.items.length > 4 && (
                                  <li>
                                    <button className="text-[#1690C7] text-sm font-medium">
                                      View All ({subCategory.items.length - 4}{" "}
                                      more)
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background overlay for dropdown - only for visual effect, no mouse events */}
      {hoveredCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-5 z-40 pointer-events-none" />
      )}
    </div>
  );
}
