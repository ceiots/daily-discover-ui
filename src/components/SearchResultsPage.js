import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import instance from "../utils/axios";
//import "./SearchResultsPage.css"; // 确保样式文件存在

const SearchResultsPage = () => {
  const location = useLocation();
  const { searchTerm } = location.state || { searchTerm: "" };
  const [results, setResults] = useState({ events: [], recommendations: [] });
  const [aiContents, setAiContents] = useState([]); // 新增状态用于存储 AI 生成内容
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await instance.get(`/search/all?keyword=${searchTerm}`);
        setResults(response.data);
      } catch (error) {
        setError("Error fetching search results. Please try again later.");
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAIContent = async () => {
      try {
        const aiResponse = await instance.post('/ai/generate', searchTerm);
        setAiContents(aiResponse.data); // 更新 AI 生成内容
      } catch (error) {
        console.error("Error fetching AI content:", error);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
      fetchAIContent(); // 动态加载 AI 数据
    }
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // 合并事件和推荐内容
  const combinedResults = [...results.events, ...results.recommendations];

  return (
    <div className="search-results-container">
      <h1 className="text-lg font-medium">搜索结果: {searchTerm}</h1>
      <div className="results-list">
        {aiContents.length > 0 && (
          <div>
            <h2>AI 生成内容</h2>
            {aiContents.map((aiContent) => (
              <div key={aiContent.id} className="result-item">
                <h2>{aiContent.title}</h2>
                <p>{aiContent.content}</p>
              </div>
            ))}
          </div>
        )}

        {combinedResults.length > 0 ? (
          combinedResults.map((item) => (
            <div key={item.id} className="result-item">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>没有找到相关结果</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 