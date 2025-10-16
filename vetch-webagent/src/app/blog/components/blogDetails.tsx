import React from 'react';
import { Article } from '../interface/Article';
import DOMPurify from "isomorphic-dompurify";


type Props = { article: Article };

const ArticleDetails: React.FC<Props> = ({ article }) => {
  const d = new Date(article.date);
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
    <div className="bg-white dark:bg-black p-5 rounded-xl border-[6px] md:max-w-[60vw] border-teal-400 md:col-span-2">
      <div className="relative rounded-lg max-h-[50vh] overflow-hidden">
        <img
          src={article.picture}
          alt={article.title}
          className="w-full object-cover mx-auto"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
          <p className="text-lg font-light">{time} | {date}</p>
          <h1 className="text-xl md:text-3xl font-bold mt-1">{article.title}</h1>
        </div>
      </div>

      <div
        className="tiptap prose prose-neutral dark:prose-invert max-w-none mt-4 text-black dark:text-white"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.context, {
            ADD_ATTR: ["data-type", "data-checked", "data-indent"], // for task lists
            ADD_TAGS: ["input", "label"], // if DOMPurify strips these
          }),
        }}
      />
      
    </div>
  );
};

export default ArticleDetails;