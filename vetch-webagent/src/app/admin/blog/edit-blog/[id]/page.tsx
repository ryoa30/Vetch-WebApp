"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddBlogPage() {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePublish = () => {
    console.log({ title, category, content, image });
    alert("Blog published!");
  };

  return (
    <div className="p-6 dark:bg-[#71998F]">
      <h1 className="text-3xl font-bold text-white mb-6">Blog</h1>

      {/* Divider bone */}
      <div className="w-full mb-6">
        <Image
          src="/img/bone.png"
          alt="divider"
          width={1000}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Upload Image */}
      <div className="w-full h-48 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center mb-6 relative rounded-md overflow-hidden">
        {image ? (
          <Image
            src={URL.createObjectURL(image)}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <span className="text-gray-600 font-medium">+ Add Picture</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Blog Title */}
      <div className="mb-4">
        <label className="block text-white mb-2">Blog Title</label>
        <Input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white dark:bg-white"
        />
      </div>

      {/* Blog Category */}
      <div className="mb-4">
        <label className="block text-white mb-2">Blog Category</label>
        <Select onValueChange={setCategory}>
          <SelectTrigger className="bg-white dark:bg-white text-black dark:text-black rounded-md">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily Care</SelectItem>
            <SelectItem value="nutrition">Nutrition</SelectItem>
            <SelectItem value="health">Health</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Content */}
      <div className="mb-6">
        <label className="block text-white mb-2">Content</label>
        <Textarea
          placeholder="Write your blog content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] bg-white dark:bg-white"
        />
      </div>

      {/* Publish Button */}
      <div className="flex justify-end">
        <Button
          onClick={handlePublish}
          className="bg-[#9D6B6B] hover:bg-[#7b5252] text-white rounded-full px-6"
        >
          Save blog
        </Button>
      </div>
    </div>
  );
}
