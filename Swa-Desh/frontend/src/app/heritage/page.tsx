'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeritageSite {
    _id: string;
    name: string;
    state: string;
    district: string;
    category: string;
    annualVisitors: number;
    views: number;
    description: string;
    image: string;
}

export default function HeritageSites() {
    const [sites, setSites] = useState<HeritageSite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In dev, fetch from localhost, if no db data provide mock data
        fetch('http://127.0.0.1:5000/api/heritage-sites')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setSites(data);
                } else {
                    // Mock data if DB is empty
                    setSites([
                        { _id: '1', name: 'Taj Mahal', state: 'Uttar Pradesh', district: 'Agra', category: 'Monument', annualVisitors: 7000000, views: 150000, description: 'Ivory-white marble mausoleum on the right bank of the river Yamuna.', image: '' },
                        { _id: '2', name: 'Red Fort', state: 'Delhi', district: 'Central Delhi', category: 'Fortress', annualVisitors: 3000000, views: 80000, description: 'Historic fort in the city of Delhi in India.', image: '' },
                        { _id: '3', name: 'Ajanta Caves', state: 'Maharashtra', district: 'Aurangabad', category: 'Caves', annualVisitors: 1500000, views: 40000, description: 'Rock-cut Buddhist cave monuments.', image: '' },
                        { _id: '4', name: 'Hampi', state: 'Karnataka', district: 'Vijayanagara', category: 'Ancient Ruins', annualVisitors: 500000, views: 25000, description: 'UNESCO World Heritage Site with ancient ruins.', image: '' },
                    ]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">Heritage Sites</h1>
                    <p className="text-gray-600 mt-1">Track and manage heritage sites across India.</p>
                </div>
                <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[#556B2F] transition font-semibold">
                    + Add New Site
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image & Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : (
                                sites.map(site => (
                                    <tr key={site._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-xl">
                                                    🏛️
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{site.name}</div>
                                                    <div className="text-sm text-gray-500 max-w-[200px] truncate">{site.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{site.state}</div>
                                            <div className="text-sm text-gray-500">{site.district}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {site.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {site.annualVisitors.toLocaleString()} / yr
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/heritage/${site._id}`} className="text-[var(--color-primary)] hover:text-[#556B2F] mr-4">Edit</Link>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
