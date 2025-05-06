'use client'

import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";
import { Module } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

export const SearchGlobal = () => {
    const { loading, error, makeRequest, data, clearData } = useApiRequest<Module[], string>();
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter()

    useEffect(() => {
        if (!query.trim()) {
            setShowResults(false);
            clearData(); 
            return;
        }
    
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                await makeRequest(() => apiClient.get(`/modules/search?name=${query}`));
                setShowResults(true);
            } catch (err) {
                setShowResults(false);
                console.error(err);
            }
        }, 500);
    }, [query]);
    


    return (
        <div className="relative w-full max-w-md">
            <form
                className="bg-gray-300 flex rounded-full gap-2 overflow-hidden px-3 py-2 items-center"
                onSubmit={(e) => e.preventDefault()}
            >
                <FaSearch size={20} />
                <input
                    className="bg-transparent focus:outline-none text-lg w-full"
                    type="text"
                    placeholder="Cari.."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.trim().length > 0) setShowResults(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => setShowResults(false), 100);
                    }}
                />
            </form>

            {showResults && !loading && data && query.trim().length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-md shadow-md z-50 max-h-64 overflow-auto">
                    {data.length > 0 ? (
                        <ul>
                            {data.map((item) => (
                                <button
                                    key={item.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                                    onClick={() => {
                                        clearData();
                                        setShowResults(false);
                                        router.push(`/module/${item.id}`);
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-2 text-gray-500">Tidak ada hasil ditemukan.</div>
                    )}
                </div>
            )}
        </div>
    );
};
