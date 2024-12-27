'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('https://digital-heaven-store.onrender.com/api/banners');
        if (res.ok) {
          const data: Banner[] = await res.json();
          setBanners(data);
        } else {
          console.error('Failed to fetch banners');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  if (loading) {
    return <p>Загрузка баннеров...</p>;
  }

  if (banners.length === 0) {
    return <p>Баннеры не найдены</p>;
  }

  return (
    <section className="hero">
      {banners[0] && (
        <div className="hero__main-banner-wrapper">
          <a
            href={banners[0].link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="hero__main-banner"
              src={`https://digital-heaven-store.onrender.com/uploads/${banners[0].img}`}
              alt="Главный баннер"
            />
          </a>
        </div>
      )}



      <div className="hero__banner-wrapper">
        <div className="hero__banner-group">
          {banners[1] && (
            <a
              href={banners[1].link}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__banner hero__banner--2"
            >
              <img
                src={`https://digital-heaven-store.onrender.com/uploads/${banners[1].img}`}
                alt="второй баннер"
              />
            </a>
          )}
          <div className='hero__banner-group hero__banner-group--row'>
            {banners[2] && (
              <a
                href={banners[2].link}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__banner hero__banner--3"
              >
                <img
                  src={`https://digital-heaven-store.onrender.com/uploads/${banners[2].img}`}
                  alt="третий баннер"
                />
              </a>
            )}
            {banners[3] && (
              <a
                href={banners[3].link}
                target="_blank"
                rel="noopener noreferrer"
                className="hero__banner hero__banner--4"
              >
                <img
                  src={`https://digital-heaven-store.onrender.com/uploads/${banners[3].img}`}
                  alt="четвертый баннер"
                />
              </a>
            )}
          </div>
        </div>

        {banners[4] && (
          <a
            href={banners[4].link}
            target="_blank"
            rel="noopener noreferrer"
            className="hero__banner hero__banner--5"
          >
            <img
              src={`https://digital-heaven-store.onrender.com/uploads/${banners[4].img}`}
              alt="Пятый баннер"
            />
          </a>
        )}
      </div>
    </section>
  );
}
