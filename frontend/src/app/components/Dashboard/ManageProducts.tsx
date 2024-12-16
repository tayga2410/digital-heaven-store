'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addProduct, updateProduct, deleteProduct, setProducts } from '@/store/slices/productsSlice';

interface Product {
  id: string;
  name: string;
  price: number;
  img?: string | File;
  categoryId: string | null; 
}

interface Category {
  id: string;
  name: string;
  img?: string;
}

export default function ManageProducts() {
  const products = useSelector((state: RootState) => state.products.products);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:4000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.ok) {
          const data: Product[] = await res.json();
          dispatch(setProducts(data));
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:4000/api/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.ok) {
          const data: Category[] = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const openModal = (product?: Product) => {
    setEditingProduct(
      product
        ? { ...product, categoryId: product.categoryId || categories[0]?.id || null }
        : { id: '', name: '', price: 0, categoryId: categories[0]?.id || null }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    if (!editingProduct.categoryId) {
      alert('Выберите категорию для продукта.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('categoryId', editingProduct.categoryId);
      formData.append('price', editingProduct.price.toString());

      if (editingProduct.img instanceof File) {
        formData.append('img', editingProduct.img);
      }

      const method = editingProduct.id ? 'PUT' : 'POST';
      const url = editingProduct.id
        ? `http://localhost:4000/api/products/${editingProduct.id}`
        : `http://localhost:4000/api/products`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const savedProduct = await res.json();
        if (editingProduct.id) {
          dispatch(updateProduct(savedProduct));
        } else {
          dispatch(addProduct(savedProduct));
        }
        closeModal();
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        dispatch(deleteProduct(productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="manage-products">
      <h2>Управление товарами</h2>
      <button onClick={() => openModal()}>Добавить товар</button>
      {loading ? (
        <p>Загрузка товаров...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Наименование</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={`http://localhost:4000/uploads/${product.img}`}
                    alt=""
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  {categories.find((cat) => cat.id === product.categoryId)?.name || 'Неизвестная категория'}
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => openModal(product)}>Редактировать</button>
                  <button onClick={() => handleDelete(product.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalVisible && editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProduct.id ? 'Редактировать товар' : 'Добавить товар'}</h3>
            <label>
              Наименование:
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </label>
            <label>
              Категория:
              <select
                value={editingProduct.categoryId || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Цена:
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(e.target.value),
                  })
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
                    setEditingProduct({ ...editingProduct, img: file });
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
