"use client";

import React, { useState, useEffect } from "react";
import { Article } from "./interface/Article";
import SearchFilterBar from "./components/SearchBarBlog";
import LatestArticle from "./components/LatestBlog";
import SidebarArticles from "./components/sidebarBlog";
import ArticleCarousel from "./components/blogCarousel";
import { useSearchParams } from "next/navigation";
import { slugify } from "./interface/Slugify";
import { BlogService } from "@/lib/services/BlogService";
import ArticleDetails from "./components/blogDetails";
import { ArrowLeft } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

// const rawArticles = [
//   {
//     id: 1,
//     title: "Pentingnya Nutrisi Seimbang untuk Hewan Peliharaan",
//     date: "Sep 25, 2025",
//     summary:
//       "Pelajari cara memilih makanan yang tepat untuk hewan peliharaan agar tetap sehat, aktif, dan berumur panjang.",
//     category: "Nutrition",
//     imageSrc: "/img/blog/nutrition/nutrition1.jpg",
//     createdAt: "2025-09-25T09:00:00",
//   },
//   {
//     id: 2,
//     title: "Mengenali Penyakit Umum pada Hewan Peliharaan",
//     date: "Sep 26, 2025",
//     summary:
//       "Kenali tanda-tanda awal penyakit pada hewan kesayangan dan kapan harus membawa mereka ke dokter hewan.",
//     category: "Disease",
//     imageSrc: "/img/blog/disease/disease1.jpg",
//     createdAt: "2025-09-25T09:00:00",
//   },
//   {
//     id: 3,
//     title: "Rutinitas Perawatan Harian untuk Hewan Peliharaan",
//     date: "Sep 27, 2025",
//     summary:
//       "Panduan sederhana menjaga kebersihan, kesehatan, dan kebahagiaan hewan peliharaan melalui rutinitas harian.",
//     category: "Daily Care",
//     imageSrc: "/img/blog/dailycare/dailycare1.jpg",
//     createdAt: "2025-09-25T09:00:00",
//   },
// ];

// export const articles: Article[] = rawArticles.map((a) => ({
//   ...a,
//   slug: slugify(a.title),
// }));

const BlogPage = () => {
  const [query, setQuery] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [latestArticle, setLatestArticle] = useState<Article | null>(null);
  const [sidebarArticles, setSidebarArticles] = useState<Article[]>([]);
  const {setIsLoading} = useLoading();
  const blogService = new BlogService();

  const loadCategories = async () => {
    try {
      const result = await blogService.fetchAllCategories();
      console.log(result);
      if (result.ok) {
        setCategories([{id:"0", categoryName:"All"},...result.data]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const result = await blogService.fetchBlogs(1, 100, query, selectedCategory);
      if (result.ok) {
        console.log("blogs",result)
        setArticles(result.data.blogs);
        if(result.data.blogs.length > 0){
          setLatestArticle(result.data.blogs[0]);
          setSidebarArticles(result.data.blogs.slice(1, 6));
        } else {
          setLatestArticle(null);
          setSidebarArticles([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setSelectedArticle(null);
    loadBlogs();
  }, [selectedCategory])

  useEffect(()=>{
    loadCategories();
  }, [])

  return (
    <div className="bg-[#B3D8A8] dark:bg-[#357C72] text-black dark:text-white h-full">
      <SearchFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        articles={articles}
        inputValue={query}
        setInputValue={setQuery}
        onAction={loadBlogs}
      />

      {!latestArticle && (
        <div className="px-6 md:px-16 py-10 font-sans">
          <h2 className="text-xl font-bold">
            There are no articles available in this category.
          </h2>
        </div>
      )}
      {latestArticle && (
        <>
          <div className="px-6 md:px-16 py-10 font-sans">
            <div className="flex flex-col md:flex-row gap-6">
              {selectedArticle?
              <>
              <div className="flex flex-col gap-5">
                <button className="flex justify-start items-center gap-3 cursor-pointer" onClick={() => setSelectedArticle(null)}>
                  <ArrowLeft className="w-8 h-8 text-white"/>
                  <span className="text-white font-semibold text-xl">Back</span>
                </button>
                  <ArticleDetails article={selectedArticle} />
              </div>
                <SidebarArticles articles={sidebarArticles} setSelectedArticle={setSelectedArticle}/>
              </>
              :
              <>
                <div className="md:max-w-[50%]">
                    <LatestArticle article={latestArticle} setSelectedArticle={setSelectedArticle}/>
                </div>
                <SidebarArticles articles={sidebarArticles} setSelectedArticle={setSelectedArticle}/>
              </>}
            </div>
          </div>
          <ArticleCarousel articles={articles} setSelectedArticle={setSelectedArticle}/>
        </>
      )}
    </div>
  );
};

export default BlogPage;
