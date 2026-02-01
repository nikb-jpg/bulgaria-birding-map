'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

// --- Custom Icon Setup ---
// We use a custom SVG function to create distinct markers
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
            duration: 2, // Smooth 2-second flight
            easeLinearity: 0.25
        });
    }, [coords, map]);
    return null;
}

export default function BirdingApp() {
    const [activeLoc, setActiveLoc] = useState<Location>(locations[0]);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', overflow: 'hidden' }}>
            
            {/* Left Sidebar - Glassmorphism Style */}
            <div style={{ 
                width: '400px', 
                height: '100%', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)', 
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                
                {/* Header */}
                <div style={{ padding: '30px', backgroundColor: '#1a2621', color: '#ecf0f1' }}>
                    <div style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', color: '#27ae60', fontWeight: 'bold' }}>Expedition Guide</div>
                    <h1 style={{ margin: '10px 0 0 0', fontSize: '1.8rem', fontWeight: 300 }}>Bulgaria Wildlife</h1>
                </div>

                {/* Location List */}
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px' }}>
                    {locations.map(loc => {
                        const isActive = activeLoc.id === loc.id;
                        return (
                            <div 
                                key={loc.id} 
                                onClick={() => setActiveLoc(loc)}
                                style={{ 
                                    padding: '20px', 
                                    marginBottom: '15px', 
                                    borderRadius: '12px', 
                                    cursor: 'pointer',
                                    backgroundColor: isActive ? '#fff' : 'transparent',
                                    border: isActive ? '1px solid #27ae60' : '1px solid #eee',
                                    boxShadow: isActive ? '0 10px 25px rgba(39, 174, 96, 0.15)' : 'none',
                                    transition: 'all 0.3s ease',
                                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2c3e50' }}>{loc.name}</h3>
                                    {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27ae60' }}></div>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '12px' }}>
                                    <span style={{ backgroundColor: '#f0f3f4', padding: '4px 8px', borderRadius: '4px' }}>{loc.region}</span>
                                </div>
                                
                                {isActive && (
                                    <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                        <div style={{ 
                                            width: '100%', 
                                            height: '180px', 
                                            backgroundImage: `url(${loc.img})`, 
                                            backgroundSize: 'cover', 
                                            backgroundPosition: 'center',
                                            borderRadius: '8px',
                                            marginBottom: '15px'
                                        }}></div>
                                        
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#34495e', marginBottom: '15px' }}>
                                            {loc.description}
                                        </p>
                                        
                                        <div style={{ fontSize: '0.85rem', backgroundColor: '#e8f6f3', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #27ae60' }}>
                                            <strong style={{ color: '#16a085', display: 'block', marginBottom: '4px' }}>🎯 Pro Tip</strong>
                                            {loc.proTip}
                                        </div>

                                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {loc.species.split(',').map((bird, i) => (
                                                <a 
                                                    key={i} 
                                                    href={`https://www.google.com/search?q=${encodeURIComponent(bird.trim())} bird`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ 
                                                        fontSize: '0.75rem', 
                                                        border: '1px solid #27ae60', 
                                                        padding: '4px 12px', 
                                                        borderRadius: '20px', 
                                                        color: '#27ae60',
                                                        textDecoration: 'none',
                                                        backgroundColor: 'rgba(39, 174, 96, 0.05)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontWeight: 500
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#27ae60';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(39, 174, 96, 0.05)';
                                                        e.currentTarget.style.color = '#27ae60';
                                                    }}
                                                    title={`Search for ${bird.trim()} on Google`}
                                                >
                                                    <span style={{ fontSize: '0.9em' }}>🔍</span> {bird.trim()}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Footer */}
                <div style={{ padding: '20px', borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#95a5a6', textAlign: 'center' }}>
                    Interactive Field Map v2.0
                </div>
            </div>

            {/* Map Display */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <MapContainer center={activeLoc.coords} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    {/* Darker, more muted map tiles for contrast */}
                    <TileLayer 
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {locations.map(loc => (
                        <Marker 
                            key={loc.id} 
                            position={loc.coords} 
                            icon={createCustomIcon(activeLoc.id === loc.id)}
                            eventHandlers={{ click: () => setActiveLoc(loc) }}
                        >
                            <Popup className="custom-popup">
                                <b>{loc.name}</b>
                            </Popup>
                        </Marker>
                    ))}
                    <MapController coords={activeLoc.coords} />
                </MapContainer>
            </div>

            {/* Global Styles for Animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                }
            `}</style>
        </div>
    );
}