export async function getFastOfEsther2027(latitude, longitude, timezone) {
  const date = '2027-03-22';
  const url = `https://hebcal.com{latitude}&longitude=${longitude}&tzid=${encodeURIComponent(timezone)}&date=${date}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Zmanim');
  
  const data = await response.json();
  
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone 
    });
  };

  return {
    fastStarts: formatTime(data.times.alotHaShachar),
    fastEnds: formatTime(data.times.tzeit7083deg),
    locationName: data.location?.title || 'Your Location'
  };
}
