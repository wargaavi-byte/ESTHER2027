'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getFastOfEsther2027 } from '../utils/getFastTimes';
import { translations } from '../utils/translations';
import { ManualCitySelector, SocialShareBar, HiddenBlueprintCard, ProudToBeJewishCard } from '../utils/CampaignWidgets';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FastOfEstherApp() {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

  const [count, setCount] = useState(0);
  const [recentVideos, setRecentVideos] = useState([]);
  const [times, setTimes] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    fastDuration: translations.en.durationOptions[0],
  });
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const fetchDashboardData = async () => {
    const { count: totalRows } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true });
    if (totalRows !== null) setCount(totalRows);

       const { data: videoRows } = await supabase
      .from('participants')
      .select('id, full_name, country, fast_duration, video_url')
      .eq('approved', true)
      .not('video_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(12);

    if (videoRows) {
      const videosWithUrls = videoRows.map((row) => {
        const { data } = supabase.storage.from('videos').getPublicUrl(row.video_url);
        return { ...row, publicUrl: data.publicUrl };
      });
      setRecentVideos(videosWithUrls);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const fastData = await getFastOfEsther2027(
          pos.coords.latitude,
          pos.coords.longitude,
          tz
        );
        setTimes(fastData);
      });
    }
  }, []);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setFormData((prev) => ({
      ...prev,
      fastDuration: translations[newLang].durationOptions[0],
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEl.src);
      if (videoEl.duration > 10.5) {
        setStatus({ loading: false, message: t.errorDuration, error: true });
        e.target.value = '';
        setVideoFile(null);
      } else {
        setStatus({ loading: false, message: '', error: false });
        setVideoFile(file);
      }
    };
    videoEl.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    let uploadedVideoUrl = null;

    if (videoFile) {
      const fileName = `${Date.now()}-${videoFile.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile);

      if (uploadError) {
        setStatus({ loading: false, message: uploadError.message, error: true });
        return;
      }
      uploadedVideoUrl = uploadData.path;
    }

    const { error: dbError } = await supabase.from('participants').insert([
      {
        full_name: formData.fullName,
        country: formData.country,
        fast_duration: formData.fastDuration,
        video_url: uploadedVideoUrl,
        language: lang,
      },
    ]);

    if (dbError) {
      setStatus({ loading: false, message: dbError.message, error: true });
    } else {
      setStatus({ loading: false, message: t.successMsg, error: false });
      setFormData({ fullName: '', country: '', fastDuration: t.durationOptions[0] });
      setVideoFile(null);
      fetchDashboardData();
    }
  };
  return (
    <main dir={t.dir} className="max-w-4xl mx-auto p-6 font-sans">
      {/* Colorful Language Switcher (highlights active language in royal indigo) */}
      <div className="flex flex-wrap justify-end gap-2 mb-8">
        {[
          ['en', 'English'],
          ['he', 'עברית'],
          ['yi', 'ייִדיש'],
          ['es', 'Español'],
          ['fr', 'Français'],
          ['ru', 'Русский'],
          ['pt', 'Português'],
          ['de', 'Deutsch'],
          ['it', 'Italiano'],
          ['ar', 'العربية'],
          ['fa', 'فارسی'],
        ].map(([code, label]) => (
          <button
            key={code}
            type="button"
            onClick={() => handleLanguageChange(code)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition shadow-sm ${
              lang === code
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                : 'bg-white/90 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

           {/* Royal Hero Banner */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white p-8 sm:p-12 mb-10 shadow-2xl border border-amber-400/30 text-center">
        {/* Subtle Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Date & Hebrew Date Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-sm">
            <span>✨ March 22, 2027</span>
            <span>•</span>
            <span>13 Adar II 5787</span>
          </div>

          {/* Main Title — Classic Engraved Roman/Royal Serif */}
          <h1
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
            className="text-4xl sm:text-6xl font-black tracking-wider mb-4 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm"
          >
            {t.title}
          </h1>

          {/* Decorative Gold Divider */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/70" />
            <span className="text-amber-300 text-sm">✦</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/70" />
          </div>

          {/* Subtitle — Editorial Literary Serif */}
          <p
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
            className="text-indigo-100 text-xl sm:text-2xl leading-relaxed mb-8 font-medium"
          >
            {t.subtitle}
          </p>

          {/* Live 15-Million Counter & Progress Bar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-inner">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-amber-300">
              {count.toLocaleString()}
              <span className="text-xl sm:text-2xl font-bold text-indigo-200"> / 15,000,000</span>
            </div>
            <div className="text-xs sm:text-sm uppercase tracking-widest text-indigo-200 mt-2 font-semibold">
              {t.counterLabel}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-indigo-950/80 h-3 rounded-full mt-4 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(1.5, (count / 15000000) * 100))}%` }}
              />
            </div>
          </div>

          {/* Quick Jump Button to Registration Form */}
          <div className="mt-7">
            <a
              href="#pledge-form"
              className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-indigo-950 font-extrabold text-base sm:text-lg shadow-lg hover:brightness-105 transition transform hover:-translate-y-0.5"
            >
              {t.submitBtn} ↓
            </a>
          </div>
        </div>
      </header>


      {/* Warm Gold-Accented Dedication Card */}
      <section className="max-w-2xl mx-auto bg-white/90 backdrop-blur border-t-4 border-amber-400 rounded-2xl p-6 mb-8 shadow-md text-center">
        <h2 className="text-xl font-bold text-indigo-950 mb-2">{t.storyTitle}</h2>
        <p className="text-gray-700 leading-relaxed">{t.storyBody}</p>
      </section>

        {/* Sunrise-to-Sunset Fast Times Card + Manual City Selector */}
   <section className="max-w-2xl mx-auto bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border border-amber-300 rounded-2xl p-5 mb-8 text-center shadow-md">
     <h2 className="font-bold text-amber-950 mb-3 text-lg">
       {t.fastTimesHeader} {times?.locationName ? `(${times.locationName})` : ''}
     </h2>
     {times ? (
       <div className="flex flex-col sm:flex-row justify-around gap-3 text-lg">
         <div className="bg-white/80 px-4 py-2 rounded-xl shadow-sm text-amber-900">
           🌅 <strong>{t.starts}:</strong> {times.fastStarts}
         </div>
         <div className="bg-white/80 px-4 py-2 rounded-xl shadow-sm text-indigo-950">
           ✨ <strong>{t.ends}:</strong> {times.fastEnds}
         </div>
       </div>
     ) : (
       <p className="text-sm text-amber-900">Select your city below to view your March 22, 2027 fast times:</p>
     )}
     <ManualCitySelector onSelectTimes={setTimes} />
   </section>

     <HiddenBlueprintCard />

   <ProudToBeJewishCard />

      <SocialShareBar />

   {/* Social Share Bar */}
  
      {/* Styled Registration & Video Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 bg-white/95 p-7 border-t-4 border-indigo-600 rounded-2xl shadow-lg mb-14">
        <div>
          <label className="block font-semibold text-indigo-950 mb-1">{t.nameLabel}</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none p-2.5 rounded-xl transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-indigo-950 mb-1">{t.countryLabel}</label>
          <input
            type="text"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none p-2.5 rounded-xl transition"
          />
        </div>

        <div>
          <label className="block font-semibold text-indigo-950 mb-1">{t.durationLabel}</label>
          <select
            value={formData.fastDuration}
            onChange={(e) => setFormData({ ...formData, fastDuration: e.target.value })}
            className="w-full border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none p-2.5 rounded-xl bg-white transition"
          >
            {t.durationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-indigo-950 mb-1">{t.videoLabel}</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full border border-dashed border-indigo-300 bg-indigo-50/40 p-2.5 rounded-xl file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 text-white font-bold text-lg py-3.5 rounded-xl shadow-md hover:opacity-95 transition transform active:scale-[0.99]"
        >
          {status.loading ? '...' : t.submitBtn}
        </button>

        {status.message && (
          <p className={`text-center font-semibold p-2 rounded-lg ${status.error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
            {status.message}
          </p>
        )}
      </form>

      {/* Colorful Video Gallery */}
      <section className="mt-10">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-950">{t.galleryTitle}</h2>
        
        {recentVideos.length === 0 ? (
          <p className="text-center text-indigo-800/70 bg-white/70 p-6 rounded-2xl max-w-md mx-auto">{t.noVideos}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentVideos.map((item) => (
              <div key={item.id} className="bg-white border-b-4 border-purple-500 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <video
                  src={item.publicUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-48 object-cover bg-indigo-950"
                />
                <div className="p-4">
                  <div className="font-bold text-lg text-indigo-950">{item.full_name}</div>
                  <div className="text-sm font-medium text-purple-700">📍 {item.country}</div>
                  <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-900">
                    {item.fast_duration}
                  </span>
                  </div>
                </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
