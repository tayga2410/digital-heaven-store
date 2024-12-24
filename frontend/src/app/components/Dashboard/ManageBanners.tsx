'use client';

import { useState, useEffect } from 'react';

export default function ManageBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('http://localhost:4000/api/banners');
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

  const openModal = (banner?: Banner) => {
    setEditingBanner(
      banner || {
        id: '',
        img: '',
        link: '',
        position: 0,
      }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingBanner(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!editingBanner || editingBanner.position === undefined) {
      alert('Пожалуйста, укажите позицию баннера.');
      return;
    }

    try {
      const formData = new FormData();
      if (editingBanner.img instanceof File) {
        formData.append('img', editingBanner.img);
      }
      formData.append('link', editingBanner.link || '');
      formData.append('position', editingBanner.position.toString());

      const method = editingBanner.id ? 'PUT' : 'POST';
      const url = editingBanner.id
        ? `http://localhost:4000/api/banners/${editingBanner.id}`
        : 'http://localhost:4000/api/banners';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const savedBanner = await res.json();

        if (editingBanner.id) {
          setBanners((prev) =>
            prev.map((banner) =>
              banner.id === savedBanner.id ? savedBanner : banner
            )
          );
        } else {
          setBanners((prev) => [...prev, savedBanner]);
        }

        closeModal();
      } else {
        console.error('Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleDelete = async (bannerId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/banners/${bannerId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBanners((prev) => prev.filter((banner) => banner.id !== bannerId));
      } else {
        console.error('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <div className="dashboard__page dashboard__page--banners">
      <h2>Управление баннерами</h2>
      <button onClick={() => openModal()}>Добавить баннер</button>
      {loading ? (
        <p>Загрузка баннеров...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Позиция</th>
              <th>Изображение</th>
              <th>Ссылка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {banners
              .sort((a, b) => a.position - b.position)
              .map((banner) => (
                <tr key={banner.id}>
                  <td>
                    {banner.position === 1
                      ? 'Главный баннер'
                      : `Баннер ${banner.position}`}
                  </td>
                  <td>
                    <img
                      src={`http://localhost:4000/uploads/${banner.img}`}
                      alt={`Баннер ${banner.position}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
                    />
                  </td>
                  <td>{banner.link || '—'}</td>
                  <td>
                    <button onClick={() => openModal(banner)}>Редактировать</button>
                    <button onClick={() => handleDelete(banner.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {modalVisible && editingBanner && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {editingBanner.id ? 'Редактировать баннер' : 'Добавить баннер'}
            </h3>
            <label>
              Ссылка:
              <input
                type="text"
                value={editingBanner.link}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, link: e.target.value })
                }
              />
            </label>
            <label>
              Изображение:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setEditingBanner({ ...editingBanner, img: file });
                  }
                }}
              />
            </label>
            <label>
              Позиция:
              <select
                value={editingBanner.position || ''}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    position: parseInt(e.target.value),
                  })
                }
              >
                <option value="" disabled>
                  Выберите позицию
                </option>
                {Array.from({ length: 5 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index === 0 ? 'Главный баннер' : `Баннер ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={handleSave}>Сохранить</button>
              <button onClick={closeModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
