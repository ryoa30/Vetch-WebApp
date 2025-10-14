'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '../interface/Article';

interface Props {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    articles: Article[];
    showCategories?: boolean;
}

const SearchFilterBar: React.FC<Props> = ({ categories, selectedCategory, onSelectCategory, articles, showCategories }) => {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (inputValue.trim() === '') {
            setSuggestions([]);
            return;
        }

        const matches = articles
            .filter((article) =>
                article.title.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((article) => article.title);

        setSuggestions(matches.slice(1, 5));
    }, [inputValue, articles]);

    const handleSearch = () => {
        if (!inputValue.trim()) return;
        router.push(`/blog/search-result?query=${encodeURIComponent(inputValue.trim())}`);
    };

    const handleSelectSuggestion = (title: string) => {
        setInputValue(title);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="bg-[#B3D8A8] dark:bg-[#357C72] px-6 md:px-16 pt-10 font-sans relative">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex w-full relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                                setShowSuggestions(false);
                            }
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        placeholder="Cari Pencarian"
                        className="w-[80%] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        className="px-4 py-2 w-[20%] bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
                        onClick={handleSearch}
                    >
                        Cari
                    </button>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-[80%] bg-white border border-gray-300 rounded shadow z-10">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-teal-100 cursor-pointer"
                                    onMouseDown={() => handleSelectSuggestion(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showCategories !== false && <div className="flex flex-wrap gap-2 justify-center mt-6">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => onSelectCategory(cat)}
                        className={`px-4 py-1 border rounded-full font-semibold transition ${selectedCategory === cat
                            ? 'bg-teal-500 text-white'
                            : 'border-teal-500 text-black hover:bg-teal-500 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>}
        </div>
    );
};

export default SearchFilterBar;