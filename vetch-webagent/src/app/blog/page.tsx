"use client";

import React, { useState, useEffect } from "react";
import { Article } from "./interface/Article";
import SearchFilterBar from "./components/SearchBarBlog";
import LatestArticle from "./components/LatestBlog";
import SidebarArticles from "./components/sidebarBlog";
import ArticleCarousel from "./components/blogCarousel";
import { useSearchParams } from "next/navigation";
import { slugify } from './interface/Slugify';

const categories = ["All", "Daily Care", "Nutrition", "Disease", "Prevention"];

const rawArticles = [
  {
    id: 1,
    title: "Pentingnya Nutrisi Seimbang untuk Hewan Peliharaan",
    date: "Sep 25, 2025",
    summary:
      "Pelajari cara memilih makanan yang tepat untuk hewan peliharaan agar tetap sehat, aktif, dan berumur panjang.",
    category: "Nutrition",
    imageSrc: "/img/blog/nutrition/nutrition1.jpg",
    createdAt: "2025-09-25T09:00:00"
  },
  {
    id: 2,
    title: "Mengenali Penyakit Umum pada Hewan Peliharaan",
    date: "Sep 26, 2025",
    summary:
      "Kenali tanda-tanda awal penyakit pada hewan kesayangan dan kapan harus membawa mereka ke dokter hewan.",
    category: "Disease",
    imageSrc: "/img/blog/disease/disease1.jpg",
    createdAt: "2025-09-25T09:00:00"
  },
  {
    id: 3,
    title: "Rutinitas Perawatan Harian untuk Hewan Peliharaan",
    date: "Sep 27, 2025",
    summary:
      "Panduan sederhana menjaga kebersihan, kesehatan, dan kebahagiaan hewan peliharaan melalui rutinitas harian.",
    category: "Daily Care",
    imageSrc: "/img/blog/dailycare/dailycare1.jpg",
    createdAt: "2025-09-25T09:00:00"
  },
];

export const articles: Article[] = rawArticles.map(a => ({
    ...a,
    slug: slugify(a.title),
}));

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const sortedArticles: Article[] = [...articles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredArticles =
    selectedCategory === "All"
      ? sortedArticles
      : sortedArticles.filter(
          (article) => article.category === selectedCategory
        );

  const latestArticle = filteredArticles[0];
  const sidebarArticles = filteredArticles.slice(1, 5);

  if (!latestArticle) {
    return (
      <div className="px-6 md:px-16 py-10 font-sans">
        <h2 className="text-xl font-bold">
          Tidak ada artikel pada kategori ini.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-[#B3D8A8] dark:bg-[#357C72] text-black dark:text-white">
      <SearchFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        articles={articles}
      />

      <div className="px-6 md:px-16 py-10 font-sans">
        <div className="flex flex-col md:flex-row gap-6">
          <LatestArticle article={latestArticle} />
          <SidebarArticles articles={sidebarArticles} />
        </div>
      </div>
      <ArticleCarousel articles={filteredArticles} />
    </div>
  );
};

export default BlogPage;
