import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import instance from '../utils/axios';
import './CategoryManagePage.css';

const CategoryManagePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    parentId: null,
    level: 1,
    icon: '',
    sortOrder: 0,
    status: 1
  });
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(1);

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 获取分类树
  const fetchCategoryTree = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await instance.get('/categories/tree', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setCategoryTree(response.data.data || []);
      } else {
        setError(response.data?.message || '获取分类失败');
      }
    } catch (error) {
      console.error('获取分类树失败：', error);
      setError('获取分类树失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有分类
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await instance.get('/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        setCategories(response.data.data || []);
      } else {
        setError(response.data?.message || '获取分类失败');
      }
    } catch (error) {
      console.error('获取分类失败：', error);
      setError('获取分类失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (isLoggedIn) {
      fetchCategoryTree();
      fetchAllCategories();
    }
  }, [isLoggedIn]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // 处理父分类选择变化
  const handleParentChange = (e) => {
    const parentId = e.target.value ? parseInt(e.target.value) : null;
    let level = 1;
    
    if (parentId) {
      const parentCategory = categories.find(cat => cat.id === parentId);
      if (parentCategory) {
        level = parentCategory.level + 1;
      }
    }
    
    setNewCategory({
      ...newCategory,
      parentId,
      level
    });
  };

  // 提交添加分类表单
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setError('分类名称不能为空');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await instance.post('/categories', newCategory, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        // 重置表单
        setNewCategory({
          name: '',
          parentId: null,
          level: 1,
          icon: '',
          sortOrder: 0,
          status: 1
        });
        
        // 刷新分类列表
        fetchCategoryTree();
        fetchAllCategories();
        
        // 隐藏表单
        setShowAddForm(false);
      } else {
        setError(response.data?.message || '添加分类失败');
      }
    } catch (error) {
      console.error('添加分类失败：', error);
      setError('添加分类失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 删除分类
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('确定要删除这个分类吗？')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await instance.delete(`/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.code === 200) {
        // 刷新分类列表
        fetchCategoryTree();
        fetchAllCategories();
      } else {
        setError(response.data?.message || '删除分类失败');
      }
    } catch (error) {
      console.error('删除分类失败：', error);
      setError('删除分类失败，可能有子分类或关联的商品');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleAddCategoryClick = (parentCategory = null, level = 1) => {
    setSelectedParent(parentCategory);
    setSelectedLevel(level);
    setNewCategory({
      name: '',
      parentId: parentCategory ? parentCategory.id : null,
      level: level,
      icon: '',
      sortOrder: 0,
      status: 1
    });
    setShowAddForm(true);
  };

  // 渲染分类树
  const renderCategoryTree = (categoryList, depth = 0) => {
    if (!categoryList || categoryList.length === 0) {
      return <div className="text-gray-500 pl-4 py-2">暂无分类</div>;
    }

    return (
      <ul className={`pl-${depth * 4}`}>
        {categoryList.map(category => (
          <li key={category.id} className="border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                {category.children && category.children.length > 0 && (
                  <button
                    onClick={() => toggleExpand(category.id)}
                    className="mr-2 w-5 h-5 flex items-center justify-center text-gray-500"
                  >
                    <i className={`fas fa-chevron-${expandedCategories.includes(category.id) ? 'down' : 'right'} text-xs`}></i>
                  </button>
                )}
                {category.icon && (
                  <img src={category.icon} alt="" className="w-5 h-5 mr-2" />
                )}
                <span className="text-sm">
                  {category.name} 
                  <span className="text-xs text-gray-500 ml-2">
                    (Level {category.level})
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleAddCategoryClick(category, category.level + 1)}
                  className="mr-2 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded"
                >
                  添加子分类
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded"
                >
                  删除
                </button>
              </div>
            </div>
            {category.children && category.children.length > 0 && expandedCategories.includes(category.id) && (
              <div className="pl-4 border-l border-gray-100 ml-2.5">
                {renderCategoryTree(category.children, depth + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="category-manage-container pb-16">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 bg-primary text-white z-10 max-w-[375px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-lg font-medium">商品分类管理</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-16 px-4">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* 添加顶级分类按钮 */}
        <div className="mb-4">
          <button
            onClick={() => handleAddCategoryClick(null, 1)}
            className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
          >
            <i className="fas fa-plus mr-2"></i>
            添加顶级分类
          </button>
        </div>

        {/* 添加分类表单 */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium mb-3">
              {selectedParent 
                ? `添加 "${selectedParent.name}" 的子分类` 
                : '添加顶级分类'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">分类名称</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  placeholder="请输入分类名称"
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">图标URL (可选)</label>
                <input
                  type="text"
                  name="icon"
                  value={newCategory.icon}
                  onChange={handleInputChange}
                  placeholder="请输入图标URL"
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded text-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 py-2 bg-primary text-white rounded text-sm"
                  disabled={loading}
                >
                  {loading ? '添加中...' : '添加分类'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 分类树 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium">分类列表</h3>
          </div>
          <div className="p-2">
            {loading && !categories.length ? (
              <div className="text-center py-4 text-gray-500 text-sm">加载中...</div>
            ) : (
              renderCategoryTree(categories)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagePage; 