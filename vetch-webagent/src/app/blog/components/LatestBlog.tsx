// /blog/components/LatestArticle.tsx
import Link from 'next/link';
import { Article } from '../interface/Article';
import DOMPurify from "isomorphic-dompurify";
import { formatDateArticle } from '../interface/formatDateArticle';

interface Props {
  article: Article;
  setSelectedArticle: (article: Article) => void;
}

const LatestArticle: React.FC<Props> = ({ article, setSelectedArticle }) => (
  <div className="md:basis-[55%] w-full">
    <div className="bg-white dark:bg-black p-5 rounded-xl border-[6px] border-teal-400">
      <h2 className="text-xl font-bold mb-4">Most Recent</h2>
      <div className="rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={article.picture}
            alt={article.title}
            className="w-full h-auto max-h-[500px] object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
            <p className="text-base md:text-lg font-normal">
              {formatDateArticle(article.date)}
            </p>
            <h3 className="text-xl text-white md:text-3xl font-bold mt-1">
              {article.title}
            </h3>
          </div>
        </div>

        <div className="text-base mt-4 text-black dark:text-white line-clamp-3 text-justify" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.context) }}>
        </div>

        <button
          onClick={() => setSelectedArticle(article)}
          className="inline-block mt-4 bg-teal-700 text-white dark:text-black px-4 py-2 rounded hover:bg-teal-600"
        >
          Read More
        </button>
      </div>
    </div>
  </div>
);

export default LatestArticle;
