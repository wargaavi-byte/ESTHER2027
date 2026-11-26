// app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getFastOfEsther2027 } from '../utils/getFastTimes';

// Initialize Supabase (Replace with your free project keys)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Translation Dictionary (Add French, Russian, Portuguese, etc. here)
const translations = {
  en: {
    dir: 'ltr',
    title: 'Global Fast of Esther — March 22, 2027',
    subtitle: 'Join 15 million voices worldwide in unity and solidarity.',
    counterLabel: 'Videos & Pledges Recorded',
    fastTimesHeader: 'Your Local Fast Times (March 22, 2027)',
    starts: 'Fast Begins (Dawn)',
    ends: 'Fast Ends (Nightfall)',
    nameLabel: 'Full Name',
    countryLabel: 'Country of Residence',
    durationLabel: 'How Long Will You Fast?',
    durationOptions: ['Full Fast (Dawn to Nightfall)', 'Half Day', 'Until Noon', 'Custom / Medical Exemption'],
    videoLabel: 'Upload 10-Second Video (Max 10s)',
    submitBtn: 'Register & Upload Video',
    errorDuration: 'Video must be 10 seconds or shorter.',
    successMsg: 'Thank you! Your pledge and video have been counted.'
  },
  he: {
    dir: 'rtl',
    title: 'תענית אסתר העולמית — 22 במרץ 2027',
    subtitle: 'הצטרפו ל-15 מיליון קולות ברחבי העולם באחדות.',
    counterLabel: 'סרטונים והתחייבויות שנרשמו',
    fastTimesHeader: 'זמני הצום המקומיים שלך (י״ג באדר ב׳ תשפ״ז)',
    starts: 'תחילת הצום (עלות השחר)',
    ends: 'צאת הצום (צאת הכוכבים)',
    nameLabel: 'שם מלא',
    countryLabel: 'מדינת מגורים',
    durationLabel: 'משך הצום המתוכנן',
    durationOptions: ['צום מלא (מעלות השחר עד צאת הכוכבים)', 'חצי יום', 'עד חצות היום', 'מותאם אישית / פטור רפואי'],
    videoLabel: 'העלאת סרטון עד 10 שניות',
    submitBtn: 'הרשמה והעלאת סרטון',
    errorDuration: 'אורך הסרטון חייב להיות 10 שניות או פחות.',
    successMsg: 'תודה! ההשתתפות והסרטון שלך נוספו לספירה.'
  },
  es: {
    dir: 'ltr',
    title: 'Ayuno Global de Ester — 22 de Marzo de 2027',
    subtitle: 'Únete a 15 millones de voces en todo el mundo.',
    counterLabel: 'Videos y Registros Completados',
    fastTimesHeader: 'Tus Horarios Locales de Ayuno (22 de Marzo, 2027)',
    starts: 'Inicio del Ayuno (Alba)',
    ends: 'Fin del Ayuno (Anochecer)',
    nameLabel: 'Nombre Completo',
    countryLabel: 'País de Residencia',
    durationLabel: '¿Cuánto tiempo ayunarás?',
    durationOptions: ['Ayuno Completo (Alba a Anochecer)', 'Medio Día', 'Hasta el Mediodía', 'Personalizado / Exención Médica'],
    videoLabel: 'Subir Video de 10 Segundos (Máx. 10s)',
    submitBtn: 'Registrar y Subir Video',
    errorDuration: 'El video debe durar 10 segundos o menos.',
    successMsg: '¡Gracias! Tu registro y video han sido contados.'
  }
};

export default function FastOfEstherApp() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [count, setCount] = useState(0);
  const [times, setTimes] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    fastDuration: translations.en.durationOptions[0],
  });
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  // 1. Fetch Live Participant Count
  const fetchCount = async () => {
    const { count: totalRows } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true });
    if (totalRows !== null) setCount(totalRows);
  };

  // 2. Detect Browser Location & Fetch March 22, 2027 Fast Times
  useEffect(() => {
    fetchCount();

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

  // 3. Enforce Strict 10-Second Video Limit in Browser
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
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

  // 4. Submit Registration & Upload Video
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    let uploadedVideoUrl = null;

    // Upload video to Supabase Storage bucket named 'videos' (or swap with Cloudflare R2 / YouTube API)
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

    // Save registration details to database
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
      fetchCount(); // Update live counter immediately
    }
  };

  return (
    <main dir={t.dir} className="max-w-2xl mx-auto p-6 font-sans">
      {/* Language Switcher */}
      <div className="flex justify-end gap-2 mb-6">
        <button onClick={() => setLang('en')} className="px-3 py-1 border rounded">English</button>
        <button onClick={() => setLang('he')} className="px-3 py-1 border rounded">עברית</button>
        <button onClick={() => setLang('es')} className="px-3 py-1 border rounded">Español</button>
      </div>

      {/* Header & Live Counter */}
      <header className="text-center mb-8">
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

      {/* Worldwide Fast Times Display */}
      {times && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
          <h2 className="font-semibold text-amber-900 mb-2">{t.fastTimesHeader}</h2>
          <div className="flex justify-around text-lg">
            <div><strong>{t.starts}:</strong> {times.fastStarts}</div>
            <div><strong>{t.ends}:</strong> {times.fastEnds}</div>
          </div>
        </section>
      )}

      {/* Registration & Video Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-xl shadow-sm">
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
    </main>
  );
}
