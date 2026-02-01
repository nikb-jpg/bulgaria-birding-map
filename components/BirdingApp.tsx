'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

// --- Custom Icon Setup ---
const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
        className: 'custom-pin',
        html: `<div style="
            background-color: ${isSelected ? '#e67e22' : '#2c3e50'};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                width: 8px;
                height: 8px;
                background-color: white;
                border-radius: 50%;
                transform: rotate(45deg);
            "></div>
        </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -38],
    });
};

interface Location {
    id: number;
    name: string;
    coords: LatLngExpression;
    region: string;
    bestTime: string;
    species: string;
    img: string;
    description: string;
    proTip: string;
}

const locations: Location[] = [
    {
        id: 1,
        name: "Madzharovo Vulture Center",
        coords: [41.6446, 25.8633],
        region: "Eastern Rhodopes",
        bestTime: "Early Morning (06:00 - 09:00)",
        species: "Griffon Vulture, Egyptian Vulture, Black Stork",
        img: "https://images.unsplash.com/photo-1611641613359-f698d549d922?auto=format&fit=crop&q=80&w=600",
        description: "The crater of an ancient volcano, this is the best place in the Balkans to observe Griffon Vultures. The vertical cliffs provide perfect nesting sites.",
        proTip: "Visit the BSPB center first. The best photography spots are the cliffs directly opposite the center across the Arda river."
    },
    {
        id: 2,
        name: "Studen Kladenets Reserve",
        coords: [41.6144, 25.5333],
        region: "Eastern Rhodopes",
        bestTime: "Late Afternoon",
        species: "Black Vulture, Golden Eagle, Fallow Deer",
        img: "https://images.unsplash.com/photo-1534149043227-d4677db02756?auto=format&fit=crop&q=80&w=600",
        description: "A wild, rugged landscape known for its Wolf and Vulture hides. The topography here is dramatic, with steep slopes plunging into the reservoir.",
        proTip: "Book the official 'Vulture Hide' well in advance. It offers eye-level shots of feeding raptors."
    },
    {
        id: 3,
        name: "Poda Nature Conservation Center",
        coords: [42.4411, 27.4650],
        region: "Burgas Coast",
        bestTime: "Sunrise / Sunset",
        species: "Spoonbill, Glossy Ibis, Pygmy Cormorant",
        img: "https://images.unsplash.com/photo-1552739130-9b6574a62e3d?auto=format&fit=crop&q=80&w=600",
        description: "A wetland hotspot with the highest bird density in Bulgaria. The mix of salt, brackish, and fresh water attracts diverse flocks.",
        proTip: "The roof terrace of the center offers a great vantage point, but the lower hides are better for intimate water-level reflections."
    },
    {
        id: 4,
        name: "Atanasovsko Lake (Saltpans)",
        coords: [42.5367, 27.4917],
        region: "Burgas Coast",
        bestTime: "Noon (High Contrast) or Sunset",
        species: "Greater Flamingo, Avocet, Shelduck",
        img: "https://images.unsplash.com/photo-1517036044911-ec65459b959c?auto=format&fit=crop&q=80&w=600",
        description: "Famous for its pink waters caused by brine shrimp—the favorite food of the thousands of flamingos that reside here year-round.",
        proTip: "Park at the 'Salt Museum' entrance. Walk along the dikes. The red water creates surreal, alien-looking backgrounds for photos."
    }
];

// Component to handle smooth map flying
function MapController({ coords }: { coords: LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(coords, 13, {
            duration: 1.5,
            easeLinearity: 0.25
        });
        // On mobile, invalidate size to ensure map renders correctly after resize
        map.invalidateSize();
    }, [coords, map]);
    return null;
}

export default function BirdingApp() {
    const [activeLoc, setActiveLoc] = useState<Location>(locations[0]);
    // State to toggle list view on mobile
    const [isMobileListOpen, setIsMobileListOpen] = useState(false);

    // Close mobile list when a location is selected
    const handleLocationClick = (loc: Location) => {
        setActiveLoc(loc);
        setIsMobileListOpen(false); // Collapse the list to show the map
    };

    return (
        <div className="app-container">
            
            {/* Sidebar / Bottom Sheet */}
            <div className={`sidebar ${isMobileListOpen ? 'mobile-open' : ''}`}>
                
                {/* Header */}
                <div className="header">
                    <div>
                        <div className="subtitle">Expedition Guide</div>
                        <h1 className="title">Bulgaria Wildlife</h1>
                    </div>
                    {/* YouTube Link Button */}
                    <a 
                        href="https://www.youtube.com/watch?v=YxdfQ2NSoTE" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="video-link"
                        title="Watch Lukas Zeman's Guide"
                    >
                        ▶ Watch Video
                    </a>
                </div>

                {/* Location List */}
                <div className="location-list">
                    {locations.map(loc => {
                        const isActive = activeLoc.id === loc.id;
                        return (
                            <div 
                                key={loc.id} 
                                onClick={() => handleLocationClick(loc)}
                                className={`location-card ${isActive ? 'active' : ''}`}
                            >
                                <div className="card-header">
                                    <h3>{loc.name}</h3>
                                    {isActive && <div className="active-dot"></div>}
                                </div>
                                <div className="card-meta">
                                    <span className="region-tag">{loc.region}</span>
                                </div>
                                
                                {isActive && (
                                    <div className="card-details">
                                        <div 
                                            className="location-image"
                                            style={{ backgroundImage: `url(${loc.img})` }}
                                        ></div>
                                        
                                        <p className="description">{loc.description}</p>
                                        
                                        <div className="pro-tip">
                                            <strong>🎯 Pro Tip</strong>
                                            {loc.proTip}
                                        </div>

                                        <div className="species-tags">
                                            {loc.species.split(',').map((bird, i) => (
                                                <a 
                                                    key={i} 
                                                    href={`https://www.google.com/search?q=${encodeURIComponent(bird.trim())} bird`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bird-tag"
                                                    title={`Search for ${bird.trim()} on Google`}
                                                >
                                                    🔍 {bird.trim()}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Mobile Toggle Button (Visible only on mobile) */}
                <button 
                    className="mobile-toggle"
                    onClick={() => setIsMobileListOpen(!isMobileListOpen)}
                >
                    {isMobileListOpen ? 'Show Map 🗺️' : 'Show Locations 📍'}
                </button>
            </div>

            {/* Map Display */}
            <div className="map-wrapper">
                <MapContainer center={activeLoc.coords} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer 
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                        attribution='&copy; OpenStreetMap'
                    />
                    {locations.map(loc => (
                        <Marker 
                            key={loc.id} 
                            position={loc.coords} 
                            icon={createCustomIcon(activeLoc.id === loc.id)}
                            eventHandlers={{ click: () => handleLocationClick(loc) }}
                        >
                            <Popup className="custom-popup"><b>{loc.name}</b></Popup>
                        </Marker>
                    ))}
                    <MapController coords={activeLoc.coords} />
                </MapContainer>
            </div>

            {/* CSS Styling */}
            <style jsx global>{`
                /* Container Layout */
                .app-container {
                    display: flex;
                    height: 100vh;
                    width: 100vw;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    overflow: hidden;
                }

                /* Sidebar (Desktop) */
                .sidebar {
                    width: 400px;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .header {
                    padding: 30px;
                    background-color: #1a2621;
                    color: #ecf0f1;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .subtitle {
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.75rem;
                    color: #27ae60;
                    font-weight: bold;
                }

                .title {
                    margin: 10px 0 0 0;
                    font-size: 1.8rem;
                    font-weight: 300;
                }

                .video-link {
                    background: rgba(255,255,255,0.1);
                    color: #ecf0f1;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    text-decoration: none;
                    transition: background 0.3s;
                    white-space: nowrap;
                }
                .video-link:hover { background: rgba(255,255,255,0.2); }

                .location-list {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 20px;
                    padding-bottom: 80px; /* Space for mobile button */
                }

                /* Location Card */
                .location-card {
                    padding: 20px;
                    margin-bottom: 15px;
                    border-radius: 12px;
                    cursor: pointer;
                    border: 1px solid #eee;
                    transition: all 0.3s ease;
                }
                .location-card.active {
                    background-color: #fff;
                    border-color: #27ae60;
                    box-shadow: 0 10px 25px rgba(39, 174, 96, 0.15);
                    transform: scale(1.02);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .card-header h3 { margin: 0; font-size: 1.1rem; color: #2c3e50; }
                .active-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #27ae60; }

                .region-tag {
                    background-color: #f0f3f4;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    color: #7f8c8d;
                }

                .card-details { animation: fadeIn 0.5s ease; margin-top: 15px; }

                .location-image {
                    width: 100%;
                    height: 180px;
                    background-size: cover;
                    background-position: center;
                    border-radius: 8px;
                    margin-bottom: 15px;
                }

                .description { font-size: 0.9rem; line-height: 1.6; color: #34495e; margin-bottom: 15px; }

                .pro-tip {
                    font-size: 0.85rem;
                    background-color: #e8f6f3;
                    padding: 12px;
                    border-radius: 8px;
                    border-left: 4px solid #27ae60;
                    margin-bottom: 15px;
                }
                .pro-tip strong { color: #16a085; display: block; margin-bottom: 4px; }

                .species-tags { display: flex; gap: 10px; flex-wrap: wrap; }
                
                .bird-tag {
                    font-size: 0.75rem;
                    border: 1px solid #27ae60;
                    padding: 4px 12px;
                    border-radius: 20px;
                    color: #27ae60;
                    text-decoration: none;
                    background-color: rgba(39, 174, 96, 0.05);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 500;
                }
                .bird-tag:hover {
                    background-color: #27ae60;
                    color: white;
                }

                /* Map Wrapper */
                .map-wrapper {
                    flex-grow: 1;
                    height: 100%;
                    width: 100%;
                }

                /* Mobile Toggle Button - Hidden on Desktop */
                .mobile-toggle { display: none; }

                /* --- MOBILE RESPONSIVE STYLES --- */
                @media (max-width: 768px) {
                    .app-container {
                        flex-direction: column-reverse; /* Map on top (visually), List on bottom */
                    }

                    .sidebar {
                        width: 100%;
                        height: 45%; /* Sidebar takes bottom 45% */
                        position: relative; /* Not fixed, part of flex layout */
                        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
                        z-index: 2000;
                        transition: height 0.3s ease;
                    }

                    .sidebar.mobile-open {
                        height: 85%; /* Expand to cover most of map */
                    }

                    .map-wrapper {
                        height: 55%; /* Map takes top 55% */
                        width: 100%;
                    }

                    .header {
                        padding: 15px 20px; /* Smaller padding on mobile */
                    }
                    .title { font-size: 1.4rem; }

                    .location-list {
                        padding: 15px;
                    }
                    
                    /* Mobile Toggle Button */
                    .mobile-toggle {
                        display: block;
                        position: absolute;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #2c3e50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 25px;
                        font-weight: bold;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                        z-index: 3000;
                        cursor: pointer;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
