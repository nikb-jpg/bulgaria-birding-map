'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

// Fix for default marker icons in React-Leaflet
// We check for window existence to be safe, though this component should be client-only.
if (typeof window !== 'undefined') {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

interface Location {
    id: number;
    name: string;
    coords: LatLngExpression;
    time: string;
    species: string;
    img: string;
    tips: string;
}

const locations: Location[] = [
    {
        id: 1,
        name: "Madzharovo Vulture Hide",
        coords: [41.6339, 25.8647],
        time: "Dawn (5:00 AM)",
        species: "Griffon & Black Vultures",
        img: "https://images.unsplash.com/photo-1611641613359-f698d549d922?auto=format&fit=crop&q=80&w=400",
        tips: "Enter hide before dawn. Book via BSPB."
    },
    {
        id: 2,
        name: "Studen Kladenets",
        coords: [41.6212, 25.5947],
        time: "Daytime",
        species: "Golden Eagles",
        img: "https://images.unsplash.com/photo-1534149043227-d4677db02756?auto=format&fit=crop&q=80&w=400",
        tips: "Excellent for action shots at feeding tables."
    },
    {
        id: 3,
        name: "Poda Nature Reserve",
        coords: [42.4431, 27.4647],
        time: "Sunrise",
        species: "Spoonbills & Ibis",
        img: "https://images.unsplash.com/photo-1552739130-9b6574a62e3d?auto=format&fit=crop&q=80&w=400",
        tips: "Ground-level hides provide the best reflection shots."
    },
    {
        id: 4,
        name: "Burgas Saltpans",
        coords: [42.5278, 27.4851],
        time: "Mid-day",
        species: "Greater Flamingos",
        img: "https://images.unsplash.com/photo-1517036044911-ec65459b959c?auto=format&fit=crop&q=80&w=400",
        tips: "The pink water offers surreal high-contrast backgrounds."
    }
];

function RecenterMap({ coords }: { coords: LatLngExpression }) {
    const map = useMap();
    map.setView(coords, 12);
    return null;
}

export default function BirdingApp() {
    const [activeLoc, setActiveLoc] = useState<Location>(locations[0]);

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
            {/* Sidebar Guide */}
            <div style={{ width: '350px', overflowY: 'auto', padding: '20px', backgroundColor: '#f8f9fa', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                <h1 style={{ color: '#2d5a27' }}>Bulgaria Bird Photography</h1>
                <p>A specialized 48-hour guide for the Eastern Rhodopes and Coast.</p>
                <hr />
                {locations.map(loc => (
                    <div
                        key={loc.id}
                        onClick={() => setActiveLoc(loc)}
                        style={{
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: activeLoc.id === loc.id ? '#e8f5e9' : 'white',
                            border: activeLoc.id === loc.id ? '2px solid #2d5a27' : '1px solid #ddd'
                        }}
                    >
                        <h3 style={{ margin: '0 0 5px 0', color: 'black' }}>{loc.name}</h3>
                        <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}><b>Time:</b> {loc.time}</p>
                        {activeLoc.id === loc.id && (
                            <div style={{ marginTop: '10px' }}>
                                <img src={loc.img} alt={loc.species} style={{ width: '100%', borderRadius: '4px' }} />
                                <p style={{ fontSize: '0.85em', marginTop: '10px', color: 'black' }}><b>Species:</b> {loc.species}</p>
                                <p style={{ fontSize: '0.85em', color: 'black' }}><b>Pro Tip:</b> {loc.tips}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Map Display */}
            <div style={{ flexGrow: 1 }}>
                <MapContainer center={activeLoc.coords} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {locations.map(loc => (
                        <Marker key={loc.id} position={loc.coords} eventHandlers={{ click: () => setActiveLoc(loc) }}>
                            <Popup>{loc.name}</Popup>
                        </Marker>
                    ))}
                    <RecenterMap coords={activeLoc.coords} />
                </MapContainer>
            </div>
        </div>
    );
}
