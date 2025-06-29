import { useState, useEffect } from "react";
import { Filter, Grid, List } from "lucide-react";
import Layout from "@/components/Layout";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/lib/sampleData";
import { Product } from "@shared/types";

const categories = [
  { id: "all", name: "All Products" },
  { id: "clothes", name: "Clothes" },
  { id: "beauty", name: "Beauty" },
  { id: "mice", name: "Mice" },
  { id: "electronics", name: "Electronics" },
  { id: "books", name: "Books" },
  { id: "groceries", name: "Groceries" },
];

export default function Index() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = products.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.ourPrice - b.ourPrice);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.ourPrice - a.ourPrice);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        filtered = [...filtered].sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  const handleCartUpdate = () => {
    // Force re-render to update cart count in header
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Slider */}
        <HeroSlider />

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {filteredProducts.length} Products
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Best Discount</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No products found in this category.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCartUpdate={handleCartUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      </div>
    </Layout>
  );