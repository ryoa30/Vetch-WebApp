import React from 'react';
import { Article } from '../interface/Article';

type Props = { article: Article };

const ArticleDetails: React.FC<Props> = ({ article }) => {
  const d = new Date(article.createdAt);
  const date = d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white p-5 rounded-xl border-[6px] border-teal-400 md:col-span-2">
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={article.imageSrc}
          alt={article.title}
          className="w-full max-h-[120vh] object-cover mx-auto"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
          <p className="text-lg font-light">{time} | {date}</p>
          <h1 className="text-xl md:text-3xl font-bold mt-1">{article.title}</h1>
        </div>
      </div>

      <p className="mt-4 text-black text-justify">{article.summary}</p>
    </div>
  );
};

export default ArticleDetails;