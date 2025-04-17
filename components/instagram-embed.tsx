"use client"

import { useEffect, useState, useRef, Component, Suspense } from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useInView } from 'framer-motion'
import { InstagramIcon } from 'lucide-react'
import { useLanguage } from "@/lib/language-context"

// 自定義錯誤邊界組件
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Instagram embed error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// 多語言翻譯
const translations = {
  zh: {
    viewOnInstagram: "在 Instagram 查看這則貼文",
    loading: "正在加載 Instagram 內容...",
    error: "載入失敗，點擊查看原始內容",
    instagramContent: "Instagram 內容"
  },
  en: {
    viewOnInstagram: "View on Instagram",
    loading: "Loading Instagram content...",
    error: "Failed to load, click to view original content",
    instagramContent: "Instagram content"
  },
  ja: {
    viewOnInstagram: "Instagram で見る",
    loading: "Instagram コンテンツを読み込み中...",
    error: "読み込みに失敗しました。クリックすると元のコンテンツが表示されます",
    instagramContent: "Instagram コンテンツ"
  }
}

// 組件接口定義
interface InstagramEmbedProps {
  url: string;                   // Instagram 貼文 URL
  className?: string;           // 自定義 CSS 類名
  caption?: string;             // 貼文標題
  fallbackImage?: string;       // 加載失敗時的備用圖片
}

// 自定義 Hook: 處理 Instagram 腳本加載邏輯
function useInstagramEmbed(url: string, isInView: boolean) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const scriptLoaded = useRef(false)
  
  // 清理 URL，移除不必要的參數
  const cleanUrl = url.replace('ig_web_copy_link', 'ig_embed').split('&igsh=')[0]

  useEffect(() => {
    // 預加載資源提示
    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'script'
    preloadLink.href = "//www.instagram.com/embed.js"
    document.head.appendChild(preloadLink)

    return () => {
      document.head.removeChild(preloadLink)
    }
  }, [])

  useEffect(() => {
    if (!isInView || error || scriptLoaded.current) return

    // 動態加載 Instagram 嵌入腳本
    const loadInstagram = async () => {
      try {
        if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
          scriptLoaded.current = true
          const script = document.createElement('script')
          script.src = "//www.instagram.com/embed.js"
          script.async = true
          script.onload = () => {
            if (window.instgrm) {
              window.instgrm.Embeds.process()
              setLoaded(true)
            }
          }
          script.onerror = () => setError(true)
          document.body.appendChild(script)
        } else if (window.instgrm) {
          window.instgrm.Embeds.process()
          setLoaded(true)
        }
      } catch (err) {
        console.error("Error loading Instagram embed:", err)
        setError(true)
      }
    }

    const timer = setTimeout(loadInstagram, 100)
    return () => clearTimeout(timer)
  }, [isInView, error])

  return { error, loaded, cleanUrl }
}

// UI 組件: Instagram 預覽組件
function InstagramPreview({ url, t }: { url: string, t: typeof translations.zh }) {
  const openInstagram = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  
  return (
    <div style={{ padding: "16px" }}>
      <a 
        href={url} 
        style={{ 
          background: "#FFFFFF",
          lineHeight: "0",
          padding: "0 0",
          textAlign: "center",
          textDecoration: "none",
          width: "100%"
        }}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { e.preventDefault(); openInstagram(); }}
      >
        {/* 頂部用戶信息區域 */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ backgroundColor: "#F4F4F4", borderRadius: "50%", flexGrow: 0, height: "40px", marginRight: "14px", width: "40px" }}></div>
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
            <div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", marginBottom: "6px", width: "100px" }}></div>
            <div style={{ backgroundColor: "#F4F4F4", borderRadius: "4px", flexGrow: 0, height: "14px", width: "60px" }}></div>
          </div>
        </div>
        {/* 內容比例維持區域 - 關鍵部分 */}
        <div style={{ padding: "19% 0" }}></div>
        {/* Instagram 圖標 */}
        <div style={{ display: "block", height: "50px", margin: "0 auto 12px", width: "50px" }}>
          <InstagramIcon size={50} />
        </div>
        {/* "在 Instagram 查看這則貼文" 文字 */}
        <div style={{ paddingTop: "8px" }}>
          <div style={{ 
            color: "#3897f0",
            fontFamily: "Arial,sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "550",
            lineHeight: "18px"
          }}>
            {t.viewOnInstagram}
          </div>
        </div>
        {/* 額外空間維持器 */}
        <div style={{ padding: "12.5% 0" }}></div>
      </a>
    </div>
  )
}

// UI 組件: 錯誤處理顯示
function ErrorFallback({ url, fallbackImage, t }: { url: string, fallbackImage: string, t: typeof translations.zh }) {
  const openInstagram = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  
  return (
    <div className="rounded-lg overflow-hidden border h-full flex flex-col">
      {/* 圖片容器樣式 */}
      <div className="relative w-full flex-grow">
        <Image
          src={fallbackImage}
          alt={t.instagramContent}
          fill
          className="object-cover" // 可調整圖片填充方式
        />
        {/* 覆蓋層樣式：可自定義背景色、漸變等 */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
          {/* Instagram 圖標樣式 */}
          <InstagramIcon size={32} className="text-white mb-3" />
          {/* 按鈕樣式：可自定義顏色、hover效果等 */}
          <Button 
            onClick={openInstagram} 
            className="bg-white/20 text-white border-white/40 hover:bg-white/30"
          >
            {t.error}
          </Button>
        </div>
      </div>
    </div>
  )
}

// 主組件
export function InstagramEmbed({ 
  url, 
  className, 
  caption, 
  fallbackImage = "/attractions/新北市美術館.jpg" 
}: InstagramEmbedProps) {
  // 語言支持
  const { currentLang } = useLanguage()
  const t = translations[currentLang as keyof typeof translations]
  
  // 用於檢測元素是否在視窗中
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })
  
  // 使用自定義hook處理邏輯
  const { error, cleanUrl } = useInstagramEmbed(url, isInView)

  return (
    <div 
      ref={containerRef} 
      // 主容器樣式：可以自定義寬度、高度、邊距等
      className={cn(
        "instagram-embed w-full mx-auto transition-opacity duration-300",
        isInView ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ minHeight: '28rem' }} // 可調整最小高度
    >
      <ErrorBoundary fallback={<ErrorFallback url={url} fallbackImage={fallbackImage} t={t} />}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-muted/20 animate-pulse rounded-lg">
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        }>
          {error ? (
            // 錯誤降級方案的樣式
            <ErrorFallback url={url} fallbackImage={fallbackImage} t={t} />
          ) : (
            // Instagram 嵌入的樣式 - 基於官方嵌入代碼優化
            <div className="instagram-wrapper w-full h-full flex justify-center">
              {/* Instagram 官方嵌入容器樣式 */}
              <blockquote 
                className="instagram-media" 
                data-instgrm-permalink={cleanUrl}
                data-instgrm-version="14"
                data-instgrm-captioned
                style={{ 
                  background: "#FFF",
                  border: "0",
                  borderRadius: "3px",
                  boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: "0",
                  width: "calc(100% - 2px)",
                }}
              >
                <InstagramPreview url={url} t={t} />
              </blockquote>
              {/* 標題樣式 */}
              {caption && (
                <p className="text-sm text-center mt-2 text-muted-foreground">
                  {caption}
                </p>
              )}
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// 全局類型聲明
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default InstagramEmbed; 