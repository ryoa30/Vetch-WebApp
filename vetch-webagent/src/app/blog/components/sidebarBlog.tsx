import Link from 'next/link';
import { Article } from '../interface/Article';
import { formatDateArticle } from '../interface/formatDateArticle';

interface Props {
    articles: Article[];
}

const SidebarArticles: React.FC<Props> = ({ articles }) => (
    <div className="hidden md:block md:basis-[45%] w-full md:ml-3">
        <div className="bg-[#B3D8A8] dark:bg-[#357C72] p-5 rounded-xl">
            <h2 className="text-xl font-bold text-black mb-4">Baca Juga</h2>
            <div className="flex flex-col gap-3">
                {articles.map((article) => (
                    <Link
                        href={`/blog/${article.slug}`}
                        key={article.id}
                        className="flex gap-3 items-start bg-white dark:bg-black hover:bg-gray-100 rounded-xl p-3 shadow-sm transition"
                    >
                        <img
                            src={article.imageSrc}
                            alt={article.title}
                            className="w-28 h-28 object-cover rounded-md"
                        />
                        <div>
                            <span className="text-base ttext-black dark:text-white font-medium">{article.category}</span>
                            <h4 className="text-xl text-black dark:text-white font-semibold mt-1 leading-snug">{article.title}</h4>
                            <p className="text-sm font-normal mt-1 text-black dark:text-white">{formatDateArticle(article.createdAt)}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
);

export default SidebarArticles;