// Define types for locations data
export interface LocalizedText {
  zh: string
  en: string
  ja: string
}

export interface Place {
  id: number
  name: LocalizedText
  lat: number
  lng: number
  description: LocalizedText
}

export interface LocationCategory {
  category: LocalizedText
  places: Place[]
}

// Shared locations data
export const locations: LocationCategory[] = [
  {
    category: {
      zh: "新北市",
      en: "New Taipei City",
      ja: "新北市"
    },
    places: [
      { 
        id: 1,
        name: {
          zh: "吉安公園 (外婆家)",
          en: "Ji'an Park (Grandma's House)",
          ja: "吉安公園（おばあちゃんの家）"
        },
        lat: 24.9667, 
        lng: 121.5333, 
        description: {
          zh: "住宿地點 (04/25-04/29、05/01-05/03)",
          en: "Accommodation (04/25-04/29, 05/01-05/03)",
          ja: "宿泊地 (04/25-04/29、05/01-05/03)"
        }
      },
      { 
        id: 26, 
        name: {
          zh: "烘爐地南山福德宮",
          en: "Nanshan Fude Temple",
          ja: "烘爐地南山福徳宮"
        },
        lat: 24.9908, 
        lng: 121.4825, 
        description: {
          zh: "知名廟宇，可俯瞰台北盆地夜景",
          en: "Famous temple with panoramic night views of Taipei Basin",
          ja: "有名な寺院、台北盆地の夜景を一望できる"
        }
      },
      { 
        id: 3, 
        name: {
          zh: "平溪老街",
          en: "Pingxi Old Street",
          ja: "平渓老街"
        },
        lat: 25.0249, 
        lng: 121.7385, 
        description: {
          zh: "體驗放天燈，探訪懷舊老街",
          en: "Experience sky lantern release and explore nostalgic old streets",
          ja: "天燈上げを体験し、懐かしい古い街並みを探索"
        }
      },
      { 
        id: 6, 
        name: {
          zh: "十分瀑布",
          en: "Shifen Waterfall",
          ja: "十分滝"
        },
        lat: 25.0425, 
        lng: 121.7768, 
        description: {
          zh: "台灣著名的瀑布景點",
          en: "Famous waterfall attraction in Taiwan",
          ja: "台湾の有名な滝の観光スポット"
        }
      },
      { 
        id: 24, 
        name: {
          zh: "猴硐貓村",
          en: "Houtong Cat Village",
          ja: "猴硐猫村"
        },
        lat: 25.0874, 
        lng: 121.8269, 
        description: {
          zh: "以貓咪聞名的小村莊",
          en: "A small village famous for its cats",
          ja: "猫で有名な小さな村"
        }
      },
      { 
        id: 4, 
        name: {
          zh: "九份老街",
          en: "Jiufen Old Street",
          ja: "九份老街"
        },
        lat: 25.1089, 
        lng: 121.8443, 
        description: {
          zh: "懷舊山城，電影《千與千尋》靈感來源地",
          en: "Nostalgic mountain town, inspiration for 'Spirited Away'",
          ja: "ノスタルジックな山の町、「千と千尋の神隠し」のインスピレーション源"
        }
      },
      { 
        id: 7, 
        name: {
          zh: "金瓜石",
          en: "Jinguashi",
          ja: "金瓜石"
        },
        lat: 25.1069, 
        lng: 121.8603, 
        description: {
          zh: "昔日的採金礦區，了解採礦歷史",
          en: "Former gold mining area, learn about mining history",
          ja: "かつての金鉱地域、採掘の歴史を学ぶ"
        }
      },
      { 
        id: 8, 
        name: {
          zh: "報時山觀景臺",
          en: "Baoshi Mountain Observation Deck",
          ja: "報時山展望台"
        },
        lat: 25.1214, 
        lng: 121.8631, 
        description: {
          zh: "欣賞基隆嶼及東北角海岸線的絕美景色",
          en: "Enjoy beautiful views of Keelung Islet and the northeast coast",
          ja: "基隆島と東北部海岸線の絶景を楽しむ"
        }
      },
      { 
        id: 9, 
        name: {
          zh: "新北市美術館",
          en: "New Taipei City Art Museum",
          ja: "新北市美術館"
        },
        lat: 25.0095, 
        lng: 121.4613, 
        description: {
          zh: "新北市重要的藝術展覽場所",
          en: "An important art exhibition venue in New Taipei City",
          ja: "新北市の重要な芸術展示施設"
        }
      },
      { 
        id: 25, 
        name: {
          zh: "淡水老街",
          en: "Tamsui Old Street",
          ja: "淡水老街"
        },
        lat: 25.1726, 
        lng: 121.4389, 
        description: {
          zh: "充滿歷史風情的老街",
          en: "Historic street full of charm",
          ja: "歴史的な雰囲気漂う古い通り"
        }
      },
      { 
        id: 27, 
        name: {
          zh: "淡水紅毛城",
          en: "Fort San Domingo",
          ja: "淡水紅毛城"
        },
        lat: 25.1756, 
        lng: 121.4588, 
        description: {
          zh: "荷蘭人在1644年建造的古堡，台灣重要歷史古蹟",
          en: "Historic fort built by the Dutch in 1644, important Taiwan heritage site",
          ja: "1644年にオランダ人が建造した城、台湾の重要な史跡"
        }
      }
    ],
  },
  {
    category: {
      zh: "台北市",
      en: "Taipei City",
      ja: "台北市"
    },
    places: [
      { 
        id: 15, 
        name: {
          zh: "西門町",
          en: "Ximending",
          ja: "西門町"
        },
        lat: 25.0421, 
        lng: 121.5074, 
        description: {
          zh: "台北潮流中心，購物與美食天堂",
          en: "Taipei's fashion center, shopping and food paradise",
          ja: "台北のトレンドの中心地、ショッピングとグルメの天国"
        }
      },
      { 
        id: 16, 
        name: {
          zh: "艋舺龍山寺",
          en: "Lungshan Temple",
          ja: "艋舺龍山寺"
        },
        lat: 25.0371, 
        lng: 121.4997, 
        description: {
          zh: "台灣著名的古廟",
          en: "Famous historic temple in Taiwan",
          ja: "台湾の有名な古寺"
        }
      },
      { 
        id: 17, 
        name: {
          zh: "迪化街",
          en: "Dihua Street",
          ja: "迪化街"
        },
        lat: 25.0687, 
        lng: 121.5103, 
        description: {
          zh: "台北老街，傳統商品與伴手禮",
          en: "Taipei's old street, traditional goods and souvenirs",
          ja: "台北の古い通り、伝統的な商品とお土産"
        }
      },
      { 
        id: 18, 
        name: {
          zh: "國立中正紀念堂",
          en: "Chiang Kai-shek Memorial Hall",
          ja: "国立中正紀念堂"
        },
        lat: 25.0347, 
        lng: 121.5199, 
        description: {
          zh: "台灣重要歷史建築",
          en: "Important historical building in Taiwan",
          ja: "台湾の重要な歴史的建造物"
        }
      },
      { 
        id: 19, 
        name: {
          zh: "國立國父紀念館",
          en: "Sun Yat-sen Memorial Hall",
          ja: "国立国父紀念館"
        },
        lat: 25.0401, 
        lng: 121.5601, 
        description: {
          zh: "紀念國父孫中山先生的建築",
          en: "Memorial building for Dr. Sun Yat-sen",
          ja: "国父孫文を記念する建物"
        }
      },
      { 
        id: 20, 
        name: {
          zh: "台北101觀景台",
          en: "Taipei 101 Observatory",
          ja: "台北101展望台"
        },
        lat: 25.0338, 
        lng: 121.5646, 
        description: {
          zh: "台北地標性建築",
          en: "Iconic landmark of Taipei",
          ja: "台北のランドマーク的建造物"
        }
      },
      { 
        id: 21, 
        name: {
          zh: "士林夜市",
          en: "Shilin Night Market",
          ja: "士林夜市"
        },
        lat: 25.0878, 
        lng: 121.5249, 
        description: {
          zh: "台北最著名的夜市之一",
          en: "One of Taipei's most famous night markets",
          ja: "台北で最も有名な夜市の一つ"
        }
      },
      { 
        id: 22, 
        name: {
          zh: "臺北市立動物園",
          en: "Taipei Zoo",
          ja: "台北市立動物園"
        },
        lat: 24.9986, 
        lng: 121.5807, 
        description: {
          zh: "台灣最大的動物園",
          en: "Taiwan's largest zoo",
          ja: "台湾最大の動物園"
        }
      },
      { 
        id: 23, 
        name: {
          zh: "擎天崗",
          en: "Qingtiangang",
          ja: "擎天崗"
        },
        lat: 25.1617, 
        lng: 121.5619, 
        description: {
          zh: "陽明山國家公園內的草原",
          en: "Grassland in Yangmingshan National Park",
          ja: "陽明山国家公園内の草原"
        }
      },
      { 
        id: 5, 
        name: {
          zh: "圓山大飯店",
          en: "Grand Hotel",
          ja: "圓山大飯店"
        },
        lat: 25.0795, 
        lng: 121.5262, 
        description: {
          zh: "住宿地點 (04/29-05/01)",
          en: "Accommodation (04/29-05/01)",
          ja: "宿泊地 (04/29-05/01)"
        }
      },
      { 
        id: 29, 
        name: {
          zh: "台北微風平台",
          en: "Taipei Breeze Platform",
          ja: "台北微風プラットフォーム"
        },
        lat: 25.08410, 
        lng: 121.52846, 
        description: {
          zh: "知名俯瞰大台北的夜景平台",
          en: "Famous platform for viewing Taipei's night scenery",
          ja: "大台北の夜景を見渡せる有名な展望台"
        }
      }
    ],
  },
  {
    category: {
      zh: "桃園市",
      en: "Taoyuan City",
      ja: "桃園市"
    },
    places: [
      { 
        id: 2, 
        name: {
          zh: "桃園國際機場",
          en: "Taoyuan International Airport",
          ja: "桃園国際空港"
        },
        lat: 25.0797, 
        lng: 121.2342, 
        description: {
          zh: "台灣主要國際機場，旅程起點與終點",
          en: "Taiwan's main international airport, start and end point of the journey",
          ja: "台湾の主要な国際空港、旅の始点と終点"
        }
      }
    ],
  },
  {
    category: {
      zh: "新竹縣",
      en: "Hsinchu County",
      ja: "新竹県"
    },
    places: [
      { 
        id: 10, 
        name: {
          zh: "東窩溪螢火蟲生態區",
          en: "Dongwozi Firefly Ecological Area",
          ja: "東窩渓ホタル生態区"
        },
        lat: 24.7167, 
        lng: 121.0833, 
        description: {
          zh: "螢火蟲生態保護區",
          en: "Firefly ecological conservation area",
          ja: "ホタルの生態保護区"
        }
      },
      { 
        id: 11, 
        name: {
          zh: "六福村主題遊樂園",
          en: "Leofoo Village Theme Park",
          ja: "六福村テーマパーク"
        },
        lat: 24.8474, 
        lng: 121.1771, 
        description: {
          zh: "台灣知名主題樂園",
          en: "Famous theme park in Taiwan",
          ja: "台湾の有名なテーマパーク"
        }
      }
    ],
  },
  {
    category: {
      zh: "台中市",
      en: "Taichung City",
      ja: "台中市"
    },
    places: [
      { 
        id: 12, 
        name: {
          zh: "第四信用合作社",
          en: "Fourth Credit Cooperative",
          ja: "第四信用組合"
        },
        lat: 24.1417, 
        lng: 120.6817, 
        description: {
          zh: "具有歷史意義的建築",
          en: "Historically significant building",
          ja: "歴史的意義のある建物"
        }
      },
      { 
        id: 13, 
        name: {
          zh: "高美濕地",
          en: "Gaomei Wetlands",
          ja: "高美湿地"
        },
        lat: 24.3125, 
        lng: 120.5486, 
        description: {
          zh: "著名的生態保護區，有美麗的夕陽景色",
          en: "Famous ecological conservation area with beautiful sunset views",
          ja: "有名な生態保護区、美しい夕日の景色"
        }
      },
      { 
        id: 14, 
        name: {
          zh: "逢甲夜市",
          en: "Fengjia Night Market",
          ja: "逢甲夜市"
        },
        lat: 24.1791, 
        lng: 120.6462, 
        description: {
          zh: "台灣最大夜市之一",
          en: "One of Taiwan's largest night markets",
          ja: "台湾最大級の夜市"
        }
      },
      { 
        id: 28, 
        name: {
          zh: "宮原眼科",
          en: "Miyahara Eye Hospital",
          ja: "宮原眼科"
        },
        lat: 24.1378, 
        lng: 120.6849, 
        description: {
          zh: "日治時期眼科診所改建的特色甜品店，建築極具特色",
          en: "Historic eye clinic from Japanese era converted into a unique dessert shop",
          ja: "日本統治時代の眼科診療所を改装したユニークなスイーツショップ"
        }
      }
    ],
  }
]
