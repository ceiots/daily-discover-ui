import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./EcommerceCreationPage.css";
import instance from "../../utils/axios";
import { BasePage, Button, Card } from "../../theme";
// 由于主题中缺少 Input, Typography 和 Select 组件，使用自定义组件
import { Input, Typography, Select } from '../common/FormComponents';
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

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
    if (!formData.title.trim()) {
      toast.error("请输入商品标题");
      return false;
    }

    if (formData.images.length === 0) {
      toast.error("请上传至少一张商品图片");
      return false;
    }

    if (!formData.categoryId) {
      toast.error("请选择商品分类");
      return false;
    }

    // 当没有规格参数时，验证基本价格和库存
    if (formData.specifications.length === 0) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("请输入有效的商品价格");
        return false;
      }

      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error("请输入有效的商品库存");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (formData.specifications.length > 0 && !validateSkus()) {
      return;
    }

        setLoading(true);

    try {
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
        skuCode: sku.skuCode || generateSkuCode(sku.specifications || {}),
        price: parseFloat(sku.price) || 0,
        stock: parseInt(sku.stock) || 0,
        imageUrl: sku.imageUrl || (formData.images.length > 0 ? formData.images[0].url : ''),
        specifications: sku.specifications || {}
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
        stock: parseInt(formData.stock) || 0, // 单品库存，可以是默认SKU的库存
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
        skus: formData.specifications.length > 0 ? formatSkusForSubmission() : [],
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
    // 确保有规格参数
    if (formData.specifications.length === 0) {
      toast.warning("请先添加商品规格");
      return;
    }

    // 筛选出有效的规格（有名称且有选项值）
    const validSpecs = formData.specifications.filter(
      (spec) => spec.name.trim() !== "" && spec.values.some((v) => v.trim() !== "")
    );

    if (validSpecs.length === 0) {
      toast.warning("请先添加有效的规格和选项");
      return;
    }

    // 获取每个规格的选项列表
    const specOptions = validSpecs.map((spec) => {
      return {
        name: spec.name,
        values: spec.values.filter((val) => val.trim() !== ""),
      };
    });

    // 使用递归生成所有可能的组合
    const generateCombinations = (specs, currentIndex = 0, currentCombination = {}) => {
      if (currentIndex === specs.length) {
        return [{ ...currentCombination }];
      }

      const currentSpec = specs[currentIndex];
      const combinations = [];

      currentSpec.values.forEach((value) => {
        const newCombination = {
          ...currentCombination,
          [currentSpec.name]: value,
        };
        
        combinations.push(
          ...generateCombinations(specs, currentIndex + 1, newCombination)
        );
      });

      return combinations;
    };

    // 生成所有组合
    const specCombinations = generateCombinations(specOptions);
    
    // 转换成 SKU 数据结构
    const newSkus = specCombinations.map((combo) => {
      // 检查是否已经存在同样组合的 SKU
      const existingSku = formData.skus.find((sku) => {
        if (!sku.specifications) return false;
        
        // 检查每个规格值是否匹配
        return Object.keys(combo).every(
          (key) => sku.specifications[key] === combo[key]
        );
      });

      // 如果已存在，保留其价格和库存信息
      if (existingSku) {
        return {
          ...existingSku,
        };
      }

      // 否则创建新的 SKU
      const skuCode = generateSkuCode(combo);
      return {
        id: uuidv4(),
        skuCode,
        specifications: combo,
        price: formData.price || "0",
        stock: "0",
        imageUrl: "",
      };
    });

    setFormData({
      ...formData,
      skus: newSkus,
    });

    toast.success(`已生成 ${newSkus.length} 个规格组合`);
  };

  // 生成SKU编码
  const generateSkuCode = (specifications) => {
    // 使用商品 ID 前缀 + 规格值的首字母组合
    const prefix = "SKU";
    const timestamp = Date.now().toString().slice(-4);
    
    // 从规格值中获取部分字符
    const specPart = Object.values(specifications)
      .map(val => val.slice(0, 2))
      .join("")
      .replace(/\s+/g, "")
      .slice(0, 8);
    
    return `${prefix}${timestamp}${specPart}`.toUpperCase();
  };

  // 更新SKU信息
  const updateSku = (skuId, field, value) => {
    setFormData({
      ...formData,
      skus: formData.skus.map((sku) => {
        if (sku.id === skuId) {
          return {
            ...sku,
            [field]: value,
          };
        }
        return sku;
      }),
    });
  };

  // 删除SKU
  const removeSku = (skuId) => {
    setFormData({
      ...formData,
      skus: formData.skus.filter((sku) => sku.id !== skuId),
    });
  };

  // 将 SKU 数据转换为提交格式
  const formatSkusForSubmission = () => {
    return formData.skus.map((sku) => ({
      skuCode: sku.skuCode,
      specifications: Object.entries(sku.specifications || {}).map(([key, value]) => ({
        name: key,
        value: value
      })),
      price: parseFloat(sku.price) || 0,
      stock: parseInt(sku.stock) || 0,
      imageUrl: sku.imageUrl || (formData.images.length > 0 ? formData.images[0].url : "")
    }));
  };

  // 在提交表单前验证 SKU 数据
  const validateSkus = () => {
    if (formData.specifications.length > 0 && formData.skus.length === 0) {
      toast.error("请先生成规格组合");
      return false;
    }

    for (const sku of formData.skus) {
      if (!sku.price || parseFloat(sku.price) <= 0) {
        toast.error("请为所有规格组合设置有效价格");
        return false;
      }
      
      if (!sku.stock || parseInt(sku.stock) < 0) {
        toast.error("请为所有规格组合设置有效库存");
        return false;
      }
    }

    return true;
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
      <div className="ecommerce-creation-container">
        {/* 店铺检查提示 */}
        {shopChecking ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: '150px' }}>
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-primary text-xl mb-2"></i>
              <p className="text-sm">正在检查店铺信息...</p>
            </div>
          </div>
        ) : !hasShop ? (
          <div className="flex flex-col items-center justify-center p-4" style={{ minHeight: '150px' }}>
            <div className="text-center">
              <i className="fas fa-store text-primary text-3xl mb-3"></i>
              <h2 className="text-base font-medium mb-2">您还没有创建店铺</h2>
              <p className="text-gray-500 text-sm mb-4">创建商品前，请先创建您的店铺</p>
              <button
                onClick={() => navigate("/create-shop")}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
              >
                去创建店铺
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 标签导航栏 */}
            <div className="tab-nav">
                <button
                className={`tab-item ${activeTab === "basic" ? "active" : ""}`}
                  onClick={() => setActiveTab("basic")}
                >
                  基本信息
                </button>
                <button
                className={`tab-item ${activeTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  商品详情
                </button>
                <button
                className={`tab-item ${activeTab === "specs" ? "active" : ""}`}
                  onClick={() => setActiveTab("specs")}
                >
                  规格参数
                </button>
                <button
                className={`tab-item ${activeTab === "notices" ? "active" : ""}`}
                  onClick={() => setActiveTab("notices")}
                >
                  购买须知
                </button>
              <button
                className={`tab-item ${activeTab === "skus" ? "active" : ""}`}
                onClick={() => setActiveTab("skus")}
              >
                SKU管理
              </button>
            </div>

            {/* 内容区域 */}
            <div className="content-section">
              {/* 基本信息 */}
              {activeTab === "basic" && (
                <div className="basic-info">
                  {/* 商品标题 */}
                  <div className="form-card">
                    <div className="form-group">
                      <label className="form-label">商品标题</label>
                      <Input
                      type="text"
                      name="title"
                      placeholder="请输入商品标题"
                      value={formData.title}
                      onChange={handleInputChange}
                        error={errors.title}
                        fullWidth
                      />
                    </div>
                  </div>

                  {/* 商品价格和库存 */}
                  <div className="form-card">
                    <div className="card-title">
                      <i className="fas fa-tag"></i>价格与库存
                    </div>
                    
                    {/* 价格 */}
                    <div className="form-group">
                      <label className="form-label">商品价格</label>
                      <div className="two-column">
                        <div>
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
                        {errors.price && (
                            <p className="form-error">{errors.price}</p>
                        )}
                      </div>
                        <div>
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

                    {/* 库存 */}
                    <div className="form-group">
                      <div className="two-column">
                        <div>
                          <label className="form-label">总库存</label>
                          <Input
                          type="number"
                            name="totalStock"
                            placeholder="总库存数量"
                            value={formData.totalStock}
                          onChange={handleInputChange}
                          min="0"
                            fullWidth
                        />
                      </div>
                      </div>
                      <p className="form-hint">总库存为所有SKU库存总和，单品库存为默认SKU库存</p>
                    </div>
                  </div>

                  {/* 商品分类 */}
                  <div className="form-card">
                    <div className="card-title">
                      <i className="fas fa-folder"></i>商品分类
                    </div>
                    <div className="form-group">
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
                    </div>

                      {subCategories.length > 0 && (
                      <div className="form-group">
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
                      </div>
                      )}

                      {thirdCategories.length > 0 && (
                      <div className="form-group">
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
                    </div>
                    )}
                    
                    {errors.category && (
                      <p className="form-error">{errors.category}</p>
                    )}
                  </div>

                  {/* 商品图片 */}
                  <div className="form-card">
                    <div className="card-title">
                      <i className="fas fa-image"></i>商品图片
                    </div>
                    
                    <div className="image-upload-area">
                      {formData.images.map((image) => (
                        <div key={image.id} className="image-item">
                          <img src={image.url} alt="" />
                          <div 
                            className="image-delete"
                            onClick={() => removeImage(image.id)}
                          >
                            <i className="fas fa-times"></i>
                          </div>
                        </div>
                      ))}
                      
                      <label
                        className={`image-upload-btn ${loading ? "opacity-50" : ""}`}
                      >
                        {loading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}
                        <span>{loading ? "上传中..." : "添加图片"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={loading}
                        />
                      </label>
                      
                      <div 
                        className="image-upload-btn"
                        onClick={() => {
                          const url = prompt("请输入图片URL");
                          if (url && url.trim()) {
                            handleImageUpload([url.trim()]);
                          }
                        }}
                      >
                        <i className="fas fa-link"></i>
                        <span>输入URL</span>
                    </div>
                    </div>
                    
                    <p className="form-hint">建议上传尺寸800x800像素以上、大小不超过10MB的图片</p>
                    
                    {errors.images && (
                      <p className="form-error">{errors.images}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 商品详情 */}
              {activeTab === "details" && (
                <div className="product-details">
                  <div className="form-card">
                    <div className="card-title">
                      <i className="fas fa-align-left"></i>商品详情
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => addDetail("text")}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs flex items-center"
                      >
                        <i className="fas fa-font text-xs mr-1"></i>添加文字
                      </button>
                      <button
                        onClick={() => addDetail("image")}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs flex items-center"
                      >
                        <i className="fas fa-image text-xs mr-1"></i>添加图片
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
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs flex items-center"
                      >
                        <i className="fas fa-link text-xs mr-1"></i>输入URL
                      </button>
                  </div>

                  {formData.details.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-400 text-sm">点击上方按钮添加商品详情</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                        {formData.details.map((detail) => (
                        <div
                          key={detail.id}
                          className="p-3 bg-gray-50 rounded-lg relative"
                        >
                          <button
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-transparent border-0"
                            onClick={() => removeDetail(detail.id)}
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>

                          {detail.type === "text" ? (
                              <Input.TextArea
                              placeholder="请输入详情文字描述"
                              value={detail.content || ""}
                                onChange={(e) => updateDetail(detail.id, e.target.value)}
                                rows={4}
                                className="w-full"
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
                                  <button
                                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black bg-opacity-50 flex items-center justify-center"
                                      onClick={() => updateDetail(detail.id, null)}
                                    >
                                      <i className="fas fa-times text-white text-xs"></i>
                                  </button>
                                </div>
                              ) : (
                                  <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-white">
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
                                          const maxSizeInMB = 10;
                                          const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

                                        if (file.size > maxSizeInBytes) {
                                            alert(`图片 ${file.name} 超过${maxSizeInMB}MB大小限制，请压缩后再上传`);
                                          return;
                                        }

                                        setLoading(true);
                                        const formData = new FormData();
                                        formData.append("file", file);

                                        instance({
                                          method: "post",
                                          url: "/product/upload",
                                          data: formData,
                                            headers: { "Content-Type": undefined },
                                        })
                                          .then((response) => {
                                              if (response.data && response.data.code === 200) {
                                                const responseData = response.data.data;
                                              let imageUrl;

                                              if (responseData.url) {
                                                imageUrl = responseData.url;
                                              } else if (
                                                responseData.urls &&
                                                  Array.isArray(responseData.urls) &&
                                                responseData.urls.length > 0
                                              ) {
                                                imageUrl = responseData.urls[0];
                                              } else {
                                                  console.error("图片上传响应格式不正确:", responseData);
                                                  alert("图片上传响应格式不正确，请稍后重试");
                                                return;
                                              }

                                              updateDetail(detail.id, imageUrl);
                                            } else {
                                                alert("图片上传失败：" + (response.data.message || "未知错误"));
                                            }
                                          })
                                          .catch((error) => {
                                              console.error("上传详情图片时发生错误：", error);
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
                </div>
              )}

              {/* 规格参数 */}
              {activeTab === "specs" && (
                <div className="specifications">
                  <div className="spec-container">
                    <div className="spec-header">
                      <div className="spec-title">
                        <i className="fas fa-list-ul"></i> 规格参数
                      </div>
                    <button
                      onClick={addSpecification}
                        className="add-spec-btn"
                    >
                        <i className="fas fa-plus"></i>添加规格
                    </button>
                  </div>

                  {formData.specifications.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-400 text-sm">点击上方按钮添加商品规格</p>
                    </div>
                  ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          {formData.specifications.map((spec) => (
                            <div key={spec.id} className="spec-item">
                              <div className="spec-name">
                                <Input
                              type="text"
                              placeholder="规格名称，如颜色、尺寸等"
                              value={spec.name}
                                  onChange={(e) => updateSpecName(spec.id, e.target.value)}
                                  className="w-full"
                                  size="small"
                            />
                            <button
                                  className="spec-delete"
                              onClick={() => removeSpecification(spec.id)}
                            >
                                  <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>

                              <div className="spec-options">
                            {spec.values.map((option, optIndex) => (
                                  <div key={optIndex} className="spec-option">
                                    <Input
                                  type="text"
                                  placeholder={`选项${optIndex + 1}`}
                                  value={option}
                                      onChange={(e) => updateSpecOption(spec.id, optIndex, e.target.value)}
                                      className="flex-1"
                                      size="small"
                                />
                                {spec.values.length > 1 && (
                                  <button
                                        className="option-delete"
                                        onClick={() => removeSpecOption(spec.id, optIndex)}
                                      >
                                        <i className="fas fa-times"></i>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addSpecOption(spec.id)}
                                className="add-option-btn"
                          >
                                <i className="fas fa-plus"></i>添加选项
                          </button>
                        </div>
                      ))}
                    </div>

                        {formData.specifications.length > 0 && (
                          <div className="sku-generation">
                            <div className="sku-header">
                              <div className="sku-title">
                                <i className="fas fa-tags"></i> 规格组合
                              </div>
                              <button
                                onClick={generateSkuCombinations}
                                className="generate-sku-btn"
                              >
                                <i className="fas fa-magic"></i>生成规格组合
                              </button>
                            </div>
                            
                            {formData.skus.length === 0 ? (
                              <div className="sku-empty">
                                <p className="sku-empty-text">点击生成规格组合按钮生成SKU组合</p>
                              </div>
                            ) : (
                              <div className="sku-table-container">
                                <table className="sku-table">
                                  <thead>
                                    <tr>
                                      <th>规格组合</th>
                                      <th>价格(¥)</th>
                                      <th>库存</th>
                                      <th>图片</th>
                                      <th>操作</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData.skus.map((sku) => (
                                      <tr key={sku.id}>
                                        <td>
                                          {Object.entries(sku.specifications || {}).map(([key, value]) => (
                                            <span key={key} className="sku-spec-tag">
                                              {key}: {value}
                                            </span>
                                          ))}
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            value={sku.price}
                                            onChange={(e) => updateSku(sku.id, "price", e.target.value)}
                                            size="small"
                                            style={{ width: "80px" }}
                                          />
                                        </td>
                                        <td>
                                          <Input
                                            type="number"
                                            value={sku.stock}
                                            onChange={(e) => updateSku(sku.id, "stock", e.target.value)}
                                            size="small"
                                            style={{ width: "80px" }}
                                          />
                                        </td>
                                        <td>
                                          <div className="sku-image-selector">
                                            {sku.imageUrl ? (
                                              <div className="sku-image-preview" style={{ position: "relative" }}>
                                                <img 
                                                  src={sku.imageUrl} 
                                                  alt="SKU图片" 
                                                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                                                />
                                                <button 
                                                  className="sku-image-clear"
                                                  onClick={() => updateSku(sku.id, "imageUrl", "")}
                                                  style={{ position: "absolute", top: "-5px", right: "-5px", fontSize: "10px", background: "rgba(0,0,0,0.5)", color: "white", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}
                                                >
                                                  <i className="fas fa-times"></i>
                                                </button>
                                              </div>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  if (formData.images.length > 0) {
                                                    // 显示图片选择器或直接使用第一张图片
                                                    updateSku(sku.id, "imageUrl", formData.images[0].url);
                                                  } else {
                                                    alert("请先上传商品图片");
                                                  }
                                                }}
                                                className="sku-image-add"
                                                style={{ fontSize: "12px", color: "#5B5FEF", background: "none", border: "none" }}
                                              >
                                                <i className="fas fa-image mr-1"></i>设置图片
                                              </button>
                                            )}
                                          </div>
                                        </td>
                                        <td>
                                          <button
                                            className="text-red-500 bg-transparent border-0"
                                            onClick={() => removeSku(sku.id)}
                                          >
                                            <i className="fas fa-trash-alt text-xs mr-1"></i>删除
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-gray-500 text-sm mb-1">
                                总库存: {formData.skus.reduce((sum, sku) => sum + (parseInt(sku.stock) || 0), 0)} 件
                              </p>
                              <p className="text-gray-500 text-xs">
                                提示: 修改SKU价格和库存后，系统会自动计算总库存
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 购买须知 */}
              {activeTab === "notices" && (
                <div className="purchase-notices">
                  <div className="form-card">
                    <div className="flex justify-between items-center mb-3">
                      <div className="card-title mb-0">
                        <i className="fas fa-info-circle"></i>购买须知
                      </div>
                    <button
                      onClick={addPurchaseNotice}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center"
                    >
                        <i className="fas fa-plus text-xs mr-1"></i>添加须知
                    </button>
                  </div>

                  {formData.purchaseNotices.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-400 text-sm">点击上方按钮添加购买须知</p>
                    </div>
                  ) : (
                      <div className="space-y-3">
                        {formData.purchaseNotices.map((notice) => (
                        <div
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
                                size="small"
                            />
                            <button
                                className="ml-2 text-gray-400 hover:text-red-500 bg-transparent border-0"
                              onClick={() => removePurchaseNotice(notice.id)}
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
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
                              rows={3}
                              className="w-full"
                            />
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              )}

              {/* SKU管理 */}
              {activeTab === "skus" && (
                <div className="skus">
                  <div className="form-card">
                    <div className="sku-header">
                      <div className="sku-title">
                        <i className="fas fa-tags"></i> SKU管理
                      </div>
                      <button
                        onClick={generateSkuCombinations}
                        className="generate-sku-btn"
                      >
                        <i className="fas fa-magic"></i>生成SKU组合
                      </button>
                    </div>

                    {formData.specifications.length === 0 ? (
                      <div className="sku-empty">
                        <p className="sku-empty-text">请先在「规格参数」选项卡中添加商品规格</p>
                        <button
                          onClick={() => setActiveTab("specs")}
                          className="sku-empty-btn"
                        >
                          去添加规格
                        </button>
                      </div>
                    ) : formData.skus.length === 0 ? (
                      <div className="sku-empty">
                        <p className="sku-empty-text">基于已添加的规格生成SKU组合</p>
                        <button
                          onClick={generateSkuCombinations}
                          className="sku-empty-btn"
                        >
                          生成SKU组合
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="overflow-x-auto">
                          <table className="sku-table">
                            <thead>
                              <tr>
                                <th>规格组合</th>
                                <th>价格(¥)</th>
                                <th>库存</th>
                                <th>图片</th>
                                <th>操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.skus.map((sku) => (
                                <tr key={sku.id}>
                                  <td>
                                    {Object.entries(sku.specifications || {}).map(([key, value]) => (
                                      <span key={key} className="sku-spec-tag">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      value={sku.price}
                                      onChange={(e) => updateSku(sku.id, "price", e.target.value)}
                                      size="small"
                                      style={{ width: "80px" }}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="number"
                                      value={sku.stock}
                                      onChange={(e) => updateSku(sku.id, "stock", e.target.value)}
                                      size="small"
                                      style={{ width: "80px" }}
                                    />
                                  </td>
                                  <td>
                                    <div className="sku-image-selector">
                                      {sku.imageUrl ? (
                                        <div className="sku-image-preview">
                                          <img 
                                            src={sku.imageUrl} 
                                            alt="SKU图片" 
                                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                                          />
                                          <button 
                                            className="sku-image-clear"
                                            onClick={() => updateSku(sku.id, "imageUrl", "")}
                                            style={{ position: "absolute", top: "-5px", right: "-5px", fontSize: "10px" }}
                                          >
                                            <i className="fas fa-times-circle"></i>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            if (formData.images.length > 0) {
                                              // 显示图片选择器或直接使用第一张图片
                                              updateSku(sku.id, "imageUrl", formData.images[0].url);
                                            } else {
                                              alert("请先上传商品图片");
                                            }
                                          }}
                                          className="sku-image-add"
                                          style={{ fontSize: "12px", color: "#5B5FEF" }}
                                        >
                                          <i className="fas fa-image mr-1"></i>设置图片
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      className="text-red-500 bg-transparent border-0"
                                      onClick={() => removeSku(sku.id)}
                                    >
                                      <i className="fas fa-trash-alt text-xs mr-1"></i>删除
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-gray-500 text-sm mb-1">
                            总库存: {formData.skus.reduce((sum, sku) => sum + (parseInt(sku.stock) || 0), 0)} 件
                          </p>
                          <p className="text-gray-500 text-xs">
                            提示: 修改SKU价格和库存后，系统会自动计算总库存
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="bottom-actions">
                <button
                  onClick={handleDraft}
                className="btn-draft"
                disabled={loading}
                >
                  保存草稿
                </button>
                <button
                  onClick={handleSubmit}
                className="btn-publish"
                disabled={loading}
                >
                {loading ? "处理中..." : "发布商品"}
                </button>
            </div>
          </>
        )}
      </div>
    </BasePage>
  );
};

export default EcommerceCreationPage;
