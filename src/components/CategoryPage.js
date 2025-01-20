import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { id } = useParams();

  // 这里可以根据 id 获取类别数据
  return (
    <div>
      <h1>类别页面 - {id}</h1>
      {/* 显示类别的详细信息 */}
    </div>
  );
};

export default CategoryPage;