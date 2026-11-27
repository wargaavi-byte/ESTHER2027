'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getFastOfEsther2027 } from '../utils/getFastTimes';
import { translations } from '../utils/translations';

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
      <div className="flex flex-wrap justify-end gap-2 mb-6">
        <button type="button" onClick={() => handleLanguageChange('en')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">English</button>
        <button type="button" onClick={() => handleLanguageChange('he')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">עברית</button>
        <button type="button" onClick={() => handleLanguageChange('yi')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">ייִדיש</button>
        <button type="button" onClick={() => handleLanguageChange('es')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Español</button>
        <button type="button" onClick={() => handleLanguageChange('fr')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Français</button>
        <button type="button" onClick={() => handleLanguageChange('ru')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Русский</button>
        <button type="button" onClick={() => handleLanguageChange('pt')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Português</button>
        <button type="button" onClick={() => handleLanguageChange('de')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Deutsch</button>
        <button type="button" onClick={() => handleLanguageChange('it')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Italiano</button>
        <button type="button" onClick={() => handleLanguageChange('ar')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">العربية</button>
        <button type="button" onClick={() => handleLanguageChange('fa')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">فارسی</button>
      </div>

      <header className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600 mb-6">{t.subtitle}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="text-4xl font-extrabold text-blue-900">
            {count.toLocaleString()} / 15,000,000
          </div>
          <div className="text-sm uppercase tracking-wide text-blue-700 mt-1">
            {t.counterLabel}
          </div>
        </div>
      </header>

      <section className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t.storyTitle}</h2>
        <p className="text-gray-700 leading-relaxed">{t.storyBody}</p>
      </section>

      {times && (
        <section className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
          <h2 className="font-semibold text-amber-900 mb-2">{t.fastTimesHeader}</h2>
          <div className="flex justify-around text-lg">
            <div><strong>{t.starts}:</strong> {times.fastStarts}</div>
            <div><strong>{t.ends}:</strong> {times.fastEnds}</div>
          </div>
        </section>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 bg-white p-6 border rounded-xl shadow-sm mb-12">
        <div>
          <label className="block font-medium mb-1">{t.nameLabel}</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">{t.countryLabel}</label>
          <input
            type="text"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">{t.durationLabel}</label>
          <select
            value={formData.fastDuration}
            onChange={(e) => setFormData({ ...formData, fastDuration: e.target.value })}
            className="w-full border p-2 rounded"
          >
            {t.durationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">{t.videoLabel}</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
        >
          {status.loading ? '...' : t.submitBtn}
        </button>

        {status.message && (
          <p className={`text-center font-medium ${status.error ? 'text-red-600' : 'text-green-600'}`}>
            {status.message}
          </p>
        )}
      </form>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-center mb-6">{t.galleryTitle}</h2>
        
        {recentVideos.length === 0 ? (
          <p className="text-center text-gray-500">{t.noVideos}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentVideos.map((item) => (
              <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <video
                  src={item.publicUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-48 object-cover bg-black"
                />
{item.full_name}
{item.country}
{item.fast_duration}
