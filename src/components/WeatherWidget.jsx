import React from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  RefreshCw,
  Sun,
  Umbrella,
  Wind,
} from 'lucide-react';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-3.1019&longitude=119.8539&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=Asia%2FMakassar';
const CACHE_KEY = 'ics_tana_toraja_weather';
const REFRESH_INTERVAL = 15 * 60 * 1000;

const WEATHER_LABELS = {
  0: 'Cerah',
  1: 'Cerah berawan',
  2: 'Berawan sebagian',
  3: 'Mendung',
  45: 'Berkabut',
  48: 'Kabut beku',
  51: 'Gerimis ringan',
  53: 'Gerimis',
  55: 'Gerimis lebat',
  56: 'Gerimis beku ringan',
  57: 'Gerimis beku lebat',
  61: 'Hujan ringan',
  63: 'Hujan',
  65: 'Hujan lebat',
  66: 'Hujan beku ringan',
  67: 'Hujan beku lebat',
  71: 'Salju ringan',
  73: 'Salju',
  75: 'Salju lebat',
  77: 'Butiran salju',
  80: 'Hujan lokal ringan',
  81: 'Hujan lokal',
  82: 'Hujan lokal lebat',
  85: 'Hujan salju ringan',
  86: 'Hujan salju lebat',
  95: 'Badai petir',
  96: 'Badai petir dengan hujan es',
  99: 'Badai petir dengan hujan es lebat',
};

function weatherVisual(code) {
  if (code === 0) return { Icon: Sun, tone: 'sunny' };
  if (code === 1 || code === 2) return { Icon: CloudSun, tone: 'partly-cloudy' };
  if (code === 3 || code === 45 || code === 48) return { Icon: Cloud, tone: 'cloudy' };
  if (code >= 95) return { Icon: CloudLightning, tone: 'storm' };
  if (code >= 80) return { Icon: CloudRain, tone: 'rain' };
  if (code >= 51) return { Icon: CloudDrizzle, tone: 'drizzle' };
  return { Icon: Cloud, tone: 'cloudy' };
}

function parseWeather(payload) {
  const current = payload?.current;
  if (!current || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.weather_code)) {
    throw new Error('Respons cuaca tidak valid.');
  }
  return {
    temperature: current.temperature_2m,
    humidity: Number.isFinite(current.relative_humidity_2m) ? current.relative_humidity_2m : null,
    rainChance: Number.isFinite(current.precipitation_probability) ? current.precipitation_probability : null,
    wind: Number.isFinite(current.wind_speed_10m) ? current.wind_speed_10m : null,
    code: current.weather_code,
    observedAt: current.time,
    fetchedAt: new Date().toISOString(),
  };
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached?.temperature !== undefined ? cached : null;
  } catch {
    return null;
  }
}

export function WeatherWidget() {
  const [weather, setWeather] = React.useState(readCache);
  const [loading, setLoading] = React.useState(!weather);
  const [error, setError] = React.useState('');
  const weatherRef = React.useRef(weather);

  const loadWeather = React.useCallback(async () => {
    if (!weatherRef.current) setLoading(true);
    try {
      const response = await fetch(WEATHER_URL);
      if (!response.ok) throw new Error(`Cuaca gagal dimuat (${response.status}).`);
      const nextWeather = parseWeather(await response.json());
      weatherRef.current = nextWeather;
      setWeather(nextWeather);
      localStorage.setItem(CACHE_KEY, JSON.stringify(nextWeather));
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Cuaca tidak dapat diperbarui.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadWeather();
    const timer = window.setInterval(loadWeather, REFRESH_INTERVAL);
    return () => window.clearInterval(timer);
  }, [loadWeather]);

  if (loading && !weather) {
    return <div className="weather-card weather-card-loading" aria-live="polite">Memuat cuaca...</div>;
  }

  if (!weather) {
    return (
      <div className="weather-card weather-card-error" role="status">
        <div><strong>Data cuaca belum tersedia</strong><small>{error || 'Coba perbarui kembali.'}</small></div>
        <button type="button" className="weather-retry" onClick={loadWeather} aria-label="Coba muat cuaca lagi">
          <RefreshCw size={15} />
        </button>
      </div>
    );
  }

  const { Icon, tone } = weatherVisual(weather.code);
  const label = WEATHER_LABELS[weather.code] || 'Kondisi cuaca tidak diketahui';
  const updated = new Date(weather.fetchedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`weather-card weather-card-live ${tone}`} aria-label={`Cuaca Tana Toraja: ${label}, ${weather.temperature} derajat Celcius`}>
      <div className="weather-main">
        <Icon className="weather-icon" size={30} strokeWidth={1.7} />
        <div>
          <span>Tana Toraja · {label}</span>
          <strong>{Math.round(weather.temperature)}°C</strong>
        </div>
      </div>
      <div className="weather-details">
        {weather.humidity !== null && <span><Droplets size={12} />{weather.humidity}%</span>}
        {weather.rainChance !== null && <span><Umbrella size={12} />{weather.rainChance}%</span>}
        {weather.wind !== null && <span><Wind size={12} />{weather.wind} km/j</span>}
      </div>
      <small className="weather-updated">Diperbarui {updated} WITA{error ? ' · Data terakhir' : ''}</small>
    </div>
  );
}

