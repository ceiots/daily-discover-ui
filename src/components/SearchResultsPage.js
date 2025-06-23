import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../services/http/instance";
//import "./SearchResultsPage.css"; // 确保样式文件存在

const SearchResultsPage = () => {
  const location = useLocation();
  const { searchTerm } = location.state || { searchTerm: "" };
  const [results, setResults] = useState({ events: [], recommendations: [] });
  const [aiContents, setAiContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchTerm);
  const navigate = useNavigate();

  const fetchSearchResults = async () => {
    try {
      const response = await instance.get(`/search/all?keyword=${searchInput}`);
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
      const response = await instance.post('/ai/generate', searchInput, { responseType: 'stream' });
      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let receivedText = '';

      let isDone = false;
      while (!isDone) {
        const { done, value } = await reader.read();
        isDone = done;
        if (isDone) break;
        receivedText += decoder.decode(value, { stream: true });
        const lines = receivedText.split('\n');
        receivedText = lines.pop(); // 保留未完成的最后一行
        setAiContents((prevContents) => [...prevContents, ...lines.map(line => ({ content: line }))]);
      }
    } catch (error) {
      console.error("Error fetching AI content:", error);
    }
  };

  useEffect(() => {
    if (searchInput) {
      fetchSearchResults();
      fetchAIContent();
    }
  }, [searchInput]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleSearch = async () => {
    setLoading(true); // 开始加载状态
    setError(null); // 清除之前的错误
    // 重新获取搜索结果和 AI 内容
    fetchSearchResults();
    fetchAIContent();
  };

  // 合并事件和推荐内容
  const combinedResults = [...results.events, ...results.recommendations];

  return (
    <div className="bg-gray-50">
      <nav className="fixed top-0 w-full bg-primary px-4 py-3 flex items-center gap-3 z-50">
        <button className="text-white flex items-center" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left text-lg"></i>
        </button>
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            placeholder="搜索除夕相关商品"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-9 pl-10 pr-4 text-sm rounded-button border-none"
          />
          <i onClick={handleSearch} className="fas fa-search text-gray-400 ml-2 cursor-pointer"></i>
        </div>
      </nav>
      <div className="mt-16 px-4">
        <div className="py-4">
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

          <div className={`grid grid-cols-2 gap-3 ${aiContents.length === 0 ? 'mt-0' : ''}`}>
            {combinedResults.length > 0 ? (
              combinedResults.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative pt-[100%] bg-gray-100">
                    <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-1 text-xs text-white bg-primary/80 rounded">推荐</span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                    {item.price && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs">¥</span>
                        <span className="text-base font-medium text-red-500">{item.price}</span>
                        <span className="text-xs text-gray-400">起</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>没有找到相关结果</p>
            )}
          </div>
        </div>
      </div>
      <div className="h-16"></div>
    </div>
  );
};

export default SearchResultsPage; 