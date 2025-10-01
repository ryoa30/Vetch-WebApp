// components/BlogSection.tsx
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
];

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

  return (
    <section className="bg-[#fcffe5] py-10 px-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border transition 
              ${
                activeCategory === cat
                  ? "bg-black text-white"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-bold mb-6">Recent Blog Posts</h2>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col md:flex-row bg-white shadow rounded-lg overflow-hidden"
          >
            {/* Blog Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full md:w-1/3 h-40 object-cover"
            />

            {/* Blog Content */}
            <div className="p-4 flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500">{blog.date}</p>
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                <p className="text-gray-600">{blog.summary}</p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 text-sm rounded-full bg-black text-white">
                  {blog.category}
                </span>
                <button className="ml-auto px-4 py-1 rounded-full bg-[#926d66] text-white">
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
