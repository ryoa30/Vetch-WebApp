'use client';

import React from "react";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchFilterBar from '../components/SearchBarBlog';
import LatestArticle from '../components/LatestBlog';
import SidebarArticles from '../components/sidebarBlog';
import ArticleCarousel from '../components/blogCarousel';
import ArticleDetails from '../components/blogDetails';
import { slugify } from '../interface/Slugify';
import { Article } from '../interface/Article';

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
    createdAt: "2025-09-25T09:00:00",
  },
  {
    id: 2,
    title: "Mengenali Penyakit Umum pada Hewan Peliharaan",
    date: "Sep 26, 2025",
    summary:
      "Kenali tanda-tanda awal penyakit pada hewan kesayangan dan kapan harus membawa mereka ke dokter hewan.",
    category: "Disease",
    imageSrc: "/img/blog/disease/disease1.jpg",
    createdAt: "2025-09-26T09:00:00",
  },
  {
    id: 3,
    title: "Rutinitas Perawatan Harian untuk Hewan Peliharaan",
    date: "Sep 27, 2025",
    summary:
      "Panduan sederhana menjaga kebersihan, kesehatan, dan kebahagiaan hewan peliharaan melalui rutinitas harian.",
    category: "Daily Care",
    imageSrc: "/img/blog/dailycare/dailycare1.jpg",
    createdAt: "2025-09-27T09:00:00",
  },
];

const articles: Article[] = rawArticles.map(a => ({
  ...a,
  slug: slugify(a.title),
}));

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params); // ✅ unwrap Promise
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <div className="p-6 text-red-500">Artikel tidak ditemukan.</div>;
  }

  const selectedCategory = categoryFromUrl && categories.includes(categoryFromUrl)
    ? categoryFromUrl
    : 'All';

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredArticles =
    selectedCategory === 'All'
      ? sortedArticles
      : sortedArticles.filter(a => a.category === selectedCategory);

  const latestArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const sidebarArticles = filteredArticles
    .filter(a => a.slug !== article.slug)
    .slice(0, 5);

  const showDetail = selectedCategory === 'All';

  const onSelectCategory = (cat: string) => {
    router.push(`/blog/${article.slug}?category=${encodeURIComponent(cat)}`);
  };

  return (
    <>
      <SearchFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        articles={articles}
      />

      <div className="px-6 md:px-16 py-10 font-sans">
        <div className="flex items-center text-base text-gray-400 mb-4 gap-2">
          <Link href={`/blog?category=${encodeURIComponent(selectedCategory)}`}>
            <span>Blog</span>
          </Link>
          <span className="text-3xl font-light" style={{ transform: 'translateY(-3px)' }}>
            ›
          </span>
          <span className="font-medium text-gray-700">
            {showDetail ? article.category : selectedCategory}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showDetail ? (
            <>
              <ArticleDetails article={article} />
              <SidebarArticles articles={sidebarArticles} />
            </>
          ) : (
            <>
              {latestArticle && (
                <div className="md:col-span-2">
                  <LatestArticle article={latestArticle} />
                </div>
              )}
              <SidebarArticles articles={sidebarArticles} />
            </>
          )}
        </div>
      </div>

      <ArticleCarousel articles={filteredArticles} />
    </>
  );
}
