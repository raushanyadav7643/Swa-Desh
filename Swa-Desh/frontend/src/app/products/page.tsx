'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { INDIAN_STATES } from '@/constants/states';
import { STATE_DISTRICTS } from '@/constants/districts';

export default function ProductsCatalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [stateFilter, setStateFilter] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');
    const [craftFilter, setCraftFilter] = useState('');

    const districts = stateFilter && STATE_DISTRICTS[stateFilter] ? STATE_DISTRICTS[stateFilter] : [];

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/products')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    // Dummy data
                    setProducts([
                        { _id: '1', name: 'Royal Blue Paithani Saree', price: 12000, artisan: { name: 'Sunita Devi' }, state: 'Maharashtra', district: 'Aurangabad', craft: 'Embroidery', stock: 5, image: 'https://via.placeholder.com/300x200?text=Paithani+Saree' },
                        { _id: '2', name: 'Rajasthani Blue Pottery Vase', price: 2500, artisan: { name: 'Ramesh Kumhar' }, state: 'Rajasthan', district: 'Jaipur', craft: 'Pottery', stock: 12, image: 'https://via.placeholder.com/300x200?text=Pottery+Vase' },
                        { _id: '3', name: 'Hand Carved Teakwood Box', price: 3400, artisan: { name: 'Abdul Ansari' }, state: 'Uttar Pradesh', district: 'Saharanpur', craft: 'Wood Carving', stock: 8, image: 'https://via.placeholder.com/300x200?text=Teakwood+Box' },
                        { _id: '4', name: 'Silver Filigree Earrings', price: 1800, artisan: { name: 'Laxmi Narayan' }, state: 'Odisha', district: 'Cuttack', craft: 'Metalwork', stock: 20, image: 'https://via.placeholder.com/300x200?text=Filigree+Earrings' },
                        { _id: '5', name: 'Green Paithani Dupatta', price: 4500, artisan: { name: 'Sunita Devi' }, state: 'Maharashtra', district: 'Aurangabad', craft: 'Embroidery', stock: 3, image: 'https://via.placeholder.com/300x200?text=Green+Dupatta' },
                    ]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredProducts = products.filter(p => {
        if (stateFilter && p.state !== stateFilter) return false;
        if (districtFilter && p.district !== districtFilter) return false;
        if (craftFilter && p.craft !== craftFilter) return false;
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">Products Catalog</h1>
                    <p className="text-gray-600 mt-1">Discover traditional handicrafts directly from the artisans.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="w-full bg-white p-4 rounded-xl shadow mb-8 flex flex-wrap gap-4 items-center">
                <select
                    className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                    value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
                >
                    <option value="">All States</option>
                    {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
                <select
                    className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                    value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}
                    disabled={!stateFilter}
                >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
                <select
                    className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                    value={craftFilter} onChange={(e) => setCraftFilter(e.target.value)}
                >
                    <option value="">All Crafts</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Wood Carving">Wood Carving</option>
                    <option value="Metalwork">Metalwork</option>
                </select>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="text-xl p-8">Loading products...</div>
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform group">
                            <div className="relative h-48 w-full bg-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {product.stock < 5 && (
                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        Only {product.stock} left!
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={product.name}>{product.name}</h3>
                                    <span className="text-lg font-bold text-[var(--color-primary-dark)]">₹{product.price.toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-gray-500 mb-4 h-10">
                                    By <span className="font-semibold text-gray-700">{product.artisan?.name}</span> • {product.state}
                                    <div className="inline-block mt-1 px-2 py-[2px] bg-gray-100 rounded text-xs ml-2">{product.craft}</div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <Link href={`/products/${product._id}`} className="text-[var(--color-primary)] hover:underline font-semibold text-sm">
                                        View Details
                                    </Link>
                                    <button className="bg-[var(--color-accent)] text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold text-sm shadow">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
