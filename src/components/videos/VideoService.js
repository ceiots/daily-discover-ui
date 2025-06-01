// 视频服务 - 用于提供视频数据和管理
const API_BASE_URL = 'https://api.example.com'; // 替换为实际的API地址

// 模拟视频数据 - 实际应用中从服务器获取
const mockVideosData = [
  {
    id: 'v1',
    title: '5分钟学会高效时间管理',
    description: '探索科学高效的时间管理方法，包括番茄工作法、时间分块技术和优先级管理，帮助你每天多出2小时自由时间。',
    creator: '效率专家',
    viewCount: '23.5万',
    duration: '05:28',
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    aiSummary: 'AI摘要：重点是番茄工作法和任务分类优先级',
    tags: ['时间管理', '效率', '工作'],
    category: '生产力'
  },
  {
    id: 'v2',
    title: '最新智能家居产品评测',
    description: '深度评测2024年最新10款智能家居产品，分析性价比、功能和生态系统兼容性，助你打造真正智能的现代家居环境。',
    creator: '科技达人',
    viewCount: '18.2万',
    duration: '08:45',
    cover: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    aiSummary: 'AI摘要：智能音箱和安防系统性价比最高',
    tags: ['智能家居', '科技', '评测'],
    category: '科技'
  },
  {
    id: 'v3',
    title: '15分钟居家健身全套动作',
    description: '专业健身教练设计的15分钟高效居家锻炼方案，无需器械，针对全身主要肌群，帮助你在家也能保持良好身材。',
    creator: '健康生活',
    viewCount: '32.6万',
    duration: '15:20',
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
    aiSummary: 'AI摘要：无需器械，燃脂效果优于60%同类视频',
    tags: ['健身', '健康', '运动'],
    category: '健康'
  },
  {
    id: 'v5',
    title: '3种简单美味的快手早餐',
    description: '忙碌生活中的健康早餐解决方案，3种只需10分钟就能完成的营养均衡早餐，既美味又能提供持久能量。',
    creator: '美食日常',
    viewCount: '28.3万',
    duration: '07:42',
    cover: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    aiSummary: 'AI摘要：高蛋白配方可提供持续4小时饱腹感',
    tags: ['美食', '早餐', '烹饪'],
    category: '美食'
  }
];

// 获取视频列表
export const getVideoList = async () => {
  try {
    // 实际应用中应该调用API获取视频列表
    // const response = await fetch(`${API_BASE_URL}/api/videos`);
    // if (!response.ok) throw new Error('网络错误');
    // return await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockVideosData;
  } catch (error) {
    console.error('获取视频列表失败:', error);
    return mockVideosData; // 失败时返回模拟数据
  }
};

// 获取单个视频详情
export const getVideoById = async (videoId) => {
  try {
    // 实际应用中应该调用API获取视频详情
    // const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`);
    // if (!response.ok) throw new Error('网络错误');
    // return await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    const video = mockVideosData.find(v => v.id === videoId);
    return video || null;
  } catch (error) {
    console.error('获取视频详情失败:', error);
    return mockVideosData.find(v => v.id === videoId) || null; // 失败时从模拟数据中查找
  }
};

// 获取推荐视频
export const getRecommendedVideos = async (currentVideoId) => {
  try {
    // 实际应用中应该调用API获取推荐视频
    // const response = await fetch(`${API_BASE_URL}/api/videos/recommended?currentId=${currentVideoId}`);
    // if (!response.ok) throw new Error('网络错误');
    // return await response.json();
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    // 简单地返回除当前视频外的所有视频作为推荐
    return mockVideosData.filter(v => v.id !== currentVideoId);
  } catch (error) {
    console.error('获取推荐视频失败:', error);
    return mockVideosData.filter(v => v.id !== currentVideoId); // 失败时从模拟数据中过滤
  }
};

// 增加视频观看计数
export const incrementViewCount = async (videoId) => {
  try {
    // 实际应用中应该调用API增加观看计数
    // const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/view`, { method: 'POST' });
    // if (!response.ok) throw new Error('网络错误');
    // return await response.json();
    
    // 模拟API调用
    console.log(`增加视频 ${videoId} 的观看计数`);
    return { success: true };
  } catch (error) {
    console.error('增加视频观看计数失败:', error);
    return { success: false, error: error.message };
  }
};

export default {
  getVideoList,
  getVideoById,
  getRecommendedVideos,
  incrementViewCount
}; 