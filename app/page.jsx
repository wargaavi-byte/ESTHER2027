// app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getFastOfEsther2027 } from '../utils/getFastTimes';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const translations = {
  en: {
    dir: 'ltr',
    title: 'Her Name Was Esther',
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
    successMsg: 'Thank you! Your pledge and video have been counted.',
    galleryTitle: 'Recent Voices Around the World',
    noVideos: 'Be the first to share a 10-second video pledge!'
  },
  he: {
    dir: 'rtl',
    title: 'קראו לה אסתר',
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
    successMsg: 'תודה! ההשתתפות והסרטון שלך נוספו לספירה.',
    galleryTitle: 'קולות אחרונים מרחבי העולם',
    noVideos: 'היו הראשונים לשתף סרטון התחייבות של 10 שניות!'
  },
  es: {
    dir: 'ltr',
    title: 'Su Nombre Era Ester',
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
    successMsg: '¡Gracias! Tu registro y video han sido contados.',
    galleryTitle: 'Voces Recientes Alrededor del Mundo',
    noVideos: '¡Sé el primero en compartir un video de 10 segundos!'
  },
    fr: {
    dir: 'ltr',
    title: 'Elle S’appelait Esther',
    subtitle: 'Le 22 mars 2027, 15 millions de voix s’unissent dans le monde entier dans le jeûne, le souvenir et la solidarité.',
    counterLabel: 'Voix et Engagements Enregistrés',
    fastTimesHeader: 'Vos Horaires Locaux de Jeûne (22 Mars 2027)',
    starts: 'Début du Jeûne (Aube)',
    ends: 'Fin du Jeûne (Tombée de la nuit)',
    nameLabel: 'Nom Complet',
    countryLabel: 'Pays de Résidence',
    durationLabel: 'Combien de temps jeûnerez-vous ?',
    durationOptions: ['Jeûne Complet (Aube à la tombée de la nuit)', 'Demi-journée', 'Jusqu’à Midi', 'Personnalisé / Exemption Médicale'],
    videoLabel: 'Partager un Message Vidéo de 10 Secondes (Max 10s)',
    submitBtn: 'Ajouter Ma Voix et Ma Vidéo',
    errorDuration: 'La vidéo doit durer 10 secondes ou moins.',
    successMsg: 'Merci. Votre voix et votre vidéo ont été ajoutées aux 15 millions.',
    galleryTitle: 'Voix du Monde Entier',
    noVideos: 'Soyez le premier à partager un message vidéo de 10 secondes.'
  },
  ru: {
    dir: 'ltr',
    title: 'Её Звали Эстер',
    subtitle: '22 марта 2027 года 15 миллионов голосов по всему миру объединятся в посте, памяти и солидарности.',
    counterLabel: 'Записано Голосов и Обязательств',
    fastTimesHeader: 'Ваше Местное Время Поста (22 Марта 2027)',
    starts: 'Начало Поста (Рассвет)',
    ends: 'Окончание Поста (Выход звёзд)',
    nameLabel: 'Полное Имя',
    countryLabel: 'Страна Проживания',
    durationLabel: 'Как долго вы будете поститься?',
    durationOptions: ['Полный пост (от рассвета до выхода звёзд)', 'Полдня', 'До полудня', 'Индивидуально / По медицинским показаниям'],
    videoLabel: 'Загрузить 10-секундное видео (Макс. 10 сек)',
    submitBtn: 'Добавить Мой Голос и Видео',
    errorDuration: 'Длительность видео должна быть не более 10 секунд.',
    successMsg: 'Спасибо. Ваш голос и видео добавлены к 15 миллионам.',
    galleryTitle: 'Голоса со Всего Мира',
    noVideos: 'Станьте первым, кто поделится 10-секундным видеообращением.'
  },
  pt: {
    dir: 'ltr',
    title: 'O Nome Dela Era Ester',
    subtitle: 'Em 22 de março de 2027, 15 milhões de vozes se unem em todo o mundo em jejum, memória e solidariedade.',
    counterLabel: 'Vozes e Compromissos Registrados',
    fastTimesHeader: 'Seus Horários Locais de Jejum (22 de Março de 2027)',
    starts: 'Início do Jejum (Alvorada)',
    ends: 'Fim do Jejum (Anoitecer)',
    nameLabel: 'Nome Completo',
    countryLabel: 'País de Residência',
    durationLabel: 'Por quanto tempo você vai jejuar?',
    durationOptions: ['Jejum Completo (Alvorada ao Anoitecer)', 'Meio Dia', 'Até o Meio-Dia', 'Personalizado / Isenção Médica'],
    videoLabel: 'Compartilhar Vídeo de 10 Segundos (Máx. 10s)',
    submitBtn: 'Adicionar Minha Voz e Vídeo',
    errorDuration: 'O vídeo deve ter 10 segundos ou menos.',
    successMsg: 'Obrigado. Sua voz e seu vídeo foram somados aos 15 milhões.',
    galleryTitle: 'Vozes de Todo o Mundo',
    noVideos: 'Seja o primeiro a compartilhar uma mensagem em vídeo de 10 segundos.'
  },
  yi: {
    dir: 'rtl',
    title: 'איר נאָמען איז געווען אסתר',
    subtitle: 'דעם 22סטן מערץ 2027 (י״ג אדר ב׳ תשפ״ז), פֿאַראייניקן זיך 15 מיליאָן שטימען איבער דער גאָרער וועלט אין תּענית, זכּרון און סאָלידאַריטעט.',
    counterLabel: 'רעגיסטרירטע שטימען און ווידעאָס',
    fastTimesHeader: 'אייערע לאָקאַלע תּענית צייטן (22 מערץ 2027)',
    starts: 'אָנהייב פֿון תּענית (עלות השחר)',
    ends: 'סוף פֿון תּענית (צאת הכוכבים)',
    nameLabel: 'פֿולער נאָמען',
    countryLabel: 'לאַנד פֿון וואוינונג',
    durationLabel: 'ווי לאַנג וועט איר פֿאַסטן?',
    durationOptions: ['פֿולער תּענית (פֿון עלות השחר ביז צאת הכוכבים)', 'אַ האַלבן טאָג', 'ביז מיטאָג', 'אייגענע צייט / מעדיצינישע באַפֿרייאונג'],
    videoLabel: 'אַרויפֿלאָדן אַ 10-סעקונדע ווידעאָ (מאַקס. 10ס)',
    submitBtn: 'צולייגן מיין שטימע און ווידעאָ',
    errorDuration: 'דער ווידעאָ מוז זיין 10 סעקונדעס אָדער קירצער.',
    successMsg: 'אַ דאַנק. אייער שטימע און ווידעאָ זענען צוגעלייגט געוואָרן צו די 15 מיליאָן.',
    galleryTitle: 'שטימען פֿון דער גאָרער וועלט',
    noVideos: 'זייט דער ערשטער צו טיילן אַ 10-סעקונדע ווידעאָ.'
  },
    de: {
    dir: 'ltr',
    title: 'Ihr Name War Esther',
    subtitle: 'Am 22. März 2027 vereinen sich weltweit 15 Millionen Stimmen in Fasten, Erinnerung und Solidarität.',
    storyTitle: 'Warum „Ihr Name War Esther“?',
    storyBody: 'Inspiriert von der zeitlosen Geschichte von Mut, Identität und gemeinsamem Handeln in der Not ruft der Fastentag Esther Menschen weltweit dazu auf, gemeinsam innezuhalten, zu fasten und ihre Stimme zu erheben.',
    counterLabel: 'Registrierte Stimmen & Zusagen',
    fastTimesHeader: 'Ihre Lokalen Fastenzeiten (22. März 2027)',
    starts: 'Beginn des Fastens (Morgendämmerung)',
    ends: 'Ende des Fastens (Einbruch der Nacht)',
    nameLabel: 'Vollständiger Name',
    countryLabel: 'Wohnsitzland',
    durationLabel: 'Wie lange werden Sie fasten?',
    durationOptions: ['Vollständiges Fasten (Morgendämmerung bis Nacht)', 'Halber Tag', 'Bis Mittag', 'Individuell / Medizinische Ausnahme'],
    videoLabel: '10-Sekunden-Videobotschaft teilen (Max. 10s)',
    submitBtn: 'Meine Stimme & Video hinzufügen',
    errorDuration: 'Das Video darf maximal 10 Sekunden lang sein.',
    successMsg: 'Vielen Dank. Ihre Stimme und Ihr Video wurden zu den 15 Millionen hinzugefügt.',
    galleryTitle: 'Stimmen aus der Ganzen Welt',
    noVideos: 'Seien Sie der Erste, der eine 10-Sekunden-Videobotschaft teilt.'
  },
  it: {
    dir: 'ltr',
    title: 'Il Suo Nome Era Ester',
    subtitle: 'Il 22 marzo 2027, 15 milioni di voci si uniscono in tutto il mondo nel digiuno, nella memoria e nella solidarietà.',
    storyTitle: 'Perché "Il Suo Nome Era Ester"?',
    storyBody: 'Ispirata alla storia senza tempo di coraggio, identità e unità di fronte alle avversità, questa giornata invita milioni di persone a fermarsi, digiunare e condividere la propria voce.',
    counterLabel: 'Voci e Adesioni Registrate',
    fastTimesHeader: 'I Tuoi Orari Locali di Digiuno (22 Marzo 2027)',
    starts: 'Inizio del Digiuno (Alba)',
    ends: 'Fine del Digiuno (Tramonto/Notte)',
    nameLabel: 'Nome Completo',
    countryLabel: 'Paese di Residenza',
    durationLabel: 'Per quanto tempo digiunerai?',
    durationOptions: ['Digiuno Completo (Dall’alba a notte fonda)', 'Mezza Giornata', 'Fino a Mezzogiorno', 'Personalizzato / Esenzione Medica'],
    videoLabel: 'Condividi un Video di 10 Secondi (Max 10s)',
    submitBtn: 'Aggiungi la Mia Voce e il Video',
    errorDuration: 'Il video deve durare 10 secondi o meno.',
    successMsg: 'Grazie. La tua voce e il tuo video sono stati aggiunti ai 15 milioni.',
    galleryTitle: 'Voci da Tutto il Mondo',
    noVideos: 'Sii il primo a condividere un messaggio video di 10 secondi.'
  },
  ar: {
    dir: 'rtl',
    title: 'كان اسمها إستير',
    subtitle: 'في 22 مارس 2027، يتحد 15 مليون صوت حول العالم في الصيام والذكرى والتضامن.',
    storyTitle: 'لماذا "كان اسمها إستير"؟',
    storyBody: 'مستوحى من قصة الشجاعة والهوية والوحدة في مواجهة الشدائد، يجمع هذا اليوم ملايين الأصوات من كل ركن في العالم للوقوف معاً في صيام وتضامن مشترك.',
    counterLabel: 'الأصوات والتعهدات المسجلة',
    fastTimesHeader: 'أوقات الصيام المحلية الخاصة بك (22 مارس 2027)',
    starts: 'بداية الصيام (الفجر)',
    ends: 'نهاية الصيام (حلول الليل)',
    nameLabel: 'الاسم الكامل',
    countryLabel: 'بلد الإقامة',
    durationLabel: 'كم من الوقت ستصوم؟',
    durationOptions: ['صيام كامل (من الفجر حتى حلول الليل)', 'نصف يوم', 'حتى منتصف النهار', 'مخصص / إعفاء طبي'],
    videoLabel: 'شارك رسالة فيديو مدتها 10 ثوانٍ (الحد الأقصى 10 ثوانٍ)',
    submitBtn: 'أضف صوتي والفيديو الخاص بي',
    errorDuration: 'يجب أن تكون مدة الفيديو 10 ثوانٍ أو أقل.',
    successMsg: 'شكراً لك. تمت إضافة صوتك والفيديو الخاص بك إلى الـ 15 مليون.',
    galleryTitle: 'أصوات من جميع أنحاء العالم',
    noVideos: 'كن أول من يشارك رسالة فيديو مدتها 10 ثوانٍ.'
  },
  fa: {
    dir: 'rtl',
    title: 'نام او استر بود',
    subtitle: 'در ۲۲ مارس ۲۰۲۷، ۱۵ میلیون صدا در سراسر جهان در روزه، یادبود و همبستگی متحد می‌شوند.',
    storyTitle: 'چرا «نام او استر بود»؟',
    storyBody: 'با الهام از داستان ماندگار شجاعت، هویت و اتحاد در برابر سختی‌ها، این روز میلیون‌ها نفر را در سراسر جهان گرد هم می‌آورد تا با هم روزه بگیرند و صدای خود را به اشتراک بگذارند.',
    counterLabel: 'صداها و تعهدات ثبت‌شده',
    fastTimesHeader: 'زمان‌های محلی روزه شما (۲۲ مارس ۲۰۲۷)',
    starts: 'آغاز روزه (سپیده‌دم)',
    ends: 'پایان روزه (شب‌هنگام)',
    nameLabel: 'نام و نام خانوادگی',
    countryLabel: 'کشور محل سکونت',
    durationLabel: 'چه مدت روزه خواهید گرفت؟',
    durationOptions: ['روزه کامل (از سپیده‌دم تا شب‌هنگام)', 'نیم روز', 'تا ظهر', 'سفارشی / معافیت پزشکی'],
    videoLabel: 'اشتراک‌گذاری پیام ویدیویی ۱۰ ثانیه‌ای (حداکثر ۱۰ ثانیه)',
    submitBtn: 'افزودن صدا و ویدیوی من',
    errorDuration: 'مدت ویدیو باید ۱۰ ثانیه یا کمتر باشد.',
    successMsg: 'سپاسگزاریم. صدا و ویدیوی شما به ۱۵ میلیون نفر افزوده شد.',
    galleryTitle: 'صداهایی از سراسر جهان',
    noVideos: 'اولین نفری باشید که یک پیام ویدیویی ۱۰ ثانیه‌ای به اشتراک می‌گذارد.'
  }
};

export default function FastOfEstherApp() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

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

  // 1. Fetch Live Participant Count & Recent Videos
  const fetchDashboardData = async () => {
    const { count: totalRows } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true });
    if (totalRows !== null) setCount(totalRows);

    // Fetch latest 12 entries that include a video
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

  // 2. Detect Browser Location & Fetch March 22, 2027 Fast Times
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

  // 3. Enforce Strict 10-Second Video Limit in Browser
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
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
      fetchDashboardData(); // Refresh counter and video gallery immediately
    }
  };

  return (
    <main dir={t.dir} className="max-w-4xl mx-auto p-6 font-sans">
               {/* Language Switcher */}
      <div className="flex flex-wrap justify-end gap-2 mb-6">
        <button onClick={() => setLang('en')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">English</button>
        <button onClick={() => setLang('he')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">עברית</button>
        <button onClick={() => setLang('yi')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">ייִדיש</button>
        <button onClick={() => setLang('es')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Español</button>
        <button onClick={() => setLang('fr')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Français</button>
        <button onClick={() => setLang('ru')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Русский</button>
        <button onClick={() => setLang('pt')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Português</button>
        <button onClick={() => setLang('de')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Deutsch</button>
        <button onClick={() => setLang('it')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Italiano</button>
        <button onClick={() => setLang('ar')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">العربية</button>
        <button onClick={() => setLang('fa')} className="px-3 py-1 border rounded bg-white hover:bg-gray-100">فارسی</button>
      </div>


      {/* Header & Live Counter */}
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

      {/* Worldwide Fast Times Display */}
      {times && (
        <section className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
          <h2 className="font-semibold text-amber-900 mb-2">{t.fastTimesHeader}</h2>
          <div className="flex justify-around text-lg">
            <div><strong>{t.starts}:</strong> {times.fastStarts}</div>
            <div><strong>{t.ends}:</strong> {times.fastEnds}</div>
          </div>
        </section>
      )}

      {/* Registration & Video Upload Form */}
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
