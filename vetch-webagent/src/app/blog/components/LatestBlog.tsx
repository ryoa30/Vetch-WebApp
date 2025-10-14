// /blog/components/LatestArticle.tsx
import Link from 'next/link';
import { Article } from '../interface/Article';
import { formatDateArticle } from '../interface/formatDateArticle';

interface Props {
  article: Article;
}

const LatestArticle: React.FC<Props> = ({ article }) => (
  <div className="md:basis-[55%] w-full">
    <div className="bg-white dark:bg-black p-5 rounded-xl border-[6px] border-teal-400">
      <h2 className="text-xl font-bold mb-4">Terkini</h2>
      <div className="rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={article.imageSrc}
            alt={article.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
            <p className="text-base md:text-lg font-normal">
              {formatDateArticle(article.createdAt)}
            </p>
            <h3 className="text-xl text-black dark:text-white md:text-3xl font-bold mt-1">
              {article.title}
            </h3>
          </div>
        </div>

        <p className="text-base mt-4 text-black dark:text-white line-clamp-3 text-justify">
          {article.summary}
        </p>

        <Link
          href={`/blog/${article.slug}`}
          className="inline-block mt-4 bg-teal-700 text-white dark:text-black px-4 py-2 rounded hover:bg-teal-600"
        >
          Baca Selengkapnya
        </Link>
      </div>
    </div>
  </div>
);

export default LatestArticle;
