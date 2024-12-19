'use client';

import { useState, useEffect } from 'react';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:4000/api/categories');
        if (res.ok) {
          const data: Category[] = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    setEditingCategory(category || { id: '', name: '', img: '' });
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      alert('Название категории обязательно.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingCategory.name);

      if (editingCategory.img instanceof File) {
        formData.append('img', editingCategory.img);
      }

      const method = editingCategory.id ? 'PUT' : 'POST';
      const url = editingCategory.id
        ? `http://localhost:4000/api/categories/${editingCategory.id}`
        : 'http://localhost:4000/api/categories';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const savedCategory = await res.json();

        if (editingCategory.id) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === savedCategory.id ? savedCategory : cat
            )
          );
        } else {
          setCategories((prev) => [...prev, savedCategory]);
        }

        closeModal();
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/categories/${categoryId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="manage-categories">
      <h2>Управление категориями</h2>
      <button onClick={() => openModal()}>Добавить категорию</button>

      {loading ? (
        <p>Загрузка категорий...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Наименование</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <img
                    src={
                      category.img instanceof File
                        ? URL.createObjectURL(category.img)
                        : `http://localhost:4000/uploads/${category.img}`
                    }
                    alt=""
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                  />
                </td>
                <td>{category.name}</td>
                <td>
                  <button onClick={() => openModal(category)}>Редактировать</button>
                  <button onClick={() => handleDelete(category.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalVisible && editingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {editingCategory.id
                ? 'Редактировать категорию'
                : 'Добавить категорию'}
            </h3>
            <label>
              Название:
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
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
                    setEditingCategory({ ...editingCategory, img: file });
                  }
                }}
              />
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
