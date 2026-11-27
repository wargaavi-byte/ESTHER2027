'use client';

import { useState } from 'react';
import { getFastOfEsther2027 } from './getFastTimes';

const MAJOR_CITIES = [
  { name: 'Jerusalem, Israel', lat: 31.7683, lng: 35.2137, tz: 'Asia/Jerusalem' },
  { name: 'Tel Aviv, Israel', lat: 32.0853, lng: 34.7818, tz: 'Asia/Jerusalem' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'Atlanta, USA', lat: 33.7490, lng: -84.3880, tz: 'America/New_York' },
  { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
  { name: 'Miami, USA', lat: 25.7617, lng: -80.1918, tz: 'America/New_York' },
  { name: 'Chicago, USA', lat: 41.8781, lng: -87.6298, tz: 'America/Chicago' },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris' },
  { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, tz: 'Europe/Berlin' },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, tz: 'Europe/Rome' },
  { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, tz: 'Europe/Madrid' },
  { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173, tz: 'Europe/Moscow' },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, tz: 'America/Argentina/Buenos_Aires' },
  { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo' },
  { name: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473, tz: 'Africa/Johannesburg' },
  { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, tz: 'Australia/Melbourne' },
];

export function ManualCitySelector({ onSelectTimes }) {
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityChange = async (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const city = MAJOR_CITIES.find((c) => c.name === cityName);
    if (city) {
      const fastData = await getFastOfEsther2027(city.lat, city.lng, city.tz);
      onSelectTimes({ ...fastData, locationName: city.name });
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-amber-300/60">
      <select
        value={selectedCity}
        onChange={handleCityChange}
        className="w-full sm:w-auto px-4 py-2 rounded-xl border border-amber-400 bg-white text-amber-950 text-sm font-medium shadow-sm outline-none"
      >
        <option value="">🌍 Or select a city manually...</option>
        {MAJOR_CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SocialShareBar() {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(
    'Join me and 15 million voices worldwide on March 22, 2027 for Her Name Was Esther — fasting, remembrance, and solidarity:'
  );

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/90 border border-indigo-200 rounded-2xl p-5 mb-8 shadow-sm text-center">
      <div className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-3">
        📣 Invite Others to Join the 15 Million
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <a
          href={`https://whatsapp.com{shareText}%20${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
        >
          WhatsApp
        </a>
        <a
          href={`https://facebook.com{encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com{shareText}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition shadow-sm"
        >
          X / Twitter
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 text-sm font-semibold hover:bg-indigo-200 transition"
        >
          {copied ? '✅ Link Copied!' : '🔗 Copy Link'}
        </button>
      </div>
    </div>
  );
}
