"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Books", "Clothing"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const result = await res.json();

        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter (search and category)
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "low-to-high") return a.price - b.price;
      if (sortBy === "high-to-low") return b.price - a.price;
      return 0; // Default/Newest
    });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Banner */}
      <section className="bg-blue-600 text-white py-12 px-6 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Buy & Sell on Campus with Ease
        </h1>
        <p className="mt-2 text-blue-100 max-w-xl mx-auto text-sm md:text-base">
          Safe, student-to-student marketplace powered by OneCard Escrow.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Integrated Filter Toolbar Card */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          {/* Top Row: Full-Width Search Bar + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Bar with Lucide Icon */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search books, calculators, gadgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="newest">Newest First</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Integrated Category Pills with Top Divider */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-gray-100 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg font-medium">No items found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try changing your search term or category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
