"use client";

import DOMPurify from "isomorphic-dompurify";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Article } from "../interface/Article";
import { formatDateArticle } from "../interface/formatDateArticle";

interface Props {
  articles: Article[]; 
  setSelectedArticle: (article: Article) => void;
}

const ArticleCarousel: React.FC<Props> = ({ articles, setSelectedArticle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollAmount, setScrollAmount] = useState(280);

  useEffect(() => {
    const updateScrollAmount = () => {
      if (scrollRef.current) {
        const firstCard = scrollRef.current.querySelector(".article-card") as HTMLElement;
        if (firstCard) {
          setScrollAmount(firstCard.offsetWidth + 24);
        }
      }
    };

    updateScrollAmount();
    window.addEventListener("resize", updateScrollAmount);
    return () => window.removeEventListener("resize", updateScrollAmount);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#B3D8A8] dark:bg-[#357C72] relative mt-5 w-full overflow-hidden z-20">
      <div className="w-screen bg-teal-400 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="relative mx-auto p-5 rounded-xl max-w-[100%] md:max-w-[90%]">
          <h2 className="text-2xl font-bold my-2 ml-7 md:ml-0">Recommendation for You</h2>
          <div className="relative mx-auto">
            {/* Container dengan padding untuk panah pada mobile */}
            <div className="px-12 md:px-0">
              <div ref={scrollRef} className="overflow-hidden scroll-smooth scrollbar-hide">
                <div className="flex gap-6 py-4 w-max">
                  {articles.map((article) => (
                    <button
                      onClick={() => setSelectedArticle(article)}
                      key={article.id}
                      className="flex-shrink-0 article-card block cursor-pointer rounded-lg shadow border overflow-hidden w-[270px] md:w-[338px] bg-white hover:shadow-lg transition"
                    >
                      <img
                        src={article.picture}
                        alt={article.title}
                        className="w-full h-[200px] md:h-[220px] object-cover"
                      />
                      <div className="p-4">
                        <span className="text-base text-teal-600 font-medium">{article.categoryName}</span>
                        <h4 className="text-lg font-semibold mt-1 line-clamp-2">{article.title}</h4>
                        <p className="text-sm font-normal mt-1">{formatDateArticle(article.date)}</p>
                        <div className="text-base text-gray-500 mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.context) }}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panah kiri - sekarang berada di luar scroll area */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 md:left-[-28px] top-1/2 transform -translate-y-1/2 
              w-12 h-12 md:w-14 md:h-20 text-white z-30
              rounded-l-full flex items-center justify-center
              md:-translate-x-1/2"
            >
              <img src="/img/left-arrow.png" alt="Kiri" />
            </button>

            {/* Panah kanan - sekarang berada di luar scroll area */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 md:right-[-55px] top-1/2 transform -translate-y-1/2 
              w-12 h-12 md:w-14 md:h-20  text-white z-30
              rounded-r-full flex items-center justify-center 
              md:translate-x-0"
            >
              <img src="/img/right-arrow.png" alt="Kanan" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCarousel;