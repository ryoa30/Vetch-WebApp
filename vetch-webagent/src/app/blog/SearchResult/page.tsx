// 'use client';

// import { useSearchParams, useRouter } from 'next/navigation';
// import { Article } from '../interface/Article';
// import { formatDateArticle } from '../interface/formatDateArticle';
// import { useMemo } from 'react';
// import SearchFilterBar from '../components/SearchBarBlog';
// import Link from 'next/link';
// import { slugify } from '../interface/Slugify';

// const rawArticles = [
//   {
//     id: 1,
//     title: "Pentingnya Nutrisi Seimbang untuk Hewan Peliharaan",
//     date: "Sep 25, 2025",
//     summary:
//       "Pelajari cara memilih makanan yang tepat untuk hewan peliharaan agar tetap sehat, aktif, dan berumur panjang.",
//     category: "Nutrition",
//     imageSrc: "/img/blog/nutrition/nutrition1.jpg",
//     createdAt: "2025-09-25T09:00:00"
//   },
//   {
//     id: 2,
//     title: "Mengenali Penyakit Umum pada Hewan Peliharaan",
//     date: "Sep 26, 2025",
//     summary:
//       "Kenali tanda-tanda awal penyakit pada hewan kesayangan dan kapan harus membawa mereka ke dokter hewan.",
//     category: "Disease",
//     imageSrc: "/img/blog/disease/disease1.jpg",
//     createdAt: "2025-09-25T09:00:00"
//   },
//   {
//     id: 3,
//     title: "Rutinitas Perawatan Harian untuk Hewan Peliharaan",
//     date: "Sep 27, 2025",
//     summary:
//       "Panduan sederhana menjaga kebersihan, kesehatan, dan kebahagiaan hewan peliharaan melalui rutinitas harian.",
//     category: "Daily Care",
//     imageSrc: "/img/blog/dailycare/dailycare1.jpg",
//     createdAt: "2025-09-25T09:00:00"
//   },
// ];

// export const articles: Article[] = rawArticles.map(a => ({
//     ...a,
//     slug: slugify(a.title),
// }));

// const SearchResultPage = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const query = searchParams.get('query')?.toLowerCase() || '';

//     const matchedArticles: Article[] = useMemo(
//         () =>
//             articles.filter((article) =>
//                 article.title.toLowerCase().includes(query)
//             ),
//         [query]
//     );

//     const allCategories = useMemo(() => {
//         const unique = new Set(articles.map((a) => a.category));
//         return Array.from(unique);
//     }, []);

//     return (
//     <>
//         <div className="font-sans">
//             {/* SearchFilterBar ditambahkan di sini */}
//             <SearchFilterBar
//                 categories={allCategories}
//                 selectedCategory=""
//                 onSelectCategory={(category) =>
//                     router.push(`/blog?category=${encodeURIComponent(category)}`)
//                 }
//                 articles={articles}
//                 showCategories={false}
//             />

//             <div className="px-6 md:px-16 py-10">
//                 <h2 className="text-2xl font-bold mb-6">
//                     Hasil Pencarian: <span className="text-teal-600">{query}</span>
//                 </h2>

//                 {matchedArticles.length === 0 ? (
//                     <p>Tidak ada artikel ditemukan.</p>
//                 ) : (
//                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                         {matchedArticles.map((article) => (
//                             <div
//                                 key={article.id}
//                                 className="rounded-lg shadow border overflow-hidden bg-white hover:shadow-lg transition"
//                             >
//                                 <img
//                                     src={article.imageSrc}
//                                     alt={article.title}
//                                     className="w-full h-[200px] object-cover"
//                                 />
//                                 <div className="p-4">
//                                     <span className="text-base text-teal-600 font-medium">
//                                         {article.category}
//                                     </span>
//                                     <h4 className="text-lg font-semibold mt-1">{article.title}</h4>
//                                     <p className="text-sm font-normal mt-1">
//                                         {formatDateArticle(article.createdAt)}
//                                     </p>
//                                     <p className="text-base text-gray-500 mt-2 line-clamp-3">{article.summary}</p>
//                                     <Link href={`/blog/${article.slug}`} className="inline-block mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
//                                         Baca Selengkapnya
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     </>
//     );
// };

// export default SearchResultPage;
import React from 'react'

const page = () => {
  return (
    <div>
      
    </div>
  )
}

export default page
