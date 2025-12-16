import Link from 'next/link';
import { Article } from '../interface/Article';
import { formatDateArticle } from '../interface/formatDateArticle';

interface Props {
    articles: Article[];
    setSelectedArticle: (article: Article) => void;
}

const SidebarArticles: React.FC<Props> = ({ articles, setSelectedArticle }) => (
    <div className="md:block md:basis-[45%] w-full md:ml-3">
        <div className="bg-[#B3D8A8] dark:bg-[#357C72] p-5 rounded-xl">
            <h2 className="text-xl font-bold text-black mb-4">Also Read</h2>
            <div className="flex flex-col gap-3">
                {articles.map((article) => (
                    <button
                        onClick={() => setSelectedArticle(article)}
                        key={article.id}
                        className="flex gap-3 items-start bg-white dark:bg-black hover:bg-gray-100 rounded-xl p-3 shadow-sm transition"
                    >
                        <img
                            src={article.picture}
                            alt={article.title}
                            className="hidden sm:block sm:w-28 sm:h-28 object-cover rounded-md"
                        />
                        <div className='flex flex-col items-start'>
                            <span className="text-sm md:text-base text-black dark:text-white font-medium">{article.categoryName}</span>
                            <h4 className="text-base md:text-xl text-black dark:text-white font-semibold mt-1 leading-snug text-justify">{article.title}</h4>
                            <p className="text-xs md:text-sm font-normal mt-1 text-black dark:text-white">{formatDateArticle(article.date)}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default SidebarArticles;