'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories, saveCategory, deleteCategory, selectCategories, selectCategoriesLoading } from '@/store/slices/categoriesSlice';

export default function ManageCategories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openModal = (category?: Category) => {
    setEditingCategory(
      category || {
        id: '',
        name: '',
        img: '',
        displayName: '',
        specSchema: [],
      }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (editingCategory) {
      await dispatch(saveCategory(editingCategory));
      closeModal();
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteCategory(id));
  };

  return (
    <div className="dashboard__page dashboard__page--category">
      <h2>Управление категориями</h2>
      <button onClick={() => openModal()}>Добавить категорию</button>

      {loading ? (
        <p>Загрузка категорий...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Наименование на английском</th>
              <th>Наименование на русском</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <img
                    src={`http://localhost:4000/uploads/${category.img}`}
                    alt="category"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                  />
                </td>
                <td>{category.name}</td>
                <td>{category.displayName}</td>
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
            <h3>{editingCategory.id ? 'Редактировать категорию' : 'Добавить категорию'}</h3>
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
              Отображаемое имя:
              <input
                type="text"
                value={editingCategory.displayName}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, displayName: e.target.value })
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
