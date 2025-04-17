# Taiwan Travel Website

這是一個使用 Next.js、TypeScript 和 Tailwind CSS 構建的台灣旅遊網站。

## 🎨 色彩規範

| 色彩名稱 | HEX 值 | 用途 |
|---------|--------|-----|
| 主色 - 黃土橘 | `#F4B400` | CTA、時間軸、行程標籤 |
| 次色 - 暖白 | `#FFF8F0` | 背景主體 |
| 輔助色 - 草地綠 | `#4CAF50` | 自然景點標示、成功訊息 |
| 輔助色 - 淡咖啡 | `#A1887F` | 標籤底色、分隔區塊 |
| 字體主色 | `#4E342E` | 文字主色、標題 |
| 字體副色 | `#7B5E57` | 說明文字、次標題 |

### 延伸配色 (從封面設計中擷取)

| 色彩名稱 | HEX 值 | 用途 |
|---------|--------|-----|
| 背景黃 | `#FACC60` | 頁面標頭、背景漸層 |
| 台北101綠 | `#3DAE9F` | 地標建築、裝飾元素 |
| 深山綠 | `#4D7F64` | 山景、自然環境元素 |
| 淺山綠 | `#8FBE82` | 前景山脈、自然元素 |
| 天空藍 | `#C2E7F2` | 天空背景、水域 |
| 白雲白 | `#FFFFFF` | 雲朵、重點元素 |
| 暖橙色 | `#F08C34` | 太陽、強調元素 |

## 🖥 技術堆疊

- **框架**: Next.js 15
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 元件**: Radix UI
- **動畫**: Framer Motion
- **包管理器**: pnpm
- **字體**: Playfair Display (標題), Noto Sans (正文)

## 🎭 設計風格

網站採用扁平化插畫風格，以下為主要設計元素：

1. **插畫風景元素**
   - 山脈、樹木採用簡約扁平設計
   - 建築物使用簡化輪廓和色塊
   - 自然元素（雲朵、太陽）以圓潤形狀呈現

2. **版面配置**
   - 重疊層次感：前景、中景、背景清晰分層
   - 漸層色彩：背景使用柔和漸層提升深度感
   - 台灣輪廓作為核心視覺元素

3. **排版風格**
   - 標題：溫暖棕色系，襯線字體，加粗顯示
   - 副標：簡約黑色，無襯線字體
   - 強調時間日期的排版層級

4. **動畫與互動**
   - 漂浮效果：雲朵、標題輕微上下浮動
   - 滾動視差：背景與前景元素以不同速度移動
   - 頁面轉場：柔和漸變效果

## 📱 響應式設計

網站支援以下螢幕尺寸：
- 手機 (`sm`): 640px 以下
- 平板 (`md`): 768px 以下
- 筆電 (`lg`): 1024px 以下
- 桌機 (`xl`): 1280px 以下
- 大螢幕 (`2xl`): 1536px 以上

## 🔍 主要功能

1. **響應式導航列**
   - Logo
   - 主要導航選單
   - 主題切換按鈕

2. **旅遊資訊區塊**
   - 目的地概述
   - 主要特色
   - 推薦季節

3. **行程規劃**
   - 互動式時間軸
   - 詳細行程安排
   - 景點資訊卡片

4. **地圖區域**
   - 互動式地圖
   - 景點標記
   - 路線顯示

5. **交通資訊**
   - 交通方式列表
   - 時刻表
   - 票價資訊

6. **圖片畫廊**
   - 景點照片展示
   - 燈箱效果
   - 輪播功能

## 🎯 設計原則

1. **簡潔明瞭**
   - 清晰的視覺層級
   - 適當的留白
   - 一致的設計語言

2. **易於使用**
   - 直覺的導航
   - 清晰的資訊架構
   - 流暢的互動體驗

3. **效能優化**
   - 圖片最佳化
   - 延遲載入
   - 程式碼分割

4. **視覺一致性**
   - 維持插畫風格的統一性
   - 色彩系統的協調應用
   - 動畫效果的適度使用

## 🚀 開始使用

### 前置需求

- Node.js 18.0.0 或更高版本
- pnpm 8.0.0 或更高版本

如果你還沒有安裝 pnpm，可以使用以下命令安裝：

```bash
npm install -g pnpm
```

### 安裝步驟

1. 克隆專案：

```bash
git clone <your-repository-url>
cd taiwan-travel
```

2. 安裝依賴：

```bash
pnpm install
```

3. 設置環境變數：

創建 `.env.local` 文件並添加以下內容：

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. 啟動開發服務器：

```bash
pnpm dev
```

現在你可以在 [http://localhost:3000](http://localhost:3000) 訪問網站。

## 📦 可用的命令

- `pnpm dev` - 啟動開發服務器
- `pnpm build` - 構建生產版本
- `pnpm start` - 啟動生產服務器
- `pnpm lint` - 運行程式碼檢查

## 🛠️ 使用的技術

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Maps API](https://developers.google.com/maps)
- [Radix UI](https://www.radix-ui.com/)

## 📝 專案結構

```
taiwan-travel/
├── app/                # Next.js 應用程式目錄
├── components/         # React 元件
├── lib/               # 共用函式庫和資料
├── public/            # 靜態資源
└── styles/            # 全局樣式
```

## 🌟 功能特點

- 響應式設計
- 景點地圖與導航
- 交通路線規劃
- 景點資訊展示
- 動態路由
- 平滑動畫效果

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## Multilingual Typography Guidelines

### Font System

- **Chinese (Traditional)**
  - Primary: Noto Sans TC
  - Headings: 24px-32px (1.5rem-2rem)
  - Body: 16px (1rem)
  - Small text: 14px (0.875rem)
  - Line height: 1.6-1.8
  - Font weight: Regular (400), Medium (500), Bold (700)

- **English**
  - Primary: Inter
  - Secondary (Decorative): Playfair Display
  - Headings: 28px-36px (1.75rem-2.25rem)
  - Body: 16px (1rem)
  - Small text: 14px (0.875rem)
  - Line height: 1.5-1.7
  - Font weight: Regular (400), Medium (500), Bold (700)

- **Japanese**
  - Primary: Noto Sans JP
  - Headings: 24px-32px (1.5rem-2rem)
  - Body: 16px (1rem)
  - Small text: 14px (0.875rem)
  - Line height: 1.7-1.9
  - Font weight: Regular (400), Medium (500), Bold (700)

### Text Spacing

- **Chinese**
  - Character spacing: 0.05em
  - Paragraph spacing: 1.5rem
  - No first-line indent

- **English**
  - Character spacing: 0
  - Word spacing: 0.05em
  - Paragraph spacing: 1.5rem

- **Japanese**
  - Character spacing: 0.05em
  - Paragraph spacing: 1.5rem
  - No first-line indent

### Text Alignment

- **All Languages**
  - Left-aligned by default
  - Center-aligned for headlines and hero sections
  - Justified alignment avoided for better readability

### Responsive Behavior

- **Mobile**
  - Reduce font sizes by 10-15%
  - Increase line height by 5-10%
  - Maintain minimum text size of 12px

### Color Contrast

- **All Languages**
  - Primary text: #1A1A1A (dark mode: #FFFFFF)
  - Secondary text: #4A4A4A (dark mode: #E0E0E0)
  - Accent text: #FF6B6B
  - Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text

### Language Switcher

- Globe icon position: Top-right corner
- Dropdown menu with language options
- Clear visual indication of current language
- Smooth transition animation (0.3s) 