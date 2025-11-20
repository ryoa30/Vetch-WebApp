"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";
import { BlogValidator } from "@/lib/validators/BlogValidator";
import { BlogService } from "@/lib/services/BlogService";
import { useParams, useRouter } from "next/navigation";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import AddBlogDialogBox from "@/app/alert-dialog-box/AddBlogDialogBox";
import { se } from "date-fns/locale";
import LoadingOverlay from "@/components/LoadingOverlay";

interface IErrors {
  title?: string;
  categoryId?: string;
  content?: string;
  image?: string;
}

export default function AddBlogPage() {
  const { id } = useParams<{ id: string }>();

  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<Array<{id: string, categoryName: string}>>([]);
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  const router = useRouter();

  const [errors, setErrors] = useState<IErrors>({
    title: "",
    categoryId: "",
    content: "",
    image: "",
  });

  const blogValidator = new BlogValidator();
  const blogService = new BlogService();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePublish = async () => {
    const result = blogValidator.validateBlogInfo({ title, categoryId, content, image: image as File, id });
    if (!result.ok) {
      setIsLoading(false);
      setErrors(result.errors);
      setOpenError(true);
    } else {
      setErrors({});
      let result: any;
      if(id !== "add") {
        result = await blogService.changeBlog(id, categoryId, title, content, image);
      }else{
        result = await blogService.createBlog(categoryId, title, content, image as File);
      }
      setOpenAddDialog(false);
      setOpenUpdateDialog(false);
      if(result.ok){
        setImage(null);
        setTitle("");
        setCategoryId("");
        setContent("");
        setIsLoading(false);
        router.push('/admin/blog');
      }else{
        setIsLoading(false);
        setOpenError(true);
        setErrors({ title: result.error || "Failed to publish blog. Please try again." });
      }
    };
  }

  const loadCategories = async () => {
    const result = await blogService.fetchAllCategories();
    if(result.ok){
      setCategories(result.data);
    }
  }

  const loadBlogDetails = async () => {
    const result = await blogService.fetchBlogById(id);
    if(result.ok){
      const blog = result.data;
      setTitle(blog.title);
      setCategoryId(blog.categoryId);
      setContent(blog.context);
      setExistingImageUrl(blog.picture);
      console.log(blog);
      // Note: Image loading from URL is not handled here
    }
  }

  useEffect(() => {
    if(id !== "add"){
      loadBlogDetails();
    }
    loadCategories();
    setIsLoading(false);
  }, [])


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
        {(image || existingImageUrl) && (
          <Image
            src={image ? URL.createObjectURL(image) : existingImageUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
        )}
        <label className={`cursor-pointer flex flex-col items-center justify-center z-10 ${(image || existingImageUrl) ? 'duration-300 opacity-0 hover:opacity-100 hover:bg-black/50 text-white p-2 w-full h-full rounded-md' : 'text-gray-600'}`}>
            <span className={`font-medium ${(image || existingImageUrl) ? ' text-white ' : 'text-gray-600'}`}>+ Add Picture</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
      </div>

      {/* Blog Title */}
      <div className="mb-4">
        <label className="block text-white mb-2">Blog Title</label>
        <Input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white dark:bg-white text-black"
        />
      </div>

      {/* Blog Category */}
      <div className="mb-4">
        <label className="block text-white mb-2">Blog Category</label>
        <Select onValueChange={setCategoryId} value={categoryId}>
          <SelectTrigger className="bg-white dark:bg-white text-black dark:text-black rounded-md">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.categoryName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blog Content */}
      <div className="mb-6">
        <label className="block text-white mb-2">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {/* Publish Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if(id !== "add"){
              setOpenUpdateDialog(true);
            }else{
              setOpenAddDialog(true);
            }}}
          className="bg-[#9D6B6B] hover:bg-[#7b5252] text-white rounded-full px-6"
        >
          {id!=="add"?"Update":"Publish"}
        </Button>
      </div>

      {/* Error Dialog */}
      <LoadingOverlay show={isLoading} />
      <ErrorDialog open={openError} onOpenChange={setOpenError} errors={Object.values(errors).filter(err => err !== "")} />
      <AddBlogDialogBox open={openAddDialog} onConfirm={() => {setIsLoading(true); handlePublish(); }} onCancel={() => setOpenAddDialog(false)} />
      <AddBlogDialogBox open={openUpdateDialog} onConfirm={() => {setIsLoading(true); handlePublish(); }} onCancel={() => setOpenUpdateDialog(false)} />
    </div>
  );
}
