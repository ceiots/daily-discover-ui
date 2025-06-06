import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./EcommerceCreationPage.css";
import instance from "../../utils/axios";
import { BasePage } from "../../theme";

const EcommerceCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    stock: 0,
    categoryId: "",
    parentCategoryId: "",
    grandCategoryId: "",
    images: [],
    details: [],
    specifications: [],
    purchaseNotices: [],
    tagIds: [],
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic"); // basic, details, specs, notices
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thirdCategories, setThirdCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  // 添加店铺相关状态
  const [hasShop, setHasShop] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [shopChecking, setShopChecking] = useState(true);

  // 添加检查用户是否有店铺的逻辑
  useEffect(() => {
    const checkUserShop = async () => {
      try {
        setShopChecking(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await instance.get("/shop/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.code === 200 && response.data.data) {
          setHasShop(true);
          setShopId(response.data.data.id);
        } else {
          setHasShop(false);
          // 将当前路径存储到localStorage，以便创建店铺后返回
          localStorage.setItem("shopRedirect", "/ecommerce-creation");
        }
      } catch (error) {
        console.error("检查用户店铺失败：", error);
        setHasShop(false);
      } finally {
        setShopChecking(false);
      }
    };

    checkUserShop();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (input) => {
    let files = [];
    // 本地文件上传
    if (input && input.target && input.target.files) {
      files = Array.from(input.target.files);
    } else if (Array.isArray(input)) {
      // URL上传
      files = input;
    }
    if (files.length > 0) {
      // 如果是URL字符串
      if (typeof files[0] === "string") {
        const newImages = files.map((url, index) => ({
          id: Date.now() + index,
          url: url,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          images: [...prevFormData.images, ...newImages],
        }));
        return;
      }
      // 本地文件上传逻辑
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
      if (oversizedFiles.length > 0) {
        alert(
          `以下文件超过${maxSizeInMB}MB大小限制，请压缩后再上传：\n${oversizedFiles
            .map((f) => f.name)
            .join("\n")}`
        );
        return;
      }
      setLoading(true);
      const formDataObj = new FormData();
      files.forEach((file) => {
        formDataObj.append("file", file);
      });
      instance({
        method: "post",
        url: "/product/upload",
        data: formDataObj,
        headers: {
          "Content-Type": undefined,
        },
      })
        .then((response) => {
          if (response.data && response.data.code === 200) {
            const responseData = response.data.data;
            let imageUrls = [];
            if (responseData.urls && Array.isArray(responseData.urls)) {
              imageUrls = responseData.urls;
            } else if (responseData.url) {
              imageUrls = [responseData.url];
            } else {
              console.error("图片上传响应格式不正确:", responseData);
              alert("图片上传响应格式不正确，请稍后重试");
              return;
            }
            const newImages = imageUrls.map((url, index) => ({
              id: Date.now() + index,
              url: url,
            }));
            setFormData((prevFormData) => ({
              ...prevFormData,
              images: [...prevFormData.images, ...newImages],
            }));
          } else {
            alert("图片上传失败：" + (response.data.message || "未知错误"));
          }
        })
        .catch((error) => {
          console.error("上传图片时发生错误：", error);
          alert("图片上传失败，请稍后重试");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const removeImage = (id) => {
    setFormData({
      ...formData,
      images: formData.images.filter((image) => image.id !== id),
    });
  };

  // 添加商品详情
  const addDetail = (type) => {
    const newDetail = {
      id: Date.now(),
      type,
      content: type === "text" ? "" : null,
      sort: formData.details.length,
    };
    setFormData({
      ...formData,
      details: [...formData.details, newDetail],
    });
  };

  // 更新商品详情
  const updateDetail = (id, content) => {
    setFormData({
      ...formData,
      details: formData.details.map((detail) =>
        detail.id === id ? { ...detail, content } : detail
      ),
    });
  };

  // 删除商品详情
  const removeDetail = (id) => {
    setFormData({
      ...formData,
      details: formData.details.filter((detail) => detail.id !== id),
    });
  };

  // 添加规格
  const addSpecification = () => {
    const newSpec = {
      id: Date.now(),
      name: "",
      values: [""],
    };
    setFormData({
      ...formData,
      specifications: [...formData.specifications, newSpec],
    });
  };

  // 更新规格名称
  const updateSpecName = (id, name) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map((spec) =>
        spec.id === id ? { ...spec, name } : spec
      ),
    });
  };

  // 添加规格选项
  const addSpecOption = (specId) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map((spec) =>
        spec.id === specId ? { ...spec, values: [...spec.values, ""] } : spec
      ),
    });
  };

  // 更新规格选项
  const updateSpecOption = (specId, index, value) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              values: spec.values.map((opt, i) => (i === index ? value : opt)),
            }
          : spec
      ),
    });
  };

  // 删除规格选项
  const removeSpecOption = (specId, index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.map((spec) =>
        spec.id === specId
          ? {
              ...spec,
              values: spec.values.filter((_, i) => i !== index),
            }
          : spec
      ),
    });
  };

  // 删除规格
  const removeSpecification = (id) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((spec) => spec.id !== id),
    });
  };

  // 添加购买须知
  const addPurchaseNotice = () => {
    const newNotice = {
      id: Date.now(),
      title: "",
      content: "",
    };
    setFormData({
      ...formData,
      purchaseNotices: [...formData.purchaseNotices, newNotice],
    });
  };

  // 更新购买须知
  const updatePurchaseNotice = (id, field, value) => {
    setFormData({
      ...formData,
      purchaseNotices: formData.purchaseNotices.map((notice) =>
        notice.id === id ? { ...notice, [field]: value } : notice
      ),
    });
  };

  // 删除购买须知
  const removePurchaseNotice = (id) => {
    setFormData({
      ...formData,
      purchaseNotices: formData.purchaseNotices.filter(
        (notice) => notice.id !== id
      ),
    });
  };

  // 处理分类选择
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
    setFormData({
      ...formData,
      grandCategoryId: categoryId,
      parentCategoryId: "",
      categoryId: "",
    });
  };

  // 处理二级分类选择
  const handleSubCategoryChange = (e) => {
    const subCategoryId = parseInt(e.target.value);
    setSelectedSubCategoryId(subCategoryId);
    setFormData({
      ...formData,
      parentCategoryId: subCategoryId,
      categoryId: "",
    });
  };

  // 处理三级分类选择
  const handleThirdCategoryChange = (e) => {
    const thirdCategoryId = parseInt(e.target.value);
    setFormData({
      ...formData,
      categoryId: thirdCategoryId,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "请输入商品标题";
    }
    if (!formData.price.trim()) {
      newErrors.price = "请输入商品价格";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "请输入有效的价格";
    }
    if (formData.images.length === 0) {
      newErrors.images = "请上传至少一张商品图片";
    }
    
    // alert内容优化
    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors).join('\n'));
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    if (validateForm()) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // 准备商品详情数据，过滤无效内容
        const cleanDetails = formData.details
          .filter((detail) => {
            if (detail.type === "text") {
              return detail.content && detail.content.trim() !== "";
            } else {
              return detail.content != null;
            }
          })
          .map((detail, index) => ({
            ...detail,
            sort: index, // 重新计算排序
          }));

        // 准备规格数据，保证格式正确
        const cleanSpecifications = formData.specifications
          .map((spec) => ({
            name: spec.name,
            values: spec.values.filter((val) => val.trim() !== ""), // 移除空值
          }))
          .filter((spec) => spec.name.trim() !== "" && spec.values.length > 0); // 移除没有名称或选项的规格

        // 准备提交数据，转换为后端接受的格式
        const productData = {
          title: formData.title,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice
            ? parseFloat(formData.originalPrice)
            : null,
          stock: parseInt(formData.stock) || 0, // 确保stock是整数
          categoryId: formData.categoryId,
          parentCategoryId: formData.parentCategoryId,
          grandCategoryId: formData.grandCategoryId,
          tagIds: formData.tagIds,
          images: formData.images.map((img) => img.url),
          details: cleanDetails,
          specifications: cleanSpecifications,
          purchaseNotices: formData.purchaseNotices.filter(
            (notice) =>
              notice.title.trim() !== "" || notice.content.trim() !== ""
          ),
        };

        console.log("提交商品数据:", productData);

        const response = await instance.post("/product/create", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.code === 200) {
          alert("商品创建成功，等待审核！");
          navigate("/my-service");
        } else {
          alert("商品创建失败：" + (response.data.message || "未知错误"));
        }
      } catch (error) {
        console.error("提交商品数据失败：", error);
        alert("商品创建失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDraft = () => {
    // 保存草稿逻辑
    console.log("保存草稿:", formData);
    alert("草稿已保存！");
  };

  // 获取顶级分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await instance.get("/categories?level=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("一级分类：", response.data);
        if (response.data && response.data.code === 200) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("获取分类失败：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 当选择一级分类时，获取二级分类
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubCategories([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `/categories?parent_id=${selectedCategoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.code === 200) {
          setSubCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("获取二级分类失败：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  // 当选择二级分类时，获取三级分类
  useEffect(() => {
    if (!selectedSubCategoryId) {
      setThirdCategories([]);
      return;
    }

    const fetchThirdCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `/categories?parent_id=${selectedSubCategoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.code === 200) {
          setThirdCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("获取三级分类失败：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThirdCategories();
  }, [selectedSubCategoryId]);

  // 获取商品标签
  useEffect(() => {
    if (!formData.categoryId) {
      return;
    }

    const fetchTags = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `/tags/category/${formData.categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.code === 200) {
          setTags(response.data.data || []);
        }
      } catch (error) {
        console.error("获取标签失败：", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [formData.categoryId]);

  return (
    <BasePage
      showHeader={true}
      headerLeft={
        <button className="btn" onClick={() => navigate("/my-service")}>
          <i className="fas fa-arrow-left"></i>
        </button>
      }
      headerTitle="电商创建"
      backgroundColor="default"
    >
      <div 
        style={{ 
          paddingBottom: '80px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent' 
        }}
        className="custom-scrollbar"
      >
        {/* 店铺检查提示 */}
        {shopChecking ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: '200px' }}>
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-primary text-2xl mb-3"></i>
              <p>正在检查店铺信息...</p>
            </div>
          </div>
        ) : !hasShop ? (
          <div className="flex flex-col items-center justify-center p-4" style={{ minHeight: '200px' }}>
            <div className="text-center">
              <i className="fas fa-store text-primary text-5xl mb-4"></i>
              <h2 className="text-xl font-medium mb-2">您还没有创建店铺</h2>
              <p className="text-gray-500 mb-6">创建商品前，请先创建您的店铺</p>
              <button
                onClick={() => navigate("/create-shop")}
                className="px-6 py-3 bg-primary text-white rounded-lg"
              >
                去创建店铺
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 标签切换 */}
            <div className="fixed top-20 left-0 right-0 bg-white z-10 max-w-[375px] mx-auto border-b">
              <div className="flex whitespace-nowrap">
                <button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "basic"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("basic")}
                >
                  基本信息
                </button>
                <button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "details"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  商品详情
                </button>
                <button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "specs"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("specs")}
                >
                  规格参数
                </button>
                <button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "notices"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("notices")}
                >
                  购买须知
                </button>
              </div>
            </div>

            {/* 主内容区域 */}
            <div className="pt-3 px-4 custom-scrollbar" style={{
              marginTop: '63px', 
              paddingBottom: '80px',
              scrollBehavior: 'smooth'
            }}>
              {/* 基本信息 */}
              {activeTab === "basic" && (
                <div className="basic-info">
                  {/* 商品标题 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      商品标题
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="请输入商品标题"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${
                        errors.title ? "border-red-500" : "border-gray-200"
                      } rounded-lg text-sm`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* 商品价格 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      商品价格
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ¥
                          </span>
                          <input
                            type="text"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-8 border ${
                              errors.price
                                ? "border-red-500"
                                : "border-gray-200"
                            } rounded-lg text-sm`}
                          />
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        {/* <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                        <input
                          type="text"
                          name="originalPrice"
                          placeholder="原价（选填）"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-8 border border-gray-200 rounded-lg text-sm"
                        />
                      </div> */}
                      </div>
                    </div>
                  </div>

                  {/* 商品库存 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      商品库存
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          name="stock"
                          placeholder="请输入库存数量"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 商品分类 */}
                  <div className="mb-4">
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品分类
                    <Link 
                      to="/category-manage" 
                      className="float-right text-xs text-primary hover:underline"
                    >
                      管理分类
                    </Link>
                  </label> */}
                    <div className="space-y-2">
                      {/* 一级分类 */}
                      <select
                        value={selectedCategoryId || ""}
                        onChange={handleCategoryChange}
                        className={`w-full p-3 border ${
                          errors.category ? "border-red-500" : "border-gray-200"
                        } rounded-lg text-sm bg-white`}
                      >
                        <option value="">请选择一级分类</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                      {/* 二级分类 */}
                      {subCategories.length > 0 && (
                        <select
                          value={selectedSubCategoryId || ""}
                          onChange={handleSubCategoryChange}
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="">请选择二级分类</option>
                          {subCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* 三级分类 */}
                      {thirdCategories.length > 0 && (
                        <select
                          value={formData.categoryId || ""}
                          onChange={handleThirdCategoryChange}
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="">请选择三级分类</option>
                          {thirdCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* 商品标签 */}
                  {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">商品标签 (最多选择5个)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <div 
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-xs cursor-pointer ${
                          selectedTags.includes(tag.id)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        style={tag.color ? { backgroundColor: selectedTags.includes(tag.id) ? tag.color : '#f3f4f6', color: selectedTags.includes(tag.id) ? '#ffffff' : '#374151' } : {}}
                      >
                        {tag.name}
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <div className="text-gray-500 text-xs">
                        {formData.categoryId ? '该分类下暂无标签' : '请先选择商品分类以查看相关标签'}
                      </div>
                    )}
                  </div>
                </div> */}

                  {/* 商品图片 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      商品图片
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.images.map((image) => (
                        <div key={image.id} className="relative w-24 h-24">
                          <img
                            src={image.url}
                            alt=""
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            onClick={() => removeImage(image.id)}
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                      <label
                        className={`w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <i className="fas fa-spinner fa-spin text-gray-400 mb-1"></i>
                        ) : (
                          <i className="fas fa-plus text-gray-400 mb-1"></i>
                        )}
                        <span className="text-xs text-gray-500">
                          {loading ? "上传中..." : "添加图片"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={loading}
                        />
                      </label>
                      <button
                        onClick={() => {
                          const url = prompt("请输入图片URL");
                          if (url && url.trim()) {
                            handleImageUpload([url.trim()]);
                          }
                        }}
                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50"
                        disabled={loading}
                      >
                        <i className="fas fa-link text-gray-400 mb-1"></i>
                        <span className="text-xs text-gray-500">输入URL</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      建议上传尺寸800x800像素以上、大小不超过10MB的图片
                    </p>
                    <p className="text-xs text-gray-500">
                      如果图片过大，请使用图片压缩工具处理后再上传
                    </p>
                    {errors.images && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.images}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 商品详情 */}
              {activeTab === "details" && (
                <div className="product-details">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium">商品详情</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addDetail("text")}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                      >
                        <i className="fas fa-font text-xs mr-1"></i>
                        添加文字
                      </button>
                      <button
                        onClick={() => addDetail("image")}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                      >
                        <i className="fas fa-image text-xs mr-1"></i>
                        添加图片
                      </button>
                      <button
                        onClick={() => {
                          const detailUrl = prompt("请输入详情图片URL");
                          if (detailUrl && detailUrl.trim()) {
                            // 找到第一个未设置content的image类型detail，否则新建一个
                            let found = false;
                            setFormData(prev => {
                              const details = prev.details.map(d => {
                                if (!found && d.type === 'image' && !d.content) {
                                  found = true;
                                  return { ...d, content: detailUrl.trim() };
                                }
                                return d;
                              });
                              // 如果没有空image detail，则新建
                              if (!found) {
                                details.push({ id: Date.now(), type: 'image', content: detailUrl.trim(), sort: details.length });
                              }
                              return { ...prev, details };
                            });
                          }
                        }}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                        disabled={loading}
                      >
                        <i className="fas fa-link text-gray-400 mr-1"></i>
                        输入URL
                      </button>
                    </div>
                  </div>

                  {formData.details.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500 text-sm">
                        点击上方按钮添加商品详情
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.details.map((detail, index) => (
                        <div
                          key={detail.id}
                          className="p-3 bg-gray-50 rounded-lg relative"
                        >
                          <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            onClick={() => removeDetail(detail.id)}
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>

                          {detail.type === "text" ? (
                            <textarea
                              placeholder="请输入详情文字描述"
                              value={detail.content || ""}
                              onChange={(e) =>
                                updateDetail(detail.id, e.target.value)
                              }
                              className="w-full p-2 border border-gray-200 rounded text-sm min-h-[80px]"
                            ></textarea>
                          ) : (
                            <div>
                              {detail.content ? (
                                <div className="relative">
                                  <img
                                    src={detail.content}
                                    alt=""
                                    className="w-full rounded"
                                  />
                                  <button
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    onClick={() =>
                                      updateDetail(detail.id, null)
                                    }
                                  >
                                    <i className="fas fa-times text-xs"></i>
                                  </button>
                                </div>
                              ) : (
                                <label
                                  className={`block w-full p-4 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-white ${
                                    loading
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {loading ? (
                                    <i className="fas fa-spinner fa-spin text-gray-400 mb-1"></i>
                                  ) : (
                                    <i className="fas fa-cloud-upload-alt text-gray-400 mb-1"></i>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {loading ? "上传中..." : "上传详情图片"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={loading}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];

                                        // 检查文件大小
                                        const maxSizeInMB = 10; // 10MB限制
                                        const maxSizeInBytes =
                                          maxSizeInMB * 1024 * 1024;

                                        if (file.size > maxSizeInBytes) {
                                          alert(
                                            `图片 ${file.name} 超过${maxSizeInMB}MB大小限制，请压缩后再上传`
                                          );
                                          return;
                                        }

                                        // 显示上传中状态
                                        setLoading(true);

                                        // 创建FormData对象用于文件上传
                                        const formData = new FormData();
                                        formData.append("file", file);

                                        // 调用上传接口
                                        instance({
                                          method: "post",
                                          url: "/product/upload",
                                          data: formData,
                                          headers: {
                                            "Content-Type": undefined, // 让浏览器自动设置正确的Content-Type和boundary
                                          },
                                        })
                                          .then((response) => {
                                            if (
                                              response.data &&
                                              response.data.code === 200
                                            ) {
                                              const responseData =
                                                response.data.data;
                                              // 检查后端返回的数据结构
                                              let imageUrl;

                                              if (responseData.url) {
                                                // 如果返回了单个url
                                                imageUrl = responseData.url;
                                              } else if (
                                                responseData.urls &&
                                                Array.isArray(
                                                  responseData.urls
                                                ) &&
                                                responseData.urls.length > 0
                                              ) {
                                                // 如果返回了urls数组，使用第一个
                                                imageUrl = responseData.urls[0];
                                              } else {
                                                // 如果数据结构不符合预期，提示错误
                                                console.error(
                                                  "图片上传响应格式不正确:",
                                                  responseData
                                                );
                                                alert(
                                                  "图片上传响应格式不正确，请稍后重试"
                                                );
                                                return;
                                              }

                                              // 更新详情
                                              updateDetail(detail.id, imageUrl);
                                            } else {
                                              alert(
                                                "图片上传失败：" +
                                                  (response.data.message ||
                                                    "未知错误")
                                              );
                                            }
                                          })
                                          .catch((error) => {
                                            console.error(
                                              "上传详情图片时发生错误：",
                                              error
                                            );
                                            alert("图片上传失败，请稍后重试");
                                          })
                                          .finally(() => {
                                            setLoading(false);
                                          });
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 规格参数 */}
              {activeTab === "specs" && (
                <div className="specifications">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium">规格参数</h3>
                    <button
                      onClick={addSpecification}
                      className="px-3 py-1 bg-primary/10 rounded text-xs text-primary flex items-center"
                    >
                      <i className="fas fa-plus text-xs mr-1"></i>
                      添加规格
                    </button>
                  </div>

                  {formData.specifications.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500 text-sm">
                        点击上方按钮添加商品规格
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.specifications.map((spec, index) => (
                        <div
                          key={spec.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <input
                              type="text"
                              placeholder="规格名称，如颜色、尺寸等"
                              value={spec.name}
                              onChange={(e) =>
                                updateSpecName(spec.id, e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-200 rounded text-sm"
                            />
                            <button
                              className="ml-2 text-gray-400 hover:text-red-500"
                              onClick={() => removeSpecification(spec.id)}
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>

                          <div className="space-y-2 mt-2">
                            {spec.values.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input
                                  type="text"
                                  placeholder={`选项${optIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    updateSpecOption(
                                      spec.id,
                                      optIndex,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 p-2 border border-gray-200 rounded text-sm"
                                />
                                {spec.values.length > 1 && (
                                  <button
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                    onClick={() =>
                                      removeSpecOption(spec.id, optIndex)
                                    }
                                  >
                                    <i className="fas fa-times text-xs"></i>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addSpecOption(spec.id)}
                            className="mt-2 px-3 py-1 bg-gray-100 rounded text-xs text-gray-700 flex items-center"
                          >
                            <i className="fas fa-plus text-xs mr-1"></i>
                            添加选项
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 购买须知 */}
              {activeTab === "notices" && (
                <div className="purchase-notices">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium">购买须知</h3>
                    <button
                      onClick={addPurchaseNotice}
                      className="px-3 py-1 bg-primary/10 rounded text-xs text-primary flex items-center"
                    >
                      <i className="fas fa-plus text-xs mr-1"></i>
                      添加须知
                    </button>
                  </div>

                  {formData.purchaseNotices.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500 text-sm">
                        点击上方按钮添加购买须知
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.purchaseNotices.map((notice, index) => (
                        <div
                          key={notice.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <input
                              type="text"
                              placeholder="须知标题，如退换政策、发货说明等"
                              value={notice.title}
                              onChange={(e) =>
                                updatePurchaseNotice(
                                  notice.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 border border-gray-200 rounded text-sm"
                            />
                            <button
                              className="ml-2 text-gray-400 hover:text-red-500"
                              onClick={() => removePurchaseNotice(notice.id)}
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>

                          <textarea
                            placeholder="须知内容详情"
                            value={notice.content}
                            onChange={(e) =>
                              updatePurchaseNotice(
                                notice.id,
                                "content",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-200 rounded text-sm min-h-[80px] mt-2"
                          ></textarea>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 max-w-[375px] mx-auto">
              <div className="flex gap-3">
                <button
                  onClick={handleDraft}
                  className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700"
                >
                  保存草稿
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 bg-primary rounded-full text-sm font-medium text-white"
                >
                  发布商品
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </BasePage>
  );
};

export default EcommerceCreationPage;
