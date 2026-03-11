'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { INDIAN_STATES } from '@/constants/states';
import { STATE_DISTRICTS } from '@/constants/districts';

const MapWithNoSSR = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-2xl shadow-lg">Loading Map...</div>
});

export default function MapPage() {
    const [sites, setSites] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const states = INDIAN_STATES;
    const districts = selectedState && STATE_DISTRICTS[selectedState] ? STATE_DISTRICTS[selectedState] : [];

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/heritage-sites')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setSites(data);
                } else {
                    setSites([
                        { _id: '1', name: 'Taj Mahal', state: 'Uttar Pradesh', district: 'Agra', category: 'Monument', description: 'Ivory-white marble mausoleum on the right bank of the river Yamuna.' },
                        { _id: '2', name: 'Red Fort', state: 'Delhi', district: 'Central Delhi', category: 'Fortress', description: 'Historic fort in the city of Delhi in India.' },
                        { _id: '3', name: 'Ajanta Caves', state: 'Maharashtra', district: 'Aurangabad', category: 'Caves', description: 'Rock-cut Buddhist cave monuments.' },
                        { _id: '4', name: 'Hampi', state: 'Karnataka', district: 'Vijayanagara', category: 'Ancient Ruins', description: 'UNESCO World Heritage Site with ancient ruins.' },
                        { _id: '5', name: 'Golden Temple', state: 'Punjab', district: 'Amritsar', category: 'Monument', description: 'Gurdwara located in the city of Amritsar.' },
                    ]);
                }
            })
            .catch(console.error);
    }, []);

    const filteredSites = sites.filter(site => {
        let match = true;
        if (selectedState && site.state !== selectedState) match = false;
        if (selectedDistrict && site.district !== selectedDistrict) match = false;
        return match;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-160px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">Interactive Map</h1>
                    <p className="text-gray-600 mt-1">Explore heritage sites and artisans across India.</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:border-[var(--color-primary)]"
                    >
                        <option value="">All States</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:border-[var(--color-primary)]"
                        disabled={!selectedState}
                    >
                        <option value="">All Districts</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex-grow rounded-2xl relative overflow-hidden">
                <MapWithNoSSR sites={filteredSites} selectedState={selectedState} selectedDistrict={selectedDistrict} />
            </div>
        </div>
    );
}
