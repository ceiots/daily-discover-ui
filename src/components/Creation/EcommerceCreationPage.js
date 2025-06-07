import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./EcommerceCreationPage.css";
import instance from "../../utils/axios";
import { BasePage, Button, Card } from "../../theme";
// 由于主题中缺少 Input, Typography 和 Select 组件，使用自定义组件
import { Input, Typography, Select } from '../common/FormComponents';

const EcommerceCreationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    stock: 0,
    totalStock: 0,
    categoryId: "",
    parentCategoryId: "",
    grandCategoryId: "",
    images: [],
    details: [],
    specifications: [],
    purchaseNotices: [],
    tagIds: [],
    skus: [],
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic"); // basic, details, specs, notices, skus
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
    
    // 验证SKU数据
    if (formData.specifications.length > 0 && formData.skus.length === 0) {
      newErrors.skus = "您已添加规格，请生成对应的SKU";
    }
    
    // 验证每个SKU的价格和库存
    const invalidSkus = formData.skus.filter(
      sku => isNaN(parseFloat(sku.price)) || parseFloat(sku.price) <= 0 || 
             isNaN(parseInt(sku.stock)) || parseInt(sku.stock) < 0
    );
    if (invalidSkus.length > 0) {
      newErrors.skus = "部分SKU的价格或库存无效，请检查";
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

        // 处理SKU数据
        const cleanSkus = formData.skus.map(sku => ({
          price: parseFloat(sku.price) || 0,
          stock: parseInt(sku.stock) || 0,
          imageUrl: sku.imageUrl || (formData.images.length > 0 ? formData.images[0].url : ''),
          specifications: sku.specifications || {},
        }));

        // 计算总库存
        const totalStock = cleanSkus.reduce((sum, sku) => sum + (parseInt(sku.stock) || 0), 0);

        // 准备提交数据，转换为后端接受的格式
        const productData = {
          title: formData.title,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice
            ? parseFloat(formData.originalPrice)
            : null,
          stock: parseInt(formData.stock) || 0, // 确保stock是整数
          totalStock: totalStock || parseInt(formData.totalStock) || 0,
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
          skus: cleanSkus,
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

  // 生成SKU组合
  const generateSkuCombinations = () => {
    if (formData.specifications.length === 0) {
      return [];
    }
    
    // 筛选有效的规格（有名称且有选项）
    const validSpecs = formData.specifications.filter(
      spec => spec.name.trim() !== '' && spec.values.some(v => v.trim() !== '')
    );
    
    if (validSpecs.length === 0) {
      return [];
    }
    
    // 获取所有规格的有效选项
    const options = validSpecs.map(spec => ({
      name: spec.name,
      values: spec.values.filter(val => val.trim() !== '')
    }));
    
    // 递归生成所有规格组合
    const generateCombinations = (optionIndex, currentCombination) => {
      if (optionIndex >= options.length) {
        return [currentCombination];
      }
      
      const currentOption = options[optionIndex];
      const combinations = [];
      
      for (const value of currentOption.values) {
        const newCombination = { ...currentCombination, [currentOption.name]: value };
        combinations.push(...generateCombinations(optionIndex + 1, newCombination));
      }
      
      return combinations;
    };
    
    // 生成所有规格组合
    const specCombinations = generateCombinations(0, {});
    
    // 检查已有的SKU，避免重复生成
    const existingCombinations = formData.skus.map(sku => JSON.stringify(sku.specifications || {}));
    
    // 为每个新组合创建SKU对象
    const newSkus = specCombinations
      .filter(combo => !existingCombinations.includes(JSON.stringify(combo)))
      .map(combo => ({
        id: Date.now() + Math.random(),
        price: formData.price || 0,
        stock: 0,
        specifications: combo,
        imageUrl: formData.images.length > 0 ? formData.images[0].url : ''
      }));
    
    // 更新表单数据，合并已有的SKU和新生成的SKU
    setFormData({
      ...formData,
      skus: [...formData.skus, ...newSkus]
    });
  };
  
  // 更新SKU信息
  const updateSku = (skuId, field, value) => {
    setFormData({
      ...formData,
      skus: formData.skus.map(sku => 
        sku.id === skuId ? { ...sku, [field]: value } : sku
      )
    });
  };
  
  // 删除SKU
  const removeSku = (skuId) => {
    setFormData({
      ...formData,
      skus: formData.skus.filter(sku => sku.id !== skuId)
    });
  };

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
                <Button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "basic"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("basic")}
                  type="text"
                >
                  基本信息
                </Button>
                <Button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "details"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("details")}
                  type="text"
                >
                  商品详情
                </Button>
                <Button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "specs"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("specs")}
                  type="text"
                >
                  规格参数
                </Button>
                <Button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "notices"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("notices")}
                  type="text"
                >
                  购买须知
                </Button>
                <Button
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    activeTab === "skus"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("skus")}
                  type="text"
                >
                  SKU管理
                </Button>
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
                    <Input
                      type="text"
                      name="title"
                      placeholder="请输入商品标题"
                      value={formData.title}
                      onChange={handleInputChange}
                      error={errors.title}
                      fullWidth
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
                          <Input
                            type="text"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleInputChange}
                            error={errors.price}
                            prefix="¥"
                            fullWidth
                          />
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          name="originalPrice"
                          placeholder="原价（选填）"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          prefix="¥"
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>

                  {/* 商品库存 */}
                  <div className="mb-4">
                    <Card className="p-3">
                      <Typography.Title level={5} className="mb-3">库存管理</Typography.Title>
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            单品库存
                          </label>
                          <Input
                            type="number"
                            name="stock"
                            placeholder="请输入库存数量"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            fullWidth
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            总库存
                          </label>
                          <Input
                            type="number"
                            name="totalStock"
                            placeholder="请输入总库存数量"
                            value={formData.totalStock}
                            onChange={handleInputChange}
                            min="0"
                            fullWidth
                          />
                        </div>
                      </div>
                      <Typography.Text type="secondary" className="text-xs">
                        注：总库存为所有SKU库存总和，单品库存为默认SKU库存
                      </Typography.Text>
                    </Card>
                  </div>

                  {/* 商品分类 */}
                  <div className="mb-4">
                    <Card className="p-3">
                      <Typography.Title level={5} className="mb-3">商品分类</Typography.Title>
                      <div className="space-y-2">
                        {/* 一级分类 */}
                        <Select
                          value={selectedCategoryId || ""}
                          onChange={handleCategoryChange}
                          placeholder="请选择一级分类"
                          fullWidth
                          error={errors.category}
                        >
                          <option value="">请选择一级分类</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Select>

                        {/* 二级分类 */}
                        {subCategories.length > 0 && (
                          <Select
                            value={selectedSubCategoryId || ""}
                            onChange={handleSubCategoryChange}
                            placeholder="请选择二级分类"
                            fullWidth
                          >
                            <option value="">请选择二级分类</option>
                            {subCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </Select>
                        )}

                        {/* 三级分类 */}
                        {thirdCategories.length > 0 && (
                          <Select
                            value={formData.categoryId || ""}
                            onChange={handleThirdCategoryChange}
                            placeholder="请选择三级分类"
                            fullWidth
                          >
                            <option value="">请选择三级分类</option>
                            {thirdCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      </div>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.category}
                        </p>
                      )}
                    </Card>
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
                    <Card className="p-3">
                      <Typography.Title level={5} className="mb-3">商品图片</Typography.Title>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.images.map((image) => (
                          <div key={image.id} className="relative w-24 h-24">
                            <img
                              src={image.url}
                              alt=""
                              className="w-full h-full object-cover rounded"
                            />
                            <Button
                              type="danger"
                              size="small"
                              icon={<i className="fas fa-times text-xs"></i>}
                              className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center"
                              onClick={() => removeImage(image.id)}
                            />
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
                        <Button
                          onClick={() => {
                            const url = prompt("请输入图片URL");
                            if (url && url.trim()) {
                              handleImageUpload([url.trim()]);
                            }
                          }}
                          icon={<i className="fas fa-link text-gray-400 mr-1"></i>}
                          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50"
                          disabled={loading}
                        >
                          <span className="text-xs text-gray-500">输入URL</span>
                        </Button>
                      </div>
                      <Typography.Text type="secondary" className="text-xs block">
                        建议上传尺寸800x800像素以上、大小不超过10MB的图片
                      </Typography.Text>
                      <Typography.Text type="secondary" className="text-xs block">
                        如果图片过大，请使用图片压缩工具处理后再上传
                      </Typography.Text>
                      {errors.images && (
                        <Typography.Text type="danger" className="text-xs mt-1">
                          {errors.images}
                        </Typography.Text>
                      )}
                    </Card>
                  </div>
                </div>
              )}

              {/* 商品详情 */}
              {activeTab === "details" && (
                <div className="product-details">
                  <Card className="p-3">
                    <div className="flex justify-between items-center mb-4">
                      <Typography.Title level={5}>商品详情</Typography.Title>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => addDetail("text")}
                          size="small"
                          icon={<i className="fas fa-font text-xs mr-1"></i>}
                        >
                          添加文字
                        </Button>
                        <Button
                          onClick={() => addDetail("image")}
                          size="small"
                          icon={<i className="fas fa-image text-xs mr-1"></i>}
                        >
                          添加图片
                        </Button>
                        <Button
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
                          size="small"
                          icon={<i className="fas fa-link text-gray-400 mr-1"></i>}
                          disabled={loading}
                        >
                          输入URL
                        </Button>
                      </div>
                    </div>

                    {formData.details.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Typography.Text type="secondary">
                          点击上方按钮添加商品详情
                        </Typography.Text>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.details.map((detail, index) => (
                          <Card
                            key={detail.id}
                            className="p-3 bg-gray-50 rounded-lg relative"
                          >
                            <Button
                              type="text"
                              size="small"
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                              icon={<i className="fas fa-trash-alt text-xs"></i>}
                              onClick={() => removeDetail(detail.id)}
                            />

                            {detail.type === "text" ? (
                              <Input.TextArea
                                placeholder="请输入详情文字描述"
                                value={detail.content || ""}
                                onChange={(e) =>
                                  updateDetail(detail.id, e.target.value)
                                }
                                className="min-h-[80px]"
                              />
                            ) : (
                              <div>
                                {detail.content ? (
                                  <div className="relative">
                                    <img
                                      src={detail.content}
                                      alt=""
                                      className="w-full rounded"
                                    />
                                    <Button
                                      type="danger"
                                      size="small"
                                      className="absolute top-2 right-2 rounded-full w-5 h-5 flex items-center justify-center"
                                      icon={<i className="fas fa-times text-xs"></i>}
                                      onClick={() =>
                                        updateDetail(detail.id, null)
                                      }
                                    />
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
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* 规格参数 */}
              {activeTab === "specs" && (
                <div className="specifications">
                  <Card className="p-3">
                    <div className="flex justify-between items-center mb-4">
                      <Typography.Title level={5}>规格参数</Typography.Title>
                      <Button
                        onClick={addSpecification}
                        type="primary"
                        size="small"
                        icon={<i className="fas fa-plus text-xs mr-1"></i>}
                      >
                        添加规格
                      </Button>
                    </div>

                    {formData.specifications.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Typography.Text type="secondary">
                          点击上方按钮添加商品规格
                        </Typography.Text>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.specifications.map((spec, index) => (
                          <Card
                            key={spec.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <Input
                                type="text"
                                placeholder="规格名称，如颜色、尺寸等"
                                value={spec.name}
                                onChange={(e) =>
                                  updateSpecName(spec.id, e.target.value)
                                }
                                className="flex-1"
                              />
                              <Button
                                type="text"
                                size="small"
                                className="ml-2 text-gray-400 hover:text-red-500"
                                icon={<i className="fas fa-trash-alt text-xs"></i>}
                                onClick={() => removeSpecification(spec.id)}
                              />
                            </div>

                            <div className="space-y-2 mt-2">
                              {spec.values.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center">
                                  <Input
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
                                    className="flex-1"
                                  />
                                  {spec.values.length > 1 && (
                                    <Button
                                      type="text"
                                      size="small"
                                      className="ml-2 text-gray-400 hover:text-red-500"
                                      icon={<i className="fas fa-times text-xs"></i>}
                                      onClick={() =>
                                        removeSpecOption(spec.id, optIndex)
                                      }
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            <Button
                              onClick={() => addSpecOption(spec.id)}
                              size="small"
                              className="mt-2"
                              icon={<i className="fas fa-plus text-xs mr-1"></i>}
                            >
                              添加选项
                            </Button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* 购买须知 */}
              {activeTab === "notices" && (
                <div className="purchase-notices">
                  <Card className="p-3">
                    <div className="flex justify-between items-center mb-4">
                      <Typography.Title level={5}>购买须知</Typography.Title>
                      <Button
                        onClick={addPurchaseNotice}
                        type="primary"
                        size="small"
                        icon={<i className="fas fa-plus text-xs mr-1"></i>}
                      >
                        添加须知
                      </Button>
                    </div>

                    {formData.purchaseNotices.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Typography.Text type="secondary">
                          点击上方按钮添加购买须知
                        </Typography.Text>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.purchaseNotices.map((notice, index) => (
                          <Card
                            key={notice.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <Input
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
                                className="flex-1"
                              />
                              <Button
                                type="text"
                                size="small"
                                className="ml-2 text-gray-400 hover:text-red-500"
                                icon={<i className="fas fa-trash-alt text-xs"></i>}
                                onClick={() => removePurchaseNotice(notice.id)}
                              />
                            </div>

                            <Input.TextArea
                              placeholder="须知内容详情"
                              value={notice.content}
                              onChange={(e) =>
                                updatePurchaseNotice(
                                  notice.id,
                                  "content",
                                  e.target.value
                                )
                              }
                              className="min-h-[80px] mt-2"
                            />
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* SKU管理 */}
              {activeTab === "skus" && (
                <div className="skus">
                  <Card className="p-3">
                    <div className="flex justify-between items-center mb-4">
                      <Typography.Title level={5}>SKU管理</Typography.Title>
                      <div className="flex gap-2">
                        <Button
                          onClick={generateSkuCombinations}
                          type="primary"
                          size="small"
                          icon={<i className="fas fa-magic text-xs mr-1"></i>}
                        >
                          生成SKU组合
                        </Button>
                      </div>
                    </div>

                    {formData.specifications.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Typography.Text type="secondary" className="block mb-2">
                          请先在「规格参数」选项卡中添加商品规格
                        </Typography.Text>
                        <Button
                          onClick={() => setActiveTab("specs")}
                          type="primary"
                          size="small"
                        >
                          去添加规格
                        </Button>
                      </div>
                    ) : formData.skus.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Typography.Text type="secondary" className="block mb-2">
                          基于已添加的规格生成SKU组合
                        </Typography.Text>
                        <Button
                          onClick={generateSkuCombinations}
                          type="primary"
                          size="small"
                        >
                          生成SKU组合
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  规格组合
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  价格(¥)
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  库存
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  操作
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {formData.skus.map((sku, index) => (
                                <tr key={sku.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {Object.entries(sku.specifications || {}).map(([key, value]) => (
                                      <span key={key} className="inline-block px-2 py-1 m-1 bg-gray-100 rounded-full text-xs">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    <Input
                                      type="number"
                                      value={sku.price}
                                      onChange={(e) =>
                                        updateSku(sku.id, "price", e.target.value)
                                      }
                                      size="small"
                                      style={{ width: "100px" }}
                                    />
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    <Input
                                      type="number"
                                      value={sku.stock}
                                      onChange={(e) =>
                                        updateSku(sku.id, "stock", e.target.value)
                                      }
                                      size="small"
                                      style={{ width: "100px" }}
                                    />
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    <Button
                                      type="text"
                                      size="small"
                                      className="text-red-500"
                                      icon={<i className="fas fa-trash-alt text-xs"></i>}
                                      onClick={() => removeSku(sku.id)}
                                    >
                                      删除
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-4 p-3 bg-gray-50 rounded">
                          <Typography.Text type="secondary" className="block mb-2">
                            总库存: {formData.skus.reduce((sum, sku) => sum + (parseInt(sku.stock) || 0), 0)} 件
                          </Typography.Text>
                          <Typography.Text type="secondary" className="block text-xs">
                            提示: 修改SKU价格和库存后，系统会自动计算总库存
                          </Typography.Text>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 max-w-[375px] mx-auto">
              <div className="flex gap-3">
                <Button
                  onClick={handleDraft}
                  type="outline"
                  size="large"
                  className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700"
                >
                  保存草稿
                </Button>
                <Button
                  onClick={handleSubmit}
                  type="primary"
                  size="large"
                  className="flex-1 py-2.5 rounded-full text-sm font-medium"
                  loading={loading}
                >
                  发布商品
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </BasePage>
  );
};

export default EcommerceCreationPage;
