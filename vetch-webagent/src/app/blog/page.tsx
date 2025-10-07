"use client";

import { useState } from "react";

const categories = ["All", "Daily Care", "Nutrition", "Disease", "Prevention"];

const blogs = [
  {
    id: 1,
    title: "Judul Blog",
    date: "Sep 25, 2025",
    summary: "This is a short summary of the blog post...",
    category: "Nutrition",
    image: "/placeholder1.png",
  },
  {
    id: 2,
    title: "Judul Blog",
    date: "Sep 26, 2025",
    summary: "Another interesting blog summary goes here...",
    category: "Disease",
    image: "/placeholder2.png",
  },
  {
    id: 3,
    title: "Judul Blog",
    date: "Sep 27, 2025",
    summary: "Tips and tricks for daily pet care...",
    category: "Daily Care",
    image: "/placeholder3.png",
  },
  {
    id: 4,
    title: "Judul Blog",
    date: "Sep 28, 2025",
    summary: "How to prevent common pet issues effectively...",
    category: "Daily Care",
    image: "/placeholder4.png",
  },
];

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 bg-gray-800 overflow-hidden">
        <img
          src="/img/Blog.jpg"
          alt="Pet Blog"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <button className="px-6 py-2 bg-[#a08981] text-white rounded-full text-sm font-medium">
            All
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-[#fcffe5] py-8 px-6 min-h-screen">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border transition font-medium text-sm
                ${
                  activeCategory === cat
                    ? "bg-black text-white border-black"
                    : "border-gray-800 text-gray-800 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <h2 className="text-2xl font-bold mb-6">Recent Blog Posts</h2>

        {/* Blog Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`bg-[#fcffe5] rounded-lg flex flex-col ${
                index === 0 ? "md:row-span-2" : ""
              }`}
            >
              {/* Blog Image */}
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>

              {/* Blog Content */}
              <div className="flex flex-col flex-grow">
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <h3 className="text-lg font-semibold mb-1">Judul Blog</h3>
                <p className="text-gray-700 mb-4">Summary</p>

                {/* Tags + Read More */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="px-4 py-1.5 text-sm rounded-full bg-black text-white font-medium">
                    {blog.category}
                  </span>
                  <button className="px-6 py-1.5 rounded-full bg-[#926d66] text-white text-sm font-medium hover:bg-[#7d5b55] transition">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
