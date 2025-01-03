'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addProduct, updateProduct, deleteProduct, setProducts } from '@/store/slices/productsSlice';

export default function ManageProducts() {
  const products = useSelector((state: RootState) => state.products.products);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [specifications, setSpecifications] = useState<Array<{ key: string; type: string }>>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://digital-heaven-store.onrender.com/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem('token');
        const res = await fetch('https://digital-heaven-store.onrender.com/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    if (editingProduct?.categoryId) {
      const selectedCategory = categories.find((cat) => cat.id === editingProduct.categoryId);
      if (selectedCategory?.specSchema) {
        setSpecifications(
          selectedCategory.specSchema.map((spec) => {
            const existingSpec = editingProduct.specs?.find((s) => s.key === spec.key);
            return { key: spec.key, type: existingSpec?.type || '' };
          })
        );
      }
    }
  }, [editingProduct?.categoryId, categories]);


  const openModal = (product?: Product) => {
    const specs =
      product?.specs && Array.isArray(product.specs)
        ? product.specs
        : categories[0]?.specSchema || [];

    setEditingProduct(
      product || { id: '', name: '', price: 0, categoryId: categories[0]?.id || null, brandName: '', img: '' }
    );
    setSpecifications(specs);
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setModalVisible(false);
    setSpecifications([]);
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
      formData.append('price', editingProduct.price.toString());
      formData.append('isBestseller', editingProduct.isBestseller ? 'true' : 'false');
      formData.append('isTrending', editingProduct.isTrending ? 'true' : 'false');
      formData.append('categoryId', editingProduct.categoryId);
      formData.append('discount', editingProduct.discount?.toString() || '0');
      formData.append('specifications', JSON.stringify(specifications));
      if (editingProduct.brandName) {
        formData.append('brandName', editingProduct.brandName);
      }
      if (editingProduct.img instanceof File) {
        formData.append('img', editingProduct.img);
      }

      let url = 'https://digital-heaven-store.onrender.com/api/products';
      let method: 'POST' | 'PUT' = 'POST';

      if (editingProduct.id) {
        url = `https://digital-heaven-store.onrender.com/api/products/${editingProduct.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        const savedProduct = await res.json();
        if (method === 'POST') {
          dispatch(addProduct(savedProduct));
        } else {
          dispatch(updateProduct(savedProduct));
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
      const token = localStorage.getItem('token');
      const res = await fetch(`https://digital-heaven-store.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
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
    <div className="dashboard__page">
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
              <th>Бренд</th>
              <th>Скидка</th>
              <th>Бестселлер</th>
              <th>Популярное</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={`https://digital-heaven-store.onrender.com/uploads/${product.img}`}
                    alt=""
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  {categories.find((cat) => cat.id === product.categoryId)?.name || 'Неизвестная категория'}
                </td>
                <td>{product.brandName}</td>
                <td>{product.discount ? `${product.discount}%` : '—'}</td>
                <td>{product.isBestseller ? '✅' : '❌'}</td>
                <td>{product.isTrending ? '✅' : '❌'}</td>
                <td>${product.price}</td>
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
              Категория
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
              Бренд
              <input
                type="text"
                value={editingProduct.brandName || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, brandName: e.target.value })
                }
              />
            </label>
           
            <label>
              Бестселлер:
              <input
                type="checkbox"
                checked={editingProduct.isBestseller || false}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })
                }
              />
            </label>
            <label>
              Популярное:
              <input
                type="checkbox"
                checked={editingProduct.isTrending || false}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, isTrending: e.target.checked })
                }
              />
            </label>
            <label>
              Цена
              <input
                type="number"
                value={editingProduct.price || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : 0;
                  setEditingProduct({
                    ...editingProduct,
                    price: value,
                  });
                }}
              />
            </label>
            <label>
              Скидка
              <input
                type="number"
                min="0"
                max="100"
                value={editingProduct.discount || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, discount: parseFloat(e.target.value) || 0 })
                }
              />
            </label>
            <label>
              Изображение
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
            <ul className='modal-list'>
              {specifications.map((spec, index) => (
                <li className='modal-item' key={index} >
                  <span>{spec.key}</span>&nbsp;
                  <input
                    type="text"
                    value={spec.type || ''}
                    onChange={(e) => {
                      const updatedSpecs = [...specifications];
                      updatedSpecs[index].type = e.target.value;
                      setSpecifications(updatedSpecs);
                    }}
                  />
                </li>
              ))}
            </ul>

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