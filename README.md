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
