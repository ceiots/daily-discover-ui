# Getting Started with Create React App

# 初始化capacito
npx cap init

# 生成android代码
npm install @capacitor/android
npx cap add android

# 拷贝应用代码
npm run build
npx cap copy

# 打包apk应用
cd android
测试包 ./gradlew.bat assembleDebug
正式包 ./gradlew.bat assembleRelease

# 打开android studio
npx cap open android

# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# 转微信小程序
npm install -g @tarojs/cli

taro init my-taro-app


daily-discover-ui/src/
├── components/
│   ├── games/
│   │   ├── GameLobby.js          # 游戏大厅主页
│   │   ├── GameHeader.js         # 游戏通用头部
│   │   ├── GameCard.js           # 游戏卡片组件
│   │   ├── DailyTask.js          # 每日任务组件
│   │   ├── LeaderBoard.js        # 排行榜组件
│   │   ├── QuizGame/             # 商品知识问答
│   │   ├── PriceGuess/           # 价格竞猜
│   │   ├── StyleMatch/           # 潮流风格配对
│   │   ├── BrandChallenge/       # 品牌高手挑战
│   │   └── rewards/              # 奖励相关组件
│   └── common/
│       ├── CountdownTimer.js     # 倒计时组件
│       ├── ProgressBar.js        # 进度条组件
│       └── ScoreAnimation.js     # 积分动画组件
├── pages/
│   ├── GameLobbyPage.js          # 游戏大厅页面
│   ├── GameDetailPage.js         # 游戏详情页
│   ├── GameResultPage.js         # 游戏结果页
│   └── UserGameCenterPage.js     # 个人游戏中心
├── context/
│   └── GameContext.js            # 游戏状态管理
└── api/
    └── gameService.js            # 游戏相关API