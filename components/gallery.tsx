"use client"

import { useState } from "react"
import { Camera, InstagramIcon, GridIcon, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useLanguage } from "@/lib/language-context"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 動態導入 Instagram 嵌入組件
const InstagramEmbed = dynamic(() => import('./instagram-embed'), {
  loading: () => (
    <div className="w-full max-w-lg mx-auto h-[600px] bg-muted/20 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-muted-foreground text-sm">正在加載 Instagram 內容...</div>
    </div>
  ),
  ssr: false // 禁用服務器端渲染，確保只在客戶端執行
})

const translations = {
  zh: {
    title: "景點相冊",
    loading: "正在加載 Instagram 內容...",
    photos: "照片庫",
    instagram: "Instagram",
    viewAll: "查看全部"
  },
  en: {
    title: "Attractions Gallery",
    loading: "Loading Instagram content...",
    photos: "Photos",
    instagram: "Instagram",
    viewAll: "View All"
  },
  ja: {
    title: "観光スポット写真集",
    loading: "Instagram コンテンツを読み込んでいます...",
    photos: "写真",
    instagram: "Instagram",
    viewAll: "すべて見る"
  },
}

// Updated gallery data with new locations
const galleryImages = [
  {
    id: 1,
    src: "/attractions/台北101.jpeg",
    alt: "Taipei 101 / 台北101 / 台北101",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "台北101觀景台",
      en: "Taipei 101 Observatory",
      ja: "台北101展望台"
    }
  },
  {
    id: 2,
    src: "/attractions/九份老街.jpg",
    alt: "Jiufen Old Street / 九份老街 / 九份老街",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "九份老街夜景",
      en: "Jiufen Old Street Night View",
      ja: "九份老街の夜景"
    }
  },
  {
    id: 3,
    src: "/attractions/高美濕地.jpg",
    alt: "Gaomei Wetlands / 高美濕地 / 高美湿地",
    location: {
      zh: "台中市",
      en: "Taichung City",
      ja: "台中市"
    },
    caption: {
      zh: "高美濕地夕陽",
      en: "Gaomei Wetlands Sunset",
      ja: "高美湿地の夕日"
    }
  },
  {
    id: 4,
    src: "/attractions/十份瀑布.jpg",
    alt: "Shifen Waterfall / 十分瀑布 / 十分滝",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "十分瀑布",
      en: "Shifen Waterfall",
      ja: "十分滝"
    }
  },
  {
    id: 5,
    src: "/attractions/逢甲夜市.jpg",
    alt: "Fengjia Night Market / 逢甲夜市 / 逢甲夜市",
    location: {
      zh: "台中市",
      en: "Taichung City",
      ja: "台中市"
    },
    caption: {
      zh: "逢甲夜市美食",
      en: "Fengjia Night Market Food",
      ja: "逢甲夜市グルメ"
    }
  },
  {
    id: 6,
    src: "/attractions/艋舺龍山寺.webp",
    alt: "Lungshan Temple / 龍山寺 / 龍山寺",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "艋舺龍山寺",
      en: "Lungshan Temple of Manka",
      ja: "艋舺龍山寺"
    }
  },
  {
    id: 7,
    src: "/attractions/侯硐貓村.jpg",
    alt: "Houtong Cat Village / 猴硐貓村 / 猴硐猫村",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "猴硐貓村",
      en: "Houtong Cat Village",
      ja: "猴硐猫村"
    }
  },
  {
    id: 8,
    src: "/attractions/六福村.jpg",
    alt: "Leofoo Village Theme Park / 六福村 / 六福村テーマパーク",
    location: {
      zh: "新竹縣",
      en: "Hsinchu County",
      ja: "新竹県"
    },
    caption: {
      zh: "六福村主題遊樂園",
      en: "Leofoo Village Theme Park",
      ja: "六福村テーマパーク"
    }
  },
  {
    id: 9,
    src: "/attractions/木柵動物園.jpg",
    alt: "Taipei Zoo / 臺北市立動物園 / 台北市立動物園",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "臺北市立動物園",
      en: "Taipei Zoo",
      ja: "台北市立動物園"
    }
  },
  {
    id: 10,
    src: "/attractions/九份老街.jpg",
    alt: "Jinguashi / 金瓜石 / 金瓜石",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "金瓜石礦區",
      en: "Jinguashi Mining Area",
      ja: "金瓜石鉱区"
    }
  },
  {
    id: 11,
    src: "/attractions/野柳女王頭.jpg",
    alt: "Baoshi Mountain Viewing Platform / 報時山觀景臺 / 報時山展望台",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "報時山觀景臺",
      en: "Baoshi Mountain Viewing Platform",
      ja: "報時山展望台"
    }
  },
  {
    id: 12,
    src: "/attractions/新北市烘爐地南山福德宮.jpg",
    alt: "Nanshan Fude Temple / 烘爐地南山福德宮 / 南山福徳宮",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "烘爐地南山福德宮の夜景",
      en: "Nanshan Fude Temple",
      ja: "南山福徳宮の夜景"
    }
  },
  {
    id: 13,
    src: "/attractions/擎天崗.jpg",
    alt: "Qingtiangang Grassland / 擎天崗 / 擎天崗",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "陽明山擎天崗草原",
      en: "Yangmingshan Qingtiangang Grassland",
      ja: "陽明山擎天崗草原"
    }
  },
  {
    id: 14,
    src: "/attractions/淡水老街.png",
    alt: "Tamsui Old Street / 淡水老街 / 淡水老街",
    location: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    caption: {
      zh: "淡水老街風景",
      en: "Tamsui Old Street Scenery",
      ja: "淡水老街の風景"
    }
  },
  {
    id: 15,
    src: "/attractions/中正紀念堂.jpg",
    alt: "Chiang Kai-shek Memorial Hall / 中正紀念堂 / 中正記念堂",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "國立中正紀念堂",
      en: "National Chiang Kai-shek Memorial Hall",
      ja: "国立中正記念堂"
    }
  },
  {
    id: 16,
    src: "/attractions/國父紀念館.jpg",
    alt: "Sun Yat-sen Memorial Hall / 國父紀念館 / 国父記念館",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "國立國父紀念館",
      en: "National Sun Yat-sen Memorial Hall",
      ja: "国立国父記念館"
    }
  },
  {
    id: 17,
    src: "/attractions/迪化街.jpg",
    alt: "Dihua Street / 迪化街 / 迪化街",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "迪化街老街風貌",
      en: "Historic Dihua Street",
      ja: "迪化街の古い町並み"
    }
  },
  {
    id: 18,
    src: "/attractions/西門町.jpg",
    alt: "Ximending / 西門町 / 西門町",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "西門町商圈",
      en: "Ximending Shopping District",
      ja: "西門町商店街"
    }
  },
  {
    id: 19,
    src: "/attractions/士林夜市.jpg",
    alt: "Shilin Night Market / 士林夜市 / 士林夜市",
    location: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    caption: {
      zh: "士林夜市美食",
      en: "Shilin Night Market Food",
      ja: "士林夜市グルメ"
    }
  },
  {
    id: 20,
    src: "/attractions/台中市第四信用合作社.jpg",
    alt: "Fourth Credit Cooperative / 第四信用合作社 / 第四信用組合",
    location: {
      zh: "台中市",
      en: "Taichung City",
      ja: "台中市"
    },
    caption: {
      zh: "台中第四信用合作社",
      en: "Taichung Fourth Credit Cooperative",
      ja: "第四信用組合(アイスクリーム店)"
    }
  }
]

// Instagram posts data
const instagramPosts = [
  // 台北市影片
  {
    id: "post-tp1",
    url: "https://www.instagram.com/reel/DGfZQ6Pzava/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市北投ㄚ川-水煎包",
      en: "Taipei A-Chuan Water-Fried Buns",
      ja: "台北市-アーチュアン焼き包子"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post-tp2",
    url: "https://www.instagram.com/reel/DF-I-APzmap/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市石牌-生煎包",
      en: "Taipei Shipai Fried Dumplings",
      ja: "台北市-焼き小籠包"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post-tp3",
    url: "https://www.instagram.com/reel/DINfD2ITdIy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市-烤鴨捲餅",
      en: "Taipei Peking Duck Wraps",
      ja: "台北市-北京ダッククレープ"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post-tp4",
    url: "https://www.instagram.com/reel/C7A6ptrvA_L/?utm_source=ig_web_copy_link",
    caption: {
      zh: "台北市士林忠誠-牛肉麵",
      en: "Taipei Shilin Beef Noodle Soup",
      ja: "台北市-ぎゅうにくめん"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post-tp5",
    url: "https://www.instagram.com/reel/DHxRIhbztfU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市-新鮮水果飲料",
      en: "Taipei Fresh Fruit Juice",
      ja: "台北市-新鮮フルーツジュース"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post-tp6",
    url: "https://www.instagram.com/reel/DGCi30Nzk8A/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市人性甜點-草莓泡芙",
      en: "Taipei Strawberry Cream Puffs",
      ja: "台北市-いちごのシュークリーム"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post-tp7",
    url: "https://www.instagram.com/reel/DIRIiaOhUJy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市-曾家豆漿&深夜蛋塔",
      en: "Taipei Zeng's Soy Milk & Late Night Egg Tarts",
      ja: "台北市-曽家豆漿＆深夜のエッグタルト"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  {
    id: "post2",
    url: "https://www.instagram.com/reel/C7AxuCyv6QR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台北市微風平台夜景",
      en: "Taipei Breeze Platform Night View",
      ja: "台北市微風プラットフォームの夜景"
    },
    fallbackImage: "/attractions/台北101.jpeg"
  },
  
  // 新北市影片
  {
    id: "post-nt1",
    url: "https://www.instagram.com/reel/DHDhwCRTLXV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "新北市老梅綠石槽海岸",
      en: "New Taipei Laomei Green Reef",
      ja: "新北市老梅緑石溝海岸"
    },
    fallbackImage: "/attractions/淡水漁人碼頭.jpg"
  },
  {
    id: "post-nt2",
    url: "https://www.instagram.com/reel/DGuy7Q7TGD4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "新北市新莊黛比-魯肉飯",
      en: "New Taipei Dabie Braised Pork Rice",
      ja: "新北市-ダイビーのルーローハン"
    },
    fallbackImage: "/attractions/九份老街.jpg"
  },
  {
    id: "post-nt3",
    url: "https://www.instagram.com/reel/Cw4HXOYPa8e/?utm_source=ig_web_copy_link",
    caption: {
      zh: "新北市吳家-淡水阿給&粉漿蛋餅",
      en: "New Taipei Wu's Tamsui A-Gei & Egg Pancake",
      ja: "新北市-淡水アゲ＆クレープ風卵焼き"
    },
    fallbackImage: "/attractions/淡水老街.png"
  },
  {
    id: "post1",
    url: "https://www.instagram.com/reel/DIL7ytLTtMb/?utm_source=ig_embed",
    caption: {
      zh: "新北市美術館精彩展覽",
      en: "New Taipei City Art Museum Exhibition",
      ja: "新北市美術館の展示会"
    },
    fallbackImage: "/attractions/新北市美術館.jpg"
  },
  {
    id: "post3",
    url: "https://www.instagram.com/reel/DIGggqUJbyH/?utm_source=ig_embed",
    caption: {
      zh: "新北市無敵海景步道",
      en: "New Taipei City Invincible Sea View Trail",
      ja: "新北市の無敵海景トレイル"
    },
    fallbackImage: "/attractions/淡水漁人碼頭.jpg"
  },
  
  // 台中市影片
  {
    id: "post-tc1",
    url: "https://www.instagram.com/reel/DGu-UyDTQlT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台中市阿伯-地瓜球",
      en: "Taichung Uncle's Sweet Potato Balls",
      ja: "台中市おじさんのサツマイモボール"
    },
    fallbackImage: "/attractions/台中市第四信用合作社.jpg"
  },
  {
    id: "post-tc2",
    url: "https://www.instagram.com/reel/DFpbRSkPfyI/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台中市10元-車輪餅",
      en: "Taichung 10NT$ Wheel Cakes",
      ja: "台中市10元-今川焼き"
    },
    fallbackImage: "/attractions/台中市第四信用合作社.jpg"
  },
  {
    id: "post-tc3",
    url: "https://www.instagram.com/reel/DHs-Ojszml-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: {
      zh: "台中市華美市場-無名豆花",
      en: "Taichung Huamei Market Tofu Pudding",
      ja: "台中市-名前のない豆花"
    },
    fallbackImage: "/attractions/高美濕地.jpg"
  }
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const { currentLang } = useLanguage()
  const t = translations[currentLang as keyof typeof translations]
  const [displayMode, setDisplayMode] = useState<'photos' | 'instagram'>('photos')

  return (
    <section id="gallery" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="section-title">
            <Camera className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">{t.title}</h2>
          </div>
          
          <Tabs defaultValue="photos" onValueChange={(value) => setDisplayMode(value as 'photos' | 'instagram')}>
            <TabsList className="bg-muted/20 gap-2 p-1.5">
              <TabsTrigger value="photos" className="flex items-center gap-2 min-w-[6rem]">
                <GridIcon size={16} />
                <span>{t.photos}</span>
              </TabsTrigger>
              <TabsTrigger value="instagram" className="flex items-center gap-2 min-w-[6rem]">
                <InstagramIcon size={16} />
                <span>{t.instagram}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {displayMode === 'photos' ? (
          // 圖片庫顯示
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square card-hover"
                    onClick={() => setSelectedImage(image.id)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover image-hover"
                    />
                    <div className="image-overlay" />
                    <div className="image-caption">
                      <p className="text-white font-medium">{image.caption[currentLang as keyof typeof image.caption]}</p>
                      <p className="text-white/80 text-sm">{image.location[currentLang as keyof typeof image.location]}</p>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none">
                  <VisuallyHidden>
                    <DialogTitle>
                      {image.caption[currentLang as keyof typeof image.caption]} - {image.location[currentLang as keyof typeof image.location]}
                    </DialogTitle>
                  </VisuallyHidden>
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-contain" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium text-lg">{image.caption[currentLang as keyof typeof image.caption]}</p>
                    <p className="text-white/80">{image.location[currentLang as keyof typeof image.location]}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          // Instagram 帖子顯示 - 優化為網格布局
          <div className="space-y-8">
            {/* Instagram 網格布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {instagramPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="instagram-item flex flex-col h-full"
                >
                  <div className="relative overflow-hidden rounded-lg bg-white flex-grow">
                    <InstagramEmbed 
                      url={post.url}
                      className="instagram-embed-container h-full"
                      fallbackImage={post.fallbackImage}
                    />
                  </div>
                  <p className="text-sm text-center mt-2 text-muted-foreground">
                    {post.caption[currentLang as keyof typeof post.caption]}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* 觀看更多按鈕 */}
            <div className="flex justify-center mt-10">
              <Button 
                variant="outline" 
                className="group px-5 transition-all duration-300 hover:bg-primary/10"
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
              >
                {t.viewAll}
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}
