// 'use client';

// import React from "react";
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import SearchFilterBar from '../components/SearchBarBlog';
// import LatestArticle from '../components/LatestBlog';
// import SidebarArticles from '../components/sidebarBlog';
// import ArticleCarousel from '../components/blogCarousel';
// import ArticleDetails from '../components/blogDetails';
// import { slugify } from '../interface/Slugify';
// import { Article } from '../interface/Article';

// export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = React.use(params); // ✅ unwrap Promise
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const categoryFromUrl = searchParams.get('category');
  
//   const article = articles.find(a => a.slug === slug);

//   if (!article) {
//     return <div className="p-6 text-red-500">Artikel tidak ditemukan.</div>;
//   }

//   const selectedCategory = categoryFromUrl && categories.includes(categoryFromUrl)
//     ? categoryFromUrl
//     : 'All';

//   const sortedArticles = [...articles].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   );

//   const filteredArticles =
//     selectedCategory === 'All'
//       ? sortedArticles
//       : sortedArticles.filter(a => a.category === selectedCategory);

//   const latestArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
//   const sidebarArticles = filteredArticles
//     .filter(a => a.slug !== article.slug)
//     .slice(0, 5);

//   const showDetail = selectedCategory === 'All';

//   const onSelectCategory = (cat: string) => {
//     router.push(`/blog/${article.slug}?category=${encodeURIComponent(cat)}`);
//   };

//   return (
//     <div className="bg-[#B3D8A8] dark:bg-[#357C72]">
//       <SearchFilterBar
//         categories={categories}
//         selectedCategory={selectedCategory}
//         onSelectCategory={onSelectCategory}
//         articles={articles}
//       />

//       <div className="px-6 md:px-16 py-10 font-sans">
//         <div className="flex items-center text-base text-gray-400 mb-4 gap-2">
//           <Link href={`/blog?category=${encodeURIComponent(selectedCategory)}`}>
//             <span>Blog</span>
//           </Link>
//           <span className="text-3xl font-light" style={{ transform: 'translateY(-3px)' }}>
//             ›
//           </span>
//           <span className="font-medium text-gray-700">
//             {showDetail ? article.category : selectedCategory}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {showDetail ? (
//             <>
//               <ArticleDetails article={article} />
//               <SidebarArticles articles={sidebarArticles} />
//             </>
//           ) : (
//             <>
//               {latestArticle && (
//                 <div className="md:col-span-2">
//                   <LatestArticle article={latestArticle} />
//                 </div>
//               )}
//               <SidebarArticles articles={sidebarArticles} />
//             </>
//           )}
//         </div>
//       </div>

//       <ArticleCarousel articles={filteredArticles} />
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>
      
    </div>
  )
}

export default page