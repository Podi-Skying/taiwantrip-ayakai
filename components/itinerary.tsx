"use client"

import { useState } from "react"
import { format, addDays, parseISO } from "date-fns"
import { Calendar, MapPin, Clock, Hotel, Camera, Coffee, Utensils, Bus, Train, Plane, Car, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

// Trip start date
const startDate = parseISO("2025-04-25")

// Translations
const translations = {
  zh: {
    dayPrefix: "第",
    daySuffix: "天",
    transportation: "交通方式",
    duration: "所需時間",
    sectionTitle: "行程規劃",
    arrivalTime: "抵達時間",
    weekdays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"],
    transportTypes: {
      car: "開車",
      mrt: "捷運",
      bus: "公車",
      hsr: "高鐵",
      train: "火車",
      walk: "步行",
      "mrt&train": "捷運&火車",
      "mrt&bus": "捷運&公車",
      "bus&mrt": "公車&捷運",
      "hsr&car": "高鐵&開車",
      "airport-mrt": "機場捷運"
    },
    durationPrefix: "約",
    durationSuffix: "分鐘",
    days: {
      1: {
        title: "抵達台灣",
        activities: [
          {
            title: "抵達桃園國際機場",
            location: "桃園國際機場第一航廈",
            description: "搭乘機場捷運前往新北市",
          },
          {
            title: "抵達住宿地點",
            location: "新北吉安公園（外婆家）",
            description: "放置行李，稍作休息",
          },
          {
            title: "新北市美術館",
            location: "新北市板橋區",
            description: "參觀新北市美術館，欣賞藝術展覽",
          },
          {
            title: "東窩溪螢火蟲生態區",
            location: "新竹縣橫山鄉",
            description: "探訪螢火蟲生態保護區，了解當地生態環境",
          },
          {
            title: "返回住宿地點",
            location: "新北吉安公園（外婆家）",
            description: "結束第一天行程，返回住宿地點休息",
          },
        ],
      },
      2: {
        title: "主題樂園之旅",
        activities: [
          {
            title: "出發前往六福村",
            location: "新北吉安公園（外婆家）",
            description: "從住宿地點出發前往六福村主題遊樂園",
          },
          {
            title: "六福村主題遊樂園",
            location: "新竹縣關西鎮",
            description: "體驗台灣知名主題樂園的各種遊樂設施",
          },
          {
            title: "新北市烘爐地南山福德宮",
            location: "新北市中和區",
            description: "參觀知名廟宇，欣賞俯瞰台北盆地的夜景",
          },
          {
            title: "返回住宿地點",
            location: "新北吉安公園（外婆家）",
            description: "結束第二天行程，返回住宿地點休息",
          },
        ],
      },
      3: {
        title: "與Emily相約台北信義區",
        activities: [
          {
            title: "與Emily會面",
            location: "台北市",
            locationEn: "Taipei City",
            description: "見面地點還沒決定",
          },
          {
            title: "國立國父紀念館",
            location: "台北市信義區",
            description: "參觀紀念國父孫中山先生的建築",
          },
          {
            title: "鼎泰豐101店",
            location: "台北市信義區",
            description: "享用米其林一星餐廳的小籠包",
          },
          {
            title: "台北101觀景台",
            location: "台北市信義區",
            description: "① 平價方案 NT$150：88樓天際線咖啡外帶區觀景\n② 豪華方案 NT$600：觀景台門票，可前往戶外觀景台",
          },
          {
            title: "象山步道",
            location: "台北市信義區",
            description: "健行象山步道，欣賞台北101和市區景色",
          },
          {
            title: "通化街夜市",
            location: "台北市大安區",
            description: "品嚐在地美食小吃",
          },
          {
            title: "返回住宿地點",
            location: "新北吉安公園（外婆家）",
            description: "結束一天行程，返回住宿",
          }
        ],
      },
      4: {
        title: "台北市區探索",
        activities: [
          {
            title: "中正紀念堂",
            location: "台北市中正區",
            description: "參觀台灣重要的歷史建築",
          },
          {
            title: "迪化街",
            location: "台北市大同區",
            description: "探索台北的歷史街道，購買特產和紀念品",
          },
          {
            title: "西門町",
            location: "台北市萬華區",
            description: "台北的時尚中心，購物和美食天堂",
          },
          {
            title: "密室逃脫",
            titleEn: "Escape Room",
            location: "台北市萬華區",
            description: "恐怖主題解謎遊戲",
          },
          {
            title: "龍山寺",
            titleEn: "Lungshan Temple",
            location: "台北市萬華區",
            description: "參觀台灣著名的古廟",
          },
          {
            title: "返回住宿",
            titleEn: "Return to Accommodation",
            location: "新北吉安公園（外婆家）",
            description: "結束市區觀光，返回住宿",
          },
        ],
      },
      5: {
        title: "五星級飯店",
        activities: [
          {
            title: "準備搬家",
            location: "新北吉安公園（外婆家）",
            description: "打包行李",
          },
          {
            title: "入住飯店",
            location: "台北圓山大飯店",
            description: "入住台北圓山大飯店",
          },
          {
            title: "士林夜市",
            location: "台北市士林區",
            description: "台北最著名的夜市之一，品嚐各式小吃",
          },
          {
            title: "返回飯店",
            location: "台北圓山大飯店",
            description: "結束一天行程，返回飯店",
          },
        ],
      },
      6: {
        title: "陽明山與淡水",
        activities: [
          {
            title: "擎天崗",
            location: "台北市北投區",
            description: "欣賞陽明山的草原景色",
          },
          {
            title: "淡水老街",
            location: "新北市淡水區",
            description: "探索充滿歷史的老街，品嚐在地美食",
          },
          {
            title: "紅毛城",
            location: "新北市淡水區",
            description: "參觀1644年荷蘭人建造的城堡，了解台灣早期歷史",
          },
          {
            title: "淡水漁人碼頭",
            location: "淡水河畔",
            description: "欣賞著名的淡水夕陽美景",
          },
          {
            title: "返回飯店",
            location: "台北圓山大飯店",
            description: "結束一天行程，返回飯店",
          },
        ],
      },
      7: {
        title: "與Sophia會面",
        activities: [
          {
            title: "退房",
            location: "台北圓山大飯店",
            description: "辦理飯店退房手續",
          },
          {
            title: "返回外婆家",
            location: "新北吉安公園（外婆家）",
            description: "存放行李",
          },
          {
            title: "與Sophia見面",
            location: "台北市",
            description: "一起吃午餐",
          },
          {
            title: "返回外婆家",
            location: "新北吉安公園（外婆家）",
            description: "結束一天行程，返回住宿",
          },
        ],
      },
      8: {
        title: "九份一日遊",
        activities: [
          {
            title: "猴硐貓村",
            location: "新北市瑞芳區",
            description: "參觀以貓咪聞名的村落",
          },
          {
            title: "九份老街",
            location: "新北市瑞芳區",
            description: "探索懷舊山城，品嚐在地美食",
          },
          {
            title: "金瓜石黃金博物館",
            location: "新北市瑞芳區",
            description: "參觀昔日的採金區，了解採礦歷史",
          },
          {
            title: "報時山觀景台",
            location: "新北市瑞芳區",
            description: "欣賞基隆嶼和東北角海岸風景",
          },
          {
            title: "平溪老街",
            location: "新北市平溪區",
            description: "體驗放天燈",
          },
          {
            title: "返回住宿",
            location: "新北吉安公園（外婆家）",
            description: "結束一天行程，返回住宿",
          },
        ],
      },
      9: {
        title: "離開台灣",
        activities: [
          {
            title: "最後購物",
            location: "台北市信義區",
            description: "購買最後的紀念品",
          },
          {
            title: "外婆家",
            location: "新北吉安公園（外婆家）",
            description: "打包行李，準備前往桃園機場",
          },
          {
            title: "搭乘02:40航班離開台灣",
            location: "桃園國際機場第一航廈",
            description: "結束台灣之旅",
          },
        ],
      },
    },
  },
  en: {
    dayPrefix: "Day ",
    daySuffix: "",
    transportation: "Transportation",
    duration: "Duration",
    sectionTitle: "Itinerary",
    arrivalTime: "Arrival Time",
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    transportTypes: {
      car: "Drive",
      mrt: "MRT",
      bus: "Bus",
      hsr: "HSR",
      train: "Train",
      walk: "Walk",
      "mrt&train": "MRT & Train",
      "mrt&bus": "MRT & Bus",
      "bus&mrt": "Bus & MRT",
      "hsr&car": "HSR & Drive",
      "airport-mrt": "Airport MRT"
    },
    durationPrefix: "About ",
    durationSuffix: " min",
    days: {
      1: {
        title: "Arrival in Taiwan",
        activities: [
          {
            title: "Arrive at Taoyuan International Airport",
            location: "Taiwan Taoyuan International Airport Terminal 1",
            description: "Take the airport MRT to New Taipei City",
          },
          {
            title: "Arrive at Accommodation",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "Store luggage and take a short rest",
          },
          {
            title: "New Taipei City Art Museum",
            location: "Banqiao District, New Taipei City",
            description: "Visit the New Taipei City Art Museum and appreciate art exhibitions",
          },
          {
            title: "Dongwo Creek Firefly Ecological Area",
            location: "Hengshan Township, Hsinchu County",
            description: "Explore the firefly ecological conservation area and learn about local ecology",
          },
          {
            title: "Return to Accommodation",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "End of day one, return to accommodation for rest",
          },
        ],
      },
      2: {
        title: "Theme Park Adventure",
        activities: [
          {
            title: "Depart for Leofoo Village",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "Depart from accommodation to Leofoo Village Theme Park",
          },
          {
            title: "Leofoo Village Theme Park",
            location: "Guanxi Township, Hsinchu County",
            description: "Experience various attractions at Taiwan's famous theme park",
          },
          {
            title: "Nanshan Fude Temple",
            location: "Zhonghe District, New Taipei City",
            description: "Visit the famous temple and enjoy the night view of Taipei Basin",
          },
          {
            title: "Return to Accommodation",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "End of day two, return to accommodation for rest",
          },
        ],
      },
      3: {
        title: "Meeting Emily in Xinyi District",
        activities: [
          {
            title: "Meet Emily",
            location: "Taipei City",
            description: "Meeting location to be determined",
          },
          {
            title: "Sun Yat-sen Memorial Hall",
            location: "Xinyi District, Taipei City",
            description: "Visit the memorial hall dedicated to Dr. Sun Yat-sen",
          },
          {
            title: "Din Tai Fung (Taipei 101)",
            location: "Xinyi District, Taipei City",
            description: "Enjoy xiaolongbao at the Michelin-starred restaurant",
          },
          {
            title: "Taipei 101 Observatory",
            location: "Xinyi District, Taipei City",
            description: "① Budget Plan NT$150: Viewing area at 88F Skyline Cafe.\n② Premium Plan NT$600: Observatory ticket with outdoor deck access.",
          },
          {
            title: "Elephant Mountain Trail",
            location: "Xinyi District, Taipei City",
            description: "Hike Elephant Mountain for panoramic views of Taipei 101 and the city",
          },
          {
            title: "Tonghua Night Market",
            location: "Da'an District, Taipei City",
            description: "Taste local street food delicacies",
          },
          {
            title: "Return to Accommodation",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "End of day tour, return to accommodation",
          },
        ],
      },
      4: {
        title: "Taipei City Exploration",
        titleEn: "Taipei City Exploration",
        activities: [
          {
            title: "Chiang Kai-shek Memorial Hall",
            titleEn: "Chiang Kai-shek Memorial Hall",
            location: "Zhongzheng District, Taipei City",
            locationEn: "Zhongzheng District, Taipei City",
            description: "Visit an important historical building in Taiwan",
            descriptionEn: "Visit an important historical building in Taiwan",
          },
          {
            title: "Dihua Street",
            titleEn: "Dihua Street",
            location: "Datong District, Taipei City",
            locationEn: "Datong District, Taipei City",
            description: "Explore Taipei's historic street, shop for specialty goods and souvenirs",
            descriptionEn: "Explore Taipei's historic street, shop for specialty goods and souvenirs",
          },
          {
            title: "Ximending",
            titleEn: "Ximending",
            location: "Wanhua District, Taipei City",
            description: "Taipei's fashion center, shopping and food paradise",
          },
          {
            title: "Escape Room",
            location: "Wanhua District, Taipei City",
            description: "Horror-themed puzzle game",
          },
          {
            title: "Lungshan Temple",
            location: "Wanhua District, Taipei City",
            description: "Visit Taiwan's famous ancient temple",
          },
          {
            title: "Return to Accommodation",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "End of city tour, return to accommodation",
          },
        ],
      },
      5: {
        title: "Five-Star Hotel",
        activities: [
          {
            title: "Prepare to Move",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "Pack luggage",
          },
          {
            title: "Check-in",
            location: "The Grand Hotel Taipei",
            description: "Check in at The Grand Hotel Taipei",
          },
          {
            title: "Shilin Night Market",
            location: "Shilin District, Taipei City",
            description: "One of Taipei's most famous night markets, taste various street foods",
          },
          {
            title: "Return to Hotel",
            location: "The Grand Hotel Taipei",
            description: "End of day tour, return to hotel",
          },
        ],
      },
      6: {
        title: "Yangmingshan and Tamsui",
        activities: [
          {
            title: "Qingtiangang",
            location: "Beitou District, Taipei City",
            description: "Enjoy the grassland scenery of Yangmingshan",
          },
          {
            title: "Tamsui Old Street",
            location: "Tamsui District, New Taipei City",
            description: "Explore the historic street filled with history, taste local specialties",
          },
          {
            title: "Fort San Domingo",
            location: "Tamsui District, New Taipei City",
            description: "Visit the fort built by the Dutch in 1644, learn about Taiwan's early history",
          },
          {
            title: "Tamsui Fisherman's Wharf",
            location: "Tamsui Riverside",
            description: "Enjoy the famous Tamsui sunset view",
          },
          {
            title: "Return to Hotel",
            location: "The Grand Hotel Taipei",
            description: "End of day tour, return to hotel",
          },
        ],
      },
      7: {
        title: "Meeting Sophia",
        activities: [
          {
            title: "Check-out",
            location: "The Grand Hotel Taipei",
            description: "Check out from hotel",
          },
          {
            title: "Return to Grandma's House",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "Store luggage",
          },
          {
            title: "Meet Sophia",
            location: "Taipei City",
            description: "Have lunch",
          },
          {
            title: "Return to Grandma's House",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "End of day tour, return to accommodation",
          },
        ],
      },
      8: {
        title: "Jiufen Day Tour",
        activities: [
          {
            title: "Houtong Cat Village",
            location: "Ruifang District, New Taipei City",
            description: "Visit the village famous for its cats",
          },
          {
            title: "Jiufen Old Street",
            location: "Ruifang District, New Taipei City",
            description: "Explore the nostalgic mountain town, taste local specialties",
          },
          {
            title: "Jinguashi Gold Ecological Park",
            location: "Ruifang District, New Taipei City",
            description: "Visit the former gold mining area, learn about mining history",
          },
          {
            title: "Baoshi Mountain Observation Deck",
            location: "Ruifang District, New Taipei City",
            description: "Enjoy views of Keelung Islet and the northeast coast",
          },
          {
            title: "Pingxi Old Street",
            location: "Pingxi District, New Taipei City",
            description: "Experience releasing sky lanterns",
          },
          {
            title: "Return to Accommodation",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "End of day tour, return to accommodation",
          },
        ],
      },
      9: {
        title: "Leaving Taiwan",
        activities: [
          {
            title: "Final Shopping",
            location: "Xinyi District, Taipei City",
            description: "Buy last-minute souvenirs",
          },
          {
            title: "Grandma's House",
            location: "Ji'an Park, New Taipei City (Grandma's House)",
            description: "Pack luggage, prepare for departure to Taoyuan Airport",
          },
          {
            title: "Take 02:40 Flight Departing Taiwan",
            location: "Taiwan Taoyuan International Airport T1",
            description: "End of Taiwan journey",
          },
        ],
      },
    },
  },
  ja: {
    dayPrefix: "",
    daySuffix: "日目",
    transportation: "交通手段",
    duration: "所要時間",
    sectionTitle: "旅程プラン",
    arrivalTime: "到着時間",
    weekdays: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
    weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
    transportTypes: {
      car: "車",
      mrt: "MRT",
      bus: "バス",
      hsr: "高速鉄道",
      train: "電車",
      walk: "徒歩",
      "mrt&train": "MRT & 電車",
      "mrt&bus": "MRT & バス",
      "bus&mrt": "バス & MRT",
      "hsr&car": "高速鉄道 & 車",
      "airport-mrt": "空港MRT"
    },
    durationPrefix: "約",
    durationSuffix: "分",
    days: {
      1: {
        title: "台湾到着",
        activities: [
          {
            title: "桃園国際空港に到着",
            location: "台湾桃園国際空港第1ターミナル",
            description: "空港MRTで新北市へ移動",
          },
          {
            title: "宿泊地に到着",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "荷物を置いて、少し休憩",
          },
          {
            title: "新北市立美術館",
            location: "新北市板橋区",
            description: "新北市立美術館を見学し、芸術展示を鑑賞",
          },
          {
            title: "東窩渓ホタル生態区",
            location: "新竹県横山郷",
            description: "ホタルの生態保護区を訪れ、地域の生態系について学ぶ",
          },
          {
            title: "宿泊地に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "1日目の行程を終え、宿泊地で休憩",
          },
        ],
      },
      2: {
        title: "テーマパークの旅",
        activities: [
          {
            title: "六福村へ出発",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "宿泊地から六福村テーマパークへ向かう",
          },
          {
            title: "六福村テーマパーク",
            location: "新竹県関西鎮",
            description: "台湾の有名なテーマパークで様々なアトラクションを体験",
          },
          {
            title: "南山福徳宮",
            location: "新北市中和区",
            description: "有名な寺院を訪れ、台北盆地の夜景を楽しむ",
          },
          {
            title: "宿泊地に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "2日目の行程を終え、宿泊地で休憩",
          },
        ],
      },
      3: {
        title: "Emilyと信義区デート",
        activities: [
          {
            title: "Emilyと待ち合わせ",
            location: "台北市",
            description: "待ち合わせ場所未定",
          },
          {
            title: "国父紀念館",
            location: "台北市信義区",
            description: "孫文を記念する建物を見学",
          },
          {
            title: "鼎泰豐台北101店",
            location: "台北市信義区",
            description: "ミシュラン一つ星の小籠包を堪能",
          },
          {
            title: "台北101展望台",
            location: "台北市信義区",
            description: "① お手頃プラン NT$150：88階スカイラインカフェの立ち飲みエリア。\n② 贅沢プラン NT$600：展望台チケット（屋外デッキ付き）。",
          },
          {
            title: "象山ハイキングコース",
            location: "台北市信義区",
            description: "象山を登り、台北101と市街の景色を一望",
          },
          {
            title: "通化街ナイトマーケット",
            location: "台北市大安区",
            description: "地元の屋台グルメを楽しむ",
          },
          {
            title: "宿泊地に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "一日の観光を終え、宿泊地に戻る",
          }
        ],
      },
      4: {
        title: "台北市内観光",
        activities: [
          {
            title: "中正紀念堂",
            location: "台北市中正区",
            description: "台湾の重要な歴史的建造物を見学",
          },
          {
            title: "迪化の古い町並み",
            location: "台北市大同区",
            description: "台北の歴史ある通りで特産品やお土産を購入",
          },
          {
            title: "西門町",
            location: "台北市万華区",
            description: "台北のファッションの中心地、ショッピングとグルメの天国",
          },
          {
            title: "密室脱出",
            location: "台北市万華区",
            description: "ホラーテーマの謎解きゲーム",
          },
          {
            title: "龍山寺",
            location: "台北市万華区",
            description: "台湾の有名な古寺を参拝",
          },
          {
            title: "宿泊地に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "市内観光を終え、宿泊地に戻る",
          },
        ],
      },
      5: {
        title: "五つ星ホテル",
        activities: [
          {
            title: "引っ越し準備",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "荷物の整理",
          },
          {
            title: "チェックイン",
            location: "圓山大飯店",
            description: "圓山大飯店でチェックイン手続き",
          },
          {
            title: "士林ナイトマーケット",
            location: "台北市士林区",
            description: "台北の有名なナイトマーケットで様々な屋台料理を楽しむ",
          },
          {
            title: "ホテルに戻る",
            location: "圓山大飯店",
            description: "一日の観光を終え、ホテルに戻る",
          },
        ],
      },
      6: {
        title: "陽明山と淡水",
        activities: [
          {
            title: "擎天崗",
            location: "台北市北投区",
            description: "陽明山の草原風景を楽しむ",
          },
          {
            title: "淡水の古い町並み",
            location: "新北市淡水区",
            description: "歴史情緒あふれる淡水の古い町並みを散策し、名物グルメを楽しむ",
          },
          {
            title: "紅毛城",
            location: "新北市淡水区",
            description: "1644年にオランダ人が建てた城塞を見学し、台湾の歴史を学ぶ",
          },
          {
            title: "淡水漁人埠頭",
            location: "淡水河畔",
            description: "有名な淡水の夕日を鑑賞",
          },
          {
            title: "宿泊地に戻る",
            location: "圓山大飯店",
            description: "一日の観光を終え、宿泊地に戻る",
          },
        ],
      },
      7: {
        title: "Sophiaと会う",
        activities: [
          {
            title: "チェックアウト",
            location: "圓山大飯店",
            description: "チェックアウト手続き",
          },
          {
            title: "おばあちゃんの家に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "荷物を置く",
          },
          {
            title: "Sophiaと会う",
            location: "台北市",
            description: "ランチを食べる",
          },
          {
            title: "おばあちゃんの家に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "一日の観光を終え、宿泊地に戻る",
          },
        ],
      },
      8: {
        title: "九份日帰り旅行",
        activities: [
          {
            title: "猴硐猫村",
            location: "新北市瑞芳区",
            description: "猫で有名な村を訪れる",
          },
          {
            title: "九份の古い町並み",
            location: "新北市瑞芳区",
            description: "ノスタルジックな山の町を探索し、名物グルメを楽しむ",
          },
          {
            title: "金瓜石",
            location: "新北市瑞芳区",
            description: "かつての金鉱跡地を見学し、採掘の歴史を学ぶ",
          },
          {
            title: "報時山展望台",
            location: "新北市瑞芳区",
            description: "基隆島と東北海岸線の絶景を楽しむ",
          },
          {
            title: "平渓の古い町並み",
            location: "新北市平渓区",
            description: "天燈上げを体験",
          },
          {
            title: "宿泊地に戻る",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "一日の観光を終え、宿泊地に戻る",
          },
        ],
      },
      9: {
        title: "台湾出発",
        activities: [
          {
            title: "最後の買い物",
            location: "台北市信義区",
            description: "最後のお土産を購入",
          },
          {
            title: "おばあちゃんの家",
            location: "新北市新店区吉安公園(おばあちゃんの家)",
            description: "荷物をまとめ、桃園空港へ向けて準備",
          },
          {
            title: "02:40発の便で台湾を出発",
            location: "台湾桃園国際空港第1ターミナル",
            description: "台湾の旅を終える",
          },
        ],
      },
    },
  },
}

// Updated itinerary data with new day-by-day schedule
const itineraryData = [
  {
    day: 1,
    date: format(startDate, "yyyy-MM-dd"),
    activities: [
      {
        time: "08:35",
        icon: "plane",
        image: "/attractions/桃園機場.jpg"
      },
      {
        time: "10:00",
        transportation: "開車",
        duration: "約60分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
      {
        time: "15:40",
        transportation: "開車",
        duration: "約40分鐘",
        icon: "camera",
        image: "/attractions/新北市美術館.jpg"
      },
      {
        time: "18:30",
        transportation: "開車",
        duration: "約60分鐘",
        icon: "camera",
        image: "/attractions/東窩溪螢火蟲生態區.jpeg"
      },
      {
        time: "21:40",
        transportation: "開車",
        duration: "約100分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
    ],
  },
  {
    day: 2,
    date: format(addDays(startDate, 1), "yyyy-MM-dd"),
    activities: [
      {
        time: "06:30",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
      {
        time: "08:00",
        transportation: "開車",
        duration: "約90分鐘",
        icon: "camera",
        image: "/attractions/六福村.jpg"
      },
      {
        time: "20:30",
        transportation: "開車",
        duration: "約90分鐘",
        icon: "camera",
        image: "/attractions/新北市烘爐地南山福德宮.jpg"
      },
      {
        time: "21:20",
        transportation: "開車",
        duration: "約20分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
    ],
  },
  {
    day: 3,
    date: format(addDays(startDate, 2), "yyyy-MM-dd"),
    activities: [
      {
        time: "??",
        icon: "friend",
        image: "/attractions/Friends.png"
      },
      {
        time: "??",
        icon: "camera",
        image: "/attractions/國父紀念館.jpg"
      },
      {
        time: "??",
        icon: "utensils",
        image: "/attractions/鼎泰豐101店.jpg"
      },
      {
        time: "??",
        icon: "camera",
        image: "/attractions/台北101.jpeg"
      },
      {
        time: "??",
        icon: "camera",
        image: "/attractions/象山步道景色.jpg"
      },
      {
        time: "??",
        icon: "utensils",
        image: "/attractions/通化街夜市美食.jpg"
      },
      {
        time: "??",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      }
    ],
  },
  {
    day: 4,
    date: format(addDays(startDate, 3), "yyyy-MM-dd"),
    activities: [
      {
        time: "10:00",
        transportation: "開車",
        duration: "約40分鐘",
        icon: "camera",
        image: "/attractions/中正紀念堂.jpg"
      },
      {
        time: "11:20",
        transportation: "開車",
        duration: "約20分鐘",
        icon: "utensils",
        image: "/attractions/迪化街.jpg"
      },
      {
        time: "14:00",
        transportation: "開車",
        duration: "約15分鐘",
        icon: "utensils",
        image: "/attractions/西門町.jpg"
      },
      {
        time: "15:00",
        transportation: "開車",
        duration: "約15分鐘",
        icon: "camera",
        image: "/attractions/alert.jpg"
      },
      {
        time: "19:00",
        transportation: "開車",
        duration: "約10分鐘",
        icon: "camera",
        image: "/attractions/艋舺龍山寺.webp"
      },
      {
        time: "21:30",
        transportation: "開車",
        duration: "約30分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
    ],
  },
  {
    day: 5,
    date: format(addDays(startDate, 4), "yyyy-MM-dd"),
    activities: [
      {
        time: "13:50",
        transportation: "開車",
        duration: "約50分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
      {
        time: "15:00",
        transportation: "開車",
        duration: "約45分鐘",
        icon: "hotel",
        image: "/attractions/圓山大飯店.jpg"
      },
      {
        time: "20:00",
        transportation: "開車",
        duration: "約15分鐘",
        icon: "utensils",
        image: "/attractions/士林夜市.jpg"
      },
      {
        time: "22:00",
        transportation: "開車",
        duration: "約20分鐘",
        icon: "hotel",
        image: "/attractions/圓山大飯店.jpg"
      },
    ],
  },
  {
    day: 6,
    date: format(addDays(startDate, 5), "yyyy-MM-dd"),
    activities: [
      {
        time: "10:00",
        transportation: "開車",
        duration: "約60分鐘",
        icon: "camera",
        image: "/attractions/擎天崗.jpg"
      },
      {
        time: "12:00",
        transportation: "開車",
        duration: "約70分鐘",
        icon: "utensils",
        image: "/attractions/淡水老街.png"
      },
      {
        time: "15:00",
        transportation: "步行",
        duration: "約15分鐘",
        icon: "camera",
        image: "/attractions/淡水紅毛城.png"
      },
      {
        time: "18:00",
        icon: "camera",
        image: "/attractions/淡水漁人碼頭.jpg"
      },
      {
        time: "20:45",
        transportation: "開車",
        duration: "約45分鐘",
        icon: "hotel",
        image: "/attractions/圓山大飯店.jpg"
      },
    ],
  },
  {
    day: 7,
    date: format(addDays(startDate, 6), "yyyy-MM-dd"),
    activities: [
      {
        time: "11:00",
        icon: "hotel",
        image: "/attractions/圓山大飯店.jpg"
      },
      {
        time: "12:00",
        transportation: "開車",
        duration: "約45分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
      {
        time: "??",
        icon: "utensils",
        image: "/attractions/Friends.png"
      },
      {
        time: "??",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
    ],
  },
  {
    day: 8,
    date: format(addDays(startDate, 7), "yyyy-MM-dd"),
    activities: [
      {
        time: "10:00",
        transportation: "捷運&火車",
        duration: "約70分鐘",
        icon: "camera",
        image: "/attractions/侯硐貓村.jpg"
      },
      {
        time: "11:40",
        transportation: "捷運&公車",
        duration: "約40分鐘",
        icon: "camera",
        image: "/attractions/九份老街.jpg"
      },
      {
        time: "13:30",
        transportation: "步行",
        duration: "約30分鐘",
        icon: "camera",
        image: "/attractions/新北市金瓜石.jpg"
      },
      {
        time: "15:30",
        transportation: "步行",
        duration: "約30分鐘",
        icon: "camera",
        image: "/attractions/新北市報時山觀景臺.jpg"
      },
      {
        time: "18:30",
        transportation: "捷運&火車",
        duration: "約30分鐘",
        icon: "camera",
        image: "/attractions/平溪老街.jpg"
      },
      {
        time: "22:30",
        transportation: "公車&捷運",
        duration: "約150分鐘",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
    ],
  },
  {
    day: 9,
    date: format(addDays(startDate, 8), "yyyy-MM-dd"),
    activities: [
      {
        time: "??",
        title: "最後購物",
        location: "台北市信義區",
        description: "購買最後的伴手禮",
        icon: "shopping-cart",
        image: "/attractions/alert.jpg"
      },
      {
        time: "20:00",
        title: "外婆家",
        location: "新北吉安公園（外婆家）",
        description: "收拾行李，準備前往桃園機場",
        icon: "hotel",
        image: "/attractions/新北市新店區吉安公園(外婆家).jpg"
      },
      {
        time: "00:00",
        title: "搭02:40乘航班離開台灣",
        location: "Taiwan Taoyuan International Airport T1",
        description: "結束台灣之旅",
        transportation: "開車",
        duration: "約50分鐘",
        icon: "plane",
        image: "/attractions/桃園機場.jpg"
      },
    ],
  },
]

// Types and Interfaces
interface Activity {
  time: string;
  title: string;
  location: string;
  description: string;
  transportation?: string;
  duration?: string;
  icon: string;
  image?: string;
}

interface DayData {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

interface TranslatedActivity {
  title: string;
  location: string;
  description: string;
}

interface DayTranslation {
  title: string;
  activities: TranslatedActivity[];
}

interface LanguageTranslation {
  dayPrefix: string;
  daySuffix: string;
  transportation: string;
  duration: string;
  days: {
    [key: number]: DayTranslation;
  };
}

interface Translations {
  zh: LanguageTranslation;
  en: LanguageTranslation;
  ja: LanguageTranslation;
}

// Constants
const TRANSPORTATION_ICONS = {
  "開車": Car,
  "捷運": Train,
  "公車": Bus,
  "高鐵": Train,
  "機場捷運": Train,
  "火車": Train,
  "步行": "🚶",
  "捷運&火車": Train,
  "捷運&公車": Bus,
  "公車&捷運": Train,
  "高鐵&開車": Train,
} as const;

const ACTIVITY_ICONS = {
  camera: Camera,
  hotel: Hotel,
  coffee: Coffee,
  utensils: Utensils,//food
  bus: Bus,
  train: Train,
  plane: Plane,
  "shopping-cart": ShoppingCart,
} as const;

const LANGUAGE_FONT_CLASSES = {
  zh: "font-noto-tc",
  en: "font-inter",
  ja: "font-noto-jp"
} as const;

// Helper Functions
const getActivityIconComponent = (iconName: string) => {
  const IconComponent = ACTIVITY_ICONS[iconName as keyof typeof ACTIVITY_ICONS];
  return IconComponent ? <IconComponent size={14} /> : <MapPin size={14} />;
};

const getTransportationIcon = (transportation: string | undefined) => {
  if (!transportation) return null;
  
  const IconComponent = TRANSPORTATION_ICONS[transportation as keyof typeof TRANSPORTATION_ICONS];
  if (IconComponent === "🚶") return IconComponent;
  return IconComponent ? <IconComponent className="text-brand-primary" size={14} /> : null;
};

// Helper function to get activity title based on language
const getLocalizedActivityData = (activity: any, dayNumber: number, activityIndex: number, lang: string) => {
  const dayTranslations = translations[lang as keyof typeof translations].days[dayNumber as keyof typeof translations.zh.days];
  if (dayTranslations && dayTranslations.activities[activityIndex]) {
    return {
      title: dayTranslations.activities[activityIndex].title,
      location: dayTranslations.activities[activityIndex].location,
      description: dayTranslations.activities[activityIndex].description,
    };
  }
  return {
    title: activity.title,
    location: activity.location,
    description: activity.description,
  };
};

// Helper function to get day title based on language
const getLocalizedDayTitle = (day: any, lang: string) => {
  const dayTranslations = translations[lang as keyof typeof translations].days[day.day as keyof typeof translations.zh.days];
  if (dayTranslations) {
    return dayTranslations.title;
  }
  return day.title;
};

// Helper function to get localized transportation type
const getLocalizedTransportation = (transportation: string | undefined, lang: string) => {
  if (!transportation) return "";
  
  // 建立交通方式的對照表
  const transportationMap: { [key: string]: { [lang: string]: string } } = {
    "開車": {
      "zh": "開車",
      "en": "Drive",
      "ja": "車"
    },
    "捷運": {
      "zh": "捷運",
      "en": "MRT",
      "ja": "MRT"
    },
    "公車": {
      "zh": "公車",
      "en": "Bus",
      "ja": "バス"
    },
    "高鐵": {
      "zh": "高鐵",
      "en": "HSR",
      "ja": "高速鉄道"
    },
    "火車": {
      "zh": "火車",
      "en": "Train",
      "ja": "電車"
    },
    "步行": {
      "zh": "步行",
      "en": "Walk",
      "ja": "徒歩"
    },
    "捷運&火車": {
      "zh": "捷運&火車",
      "en": "MRT & Train",
      "ja": "MRT & 電車"
    },
    "捷運&公車": {
      "zh": "捷運&公車",
      "en": "MRT & Bus",
      "ja": "MRT & バス"
    },
    "公車&捷運": {
      "zh": "公車&捷運",
      "en": "Bus & MRT",
      "ja": "バス & MRT"
    },
    "高鐵&開車": {
      "zh": "高鐵&開車",
      "en": "HSR & Drive",
      "ja": "高速鉄道 & 車"
    },
    "機場捷運": {
      "zh": "機場捷運",
      "en": "Airport MRT",
      "ja": "空港MRT"
    }
  };

  return transportationMap[transportation]?.[lang] || transportation;
};

// Helper function to get localized duration
const getLocalizedDuration = (duration: string | undefined, lang: string) => {
  if (!duration) return "";
  const t = translations[lang as keyof typeof translations];
  const minutes = duration.match(/\d+/)?.[0] || "";
  return `${t.durationPrefix}${minutes}${t.durationSuffix}`;
};

// 添加一個獲取星期的輔助函數
const getWeekdayName = (date: string, lang: string) => {
  const day = new Date(date).getDay();
  return translations[lang as keyof typeof translations].weekdays[day];
};

// 添加獲取星期縮寫的輔助函數
const getWeekdayShortName = (date: string, lang: string) => {
  const day = new Date(date).getDay();
  return translations[lang as keyof typeof translations].weekdaysShort[day];
};

export default function Itinerary() {
  const { currentLang } = useLanguage();
  const t = translations[currentLang as keyof typeof translations];
  const [selectedDay, setSelectedDay] = useState(1);
  const fontClass = LANGUAGE_FONT_CLASSES[currentLang as keyof typeof LANGUAGE_FONT_CLASSES];

  return (
    <section id="itinerary" className={`py-16 ${fontClass}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          <Calendar className="h-8 w-8 text-brand-primary" />
          <h2 className="text-3xl font-bold">{t.sectionTitle}</h2>
        </motion.div>
        
        <style jsx global>{`
          /* 繁體中文字體設定 */
          .font-noto-tc {
            font-family: "Noto Sans TC", system-ui, -apple-system, sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            letter-spacing: 0.025em;
          }
          
          /* 英文字體設定 */
          .font-inter {
            font-family: "Inter", system-ui, -apple-system, sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            letter-spacing: -0.01em;
          }
          
          /* 日文字體設定 */
          .font-noto-jp {
            font-family: "Noto Sans JP", system-ui, -apple-system, sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            letter-spacing: 0.025em;
          }
          
          /* 標題字重設定 */
          h2, h3, h4 {
            font-weight: 600;
          }
          
          /* 內文最佳行高設定 */
          p, .text-sm {
            line-height: 1.7;
          }
          
          /* 確保 CJK 文字間距適當 */
          .font-noto-tc, .font-noto-jp {
            text-align: justify;
            text-justify: inter-ideograph;
          }
        `}</style>
        
        <Tabs defaultValue="1" className="w-full" onValueChange={(value) => setSelectedDay(parseInt(value))}>
          <TabsList className="h-50 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1 bg-[#FFF4D6] mb-6 p-1 rounded-lg">
            {itineraryData.map((day) => (
              <TabsTrigger
                key={day.day}
                value={day.day.toString()}
                className={cn(
                  "data-[state=active]:bg-brand-primary data-[state=active]:text-white relative text-sm py-2 rounded-md transition-all",
                  "hover:bg-brand-primary/10",
                  day.day === 3 && "bg-pink-50 hover:bg-pink-100 text-pink-700",
                  day.day === 7 && "bg-sky-50 hover:bg-sky-100 text-sky-700"
                )}
              >
                <span>{t.dayPrefix}{day.day}{t.daySuffix}</span>
                {day.day === 3 && (
                  <span className="absolute -top-2 -right-2 bg-pink-200 text-pink-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    Emily
                  </span>
                )}
                {day.day === 7 && (
                  <span className="absolute -top-2 -right-2 bg-sky-200 text-sky-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    Sophia
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {itineraryData.map((day) => (
            <TabsContent key={day.day} value={day.day.toString()}>
              <Card>
                <CardContent className={cn(
                  "p-6 relative overflow-hidden",
                  // Special styling for days with friend meetings
                  day.day === 3 && "bg-pink-50/30",
                  day.day === 7 && "bg-sky-50/30"
                )}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    {/* Day indicator */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-brand-primary/5 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold">{t.dayPrefix}{day.day}{t.daySuffix}</span>
                        <span className="text-xs font-medium text-brand-primary/80">{getWeekdayShortName(day.date, currentLang)}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 ml-24 pt-2">
                      {format(new Date(day.date), 'MM/dd')} - {getLocalizedDayTitle(day, currentLang)}
                    </h3>
                    <div className="space-y-2 mt-8">
                      {day.activities.map((activity, index) => {
                        const localizedData = getLocalizedActivityData(activity, day.day, index, currentLang);
                        const isLast = index === day.activities.length - 1;
                        // 為不同類型的活動設置不同的漸變顏色
                        const iconColors = {
                          camera: "from-yellow-100 to-yellow-50 border-yellow-200 text-yellow-600",
                          hotel: "from-amber-700/30 to-amber-600/20 border-amber-700/40 text-amber-700",
                          coffee: "from-amber-100 to-amber-50 border-amber-200 text-amber-600",
                          //food
                          utensils: "from-orange-100 to-orange-50 border-orange-200 text-orange-600",
                          bus: "from-green-100 to-green-50 border-green-200 text-green-600",
                          train: "from-red-100 to-red-50 border-red-200 text-red-600",
                          plane: "from-sky-100 to-sky-50 border-sky-200 text-sky-600",
                          "shopping-cart": "from-emerald-100 to-emerald-50 border-emerald-200 text-emerald-600",
                        };
                        
                        const iconColor = iconColors[activity.icon as keyof typeof iconColors] || "from-brand-primary/20 to-brand-primary/5 border-brand-primary/30 text-brand-primary";
                        
                        return (
                          <div key={index} className="relative">
                            {/* 垂直連接線 */}
                            {!isLast && (
                              <div className="absolute left-8 top-16 w-0.5 h-[calc(100%-4rem)] bg-gradient-to-b from-brand-primary/30 to-brand-primary/10"></div>
                            )}
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="flex gap-4 pl-8 pr-8 mb-8"
                            >
                              <div className="flex-none relative z-10">
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  className={`w-16 h-16 bg-gradient-to-br ${iconColor} rounded-full flex items-center justify-center border-2 shadow-sm`}
                                >
                                  {getActivityIconComponent(activity.icon)}
                                </motion.div>
                              </div>
                              <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-brand-primary flex-shrink-0" />
                                  <span className="text-sm font-medium text-brand-textLight truncate">
                                    <span className="text-brand-textLight/70 mr-2">{t.arrivalTime}</span>
                                    {activity.time}
                                  </span>
                                </div>
                                <h4 className="text-lg font-medium mb-1 truncate">{localizedData.title}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="h-4 w-4 text-brand-primary flex-shrink-0" />
                                  <span className="text-sm text-brand-textLight truncate">{localizedData.location}</span>
                                </div>
                                <p className="text-sm text-brand-textLight mb-3 line-clamp-2">{localizedData.description}</p>
                                {activity.transportation && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2 bg-brand-primary/5 px-3 py-1.5 rounded-full">
                                      {getTransportationIcon(activity.transportation)}
                                      <span className="text-xs text-brand-textLight">
                                        {getLocalizedTransportation(activity.transportation, currentLang)}
                                      </span>
                                    </div>
                                    {activity.duration && (
                                      <div className="flex items-center gap-2 bg-brand-primary/5 px-3 py-1.5 rounded-full">
                                        <Clock className="h-3.5 w-3.5 text-brand-primary" />
                                        <span className="text-xs text-brand-textLight">
                                          {getLocalizedDuration(activity.duration, currentLang)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {activity.image && (
                                <div className="hidden sm:block flex-none">
                                  <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md"
                                  >
                                    <Image
                                      src={activity.image}
                                      alt={localizedData.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </motion.div>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
