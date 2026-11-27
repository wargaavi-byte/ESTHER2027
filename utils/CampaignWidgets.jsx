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
export function HiddenBlueprintCard() {
  return (
    <section className="max-w-2xl mx-auto bg-white/95 backdrop-blur border-t-4 border-purple-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-md text-left">
      <h2
        style={{ fontFamily: 'var(--font-cinzel), serif' }}
        className="text-2xl sm:text-3xl font-extrabold text-indigo-950 mb-4 text-center"
      >
        The Hidden Blueprint: Why the Story of Purim Still Matters
      </h2>

      <div className="space-y-4 text-gray-700 leading-relaxed text-base">
        <p>
          On the surface, the Book of Esther reads like a political thriller set in ancient Persia. There is a volatile king, a power-hungry advisor, a secret identity, and a dramatic last-minute rescue. Unlike the story of Passover—which features parting seas, plagues, and open miracles—the Book of Esther is famous for one striking omission: God’s name is never mentioned once.
        </p>
        <p>
          For many secular readers, that absence makes the story instantly relatable. It feels less like a distant myth and more like real history, where outcomes depend on human courage, timing, and strategy rather than divine intervention. Yet, according to Jewish wisdom, the complete absence of God’s name is the entire point of the story.
        </p>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-indigo-900 mb-1">
            1. The Power of What Is Hidden
          </h3>
          <p className="mb-3">
            The name &ldquo;Esther&rdquo; shares a Hebrew root with the word <em>hester</em>, meaning &ldquo;hidden.&rdquo; In the Torah, this points to a profound idea about how the world works: the most important forces shaping our lives are often operating behind the scenes.
          </p>
          <p>
            In life, we rarely see flashing neon signs telling us what to do or proving that everything will work out. Instead, we experience coincidences, unexpected turns, and moments where things quietly fall into place. Purim teaches that what looks like &ldquo;luck&rdquo; or random chance—a king having insomnia on the exact right night, an orphan rising to the throne just before a crisis—is actually a connected chain of events. The Torah perspective isn&apos;t asking you to wait for a miracle; it&apos;s inviting you to look closer at the hidden patterns in everyday reality.
          </p>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-indigo-900 mb-1">
            2. Stepping Up When No One Is Watching
          </h3>
          <p className="mb-3">
            Because there are no open miracles in the Purim story, human beings have to do the heavy lifting. When the Jewish people face annihilation, Esther doesn&apos;t sit back and pray for the sky to split open. She steps into the arena, risks her life by approaching the king uninvited, and uses sharp political intuition to outmaneuver her enemies.
          </p>
          <blockquote className="my-3 pl-4 border-l-4 border-amber-400 italic text-indigo-950 font-medium bg-amber-50/70 py-2 pr-3 rounded-r-lg">
            &ldquo;Who knows if it was for a moment just like this that you attained your royal position?&rdquo;
          </blockquote>
          <p>
            Her uncle, Mordechai, delivers that defining line of the entire story. For a secular audience, this is a timeless call to personal responsibility. You don&apos;t need to be religious to recognize that your unique skills, platform, or privileges were given to you for a reason. When a crisis hits, the Torah&apos;s message is clear: you are the miracle you&apos;ve been waiting for.
          </p>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-indigo-900 mb-1">
            3. Embracing Complexity Over Perfection
          </h3>
          <p className="mb-3">
            Traditional heroes are often flawless, almost untouchable figures. Esther and Mordechai are anything but. Esther hides her Jewish identity to survive in a toxic royal court; Mordechai refuses to bow to a tyrant, sparking a massive crisis that puts his entire community in danger. They operate in the messy, morally gray realities of politics and assimilation.
          </p>
          <p>
            Purim celebrates the fact that you don&apos;t have to be a saint—or live a perfectly traditional life—to play a vital role in Jewish history. Even when your identity feels complicated, hidden, or disconnected from tradition, your actions still carry immense weight.
          </p>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-indigo-900 mb-1">
            4. Turning Anxiety into Celebration
          </h3>
          <p className="mb-3">
            Purim isn&apos;t a solemn day of fasting and regret; it’s a loud, joyful celebration marked by costumes, feasts, and giving to others. The masks we wear on Purim mirror the central theme of the story: things are rarely what they seem on the outside. Beneath the surface of chaos, fear, and assimilation lies resilience, connection, and purpose.
          </p>
          <p className="font-medium text-indigo-950">
            Ultimately, the Torah&apos;s message of Purim is deeply empowering: even when the universe feels silent, your choices matter, your timing is never an accident, and you have the power to flip the script.
          </p>
        </div>
      </div>
    </section>
  );
}
