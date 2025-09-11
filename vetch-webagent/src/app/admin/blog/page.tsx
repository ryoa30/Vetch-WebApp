"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

const blogs = [
  {
    id: 1,
    date: "20 May 2025",
    title: "How to Care Your Cat",
    category: "Daily Care",
    image: "/img/placeholder.png",
  },
  {
    id: 2,
    date: "18 May 2025",
    title: "Dog Nutrition Tips",
    category: "Daily Care",
    image: "/img/placeholder.png",
  },
  {
    id: 3,
    date: "15 May 2025",
    title: "Rabbit Grooming Guide",
    category: "Daily Care",
    image: "/img/placeholder.png",
  },
  {
    id: 4,
    date: "10 May 2025",
    title: "Exotic Pets Basics",
    category: "Daily Care",
    image: "/img/placeholder.png",
  },
];

export default function BlogPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">Blog</h1>
        <Input
          placeholder="Search for blog"
          className="w-full md:w-64 mt-3 md:mt-0 rounded-full bg-white dark:bg-white"
        />
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={800}
          height={40}
          className="object-contain w-full max-w-4xl"
        />
      </div>

      {/* Add Blog Button */}
      <div className="flex justify-end mb-4">
        <Link href="/admin/blog/add-blog">
          <Button variant="outline" className="rounded-full bg-white dark:bg-white text-black dark:text-black">
            + Add Blog
          </Button>
        </Link>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="overflow-hidden shadow-md rounded-2xl bg-white dark:bg-[#2D4236]"
          >
            <CardHeader className="p-0">
              <Image
                src={blog.image}
                alt={blog.title}
                width={400}
                height={200}
                className="w-full h-40 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">{blog.date}</p>
                  <h2 className="text-lg font-bold">{blog.title}</h2>
                </div>
                <span className="ml-2 px-3 py-1 text-xs font-semibold bg-black text-white rounded-full whitespace-nowrap">
                  {blog.category}
                </span>
              </div>

              {/* Read More + Action Buttons */}
              <div className="flex justify-between items-center mt-3">
                <Button className="bg-[#9D6B6B] hover:bg-[#7b5252] text-black rounded-full px-4">
                  Read More
                </Button>
                <div className="flex gap-2">
                  <Link href={`/admin/blog/edit-blog/${blog.id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
