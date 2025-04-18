"use client"

import { useEffect, useRef, useState } from "react"
import { Map, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { locations } from "@/lib/locations-data"
import { useLanguage } from "@/lib/language-context"
import { format, addDays, parseISO } from "date-fns"

// 行程資料 - 只匯入起始日期和每天行程預覽
const startDate = parseISO("2025-04-25")

// Add translations
const translations = {
  zh: {
    title: "景點地圖",
    loadingMap: "載入地圖中...",
    loadError: "地圖載入失敗，請檢查網路連接或重新整理頁面。",
    initError: "地圖初始化失敗，請重新整理頁面。",
    viewDetails: "查看詳情",
    address: "地址",
    description: "描述",
    noDescription: "暫無描述",
    zoomIn: "放大",
    zoomOut: "縮小",
    recenter: "重新置中",
    switchingMap: "切換地圖中...",
    missingTranslation: "此景點缺少翻譯資料",
    verifyPlace: "此景點資料可能不完整，請聯繫網站管理員。",
    cities: {
      "新北市": "新北市",
      "台北市": "台北市",
      "桃園市": "桃園市",
      "新竹縣": "新竹縣",
      "台中市": "台中市"
    },
    filterTypes: {
      "byCity": "依城市",
      "byDay": "依行程"
    },
    dayPrefix: "第",
    daySuffix: "天",
    // 添加行程每天的標題
    dayTitles: {
      1: "抵達台灣",
      2: "主題樂園之旅",
      3: "與Emily相約台北信義區",
      4: "台北市區探索",
      5: "五星級飯店",
      6: "陽明山與淡水",
      7: "與Sophia會面",
      8: "九份一日遊",
      9: "離開台灣"
    }
  },
  en: {
    title: "Attractions Map",
    loadingMap: "Loading map...",
    loadError: "Failed to load map. Please check your internet connection or refresh the page.",
    initError: "Map initialization failed. Please refresh the page.",
    viewDetails: "View Details",
    address: "Address",
    description: "Description",
    noDescription: "No description available",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    recenter: "Recenter",
    switchingMap: "Switching map...",
    missingTranslation: "Translation missing for this attraction",
    verifyPlace: "Place data may be incomplete. Please contact the site administrator.",
    cities: {
      "新北市": "New Taipei City",
      "台北市": "Taipei City",
      "桃園市": "Taoyuan City",
      "新竹縣": "Hsinchu County",
      "台中市": "Taichung City"
    },
    filterTypes: {
      "byCity": "By City",
      "byDay": "By Day"
    },
    dayPrefix: "Day ",
    daySuffix: "",
    // 添加行程每天的標題 (英文)
    dayTitles: {
      1: "Arrival in Taiwan",
      2: "Theme Park Adventure",
      3: "Meeting Emily in Xinyi District",
      4: "Taipei City Exploration",
      5: "Five-Star Hotel",
      6: "Yangmingshan and Tamsui",
      7: "Meeting Sophia",
      8: "Jiufen Day Tour",
      9: "Leaving Taiwan"
    }
  },
  ja: {
    title: "観光スポットマップ",
    loadingMap: "地図を読み込み中...",
    loadError: "地図の読み込みに失敗しました。インターネット接続を確認するか、ページを更新してください。",
    initError: "地図の初期化に失敗しました。ページを更新してください。",
    viewDetails: "詳細を見る",
    address: "住所",
    description: "説明",
    noDescription: "説明なし",
    zoomIn: "拡大",
    zoomOut: "縮小",
    recenter: "中心に戻す",
    switchingMap: "地図を切り替え中...",
    missingTranslation: "この観光スポットの翻訳データがありません",
    verifyPlace: "スポットデータが不完全な可能性があります。サイト管理者にお問い合わせください。",
    cities: {
      "新北市": "新北市",
      "台北市": "台北市",
      "桃園市": "桃園市",
      "新竹縣": "新竹県",
      "台中市": "台中市"
    },
    filterTypes: {
      "byCity": "都市別",
      "byDay": "日程別"
    },
    dayPrefix: "",
    daySuffix: "日目",
    // 添加行程每天的標題 (日文)
    dayTitles: {
      1: "台湾到着",
      2: "テーマパークの旅",
      3: "Emilyと信義区デート",
      4: "台北市内観光",
      5: "五つ星ホテル",
      6: "陽明山と淡水",
      7: "Sophiaと会う",
      8: "九份日帰り旅行",
      9: "台湾出発"
    }
  }
}

declare global {
  interface Window {
    google: any
  }
}

export default function MapSection() {
  const { currentLang } = useLanguage()
  const t = translations[currentLang as keyof typeof translations]
  
  const mapRef = useRef<HTMLDivElement>(null)
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [activeCategory, setActiveCategory] = useState("新北市")
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isChangingCategory, setIsChangingCategory] = useState(false)
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const [isInfoWindowVisible, setIsInfoWindowVisible] = useState(false)
  const mapInitializedRef = useRef(false)
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  // 新增：過濾類型（按城市或按天數）和選中天數的狀態
  const [filterType, setFilterType] = useState<"byCity" | "byDay">("byDay")
  const [activeDay, setActiveDay] = useState(1)
  
  // 新增：每日行程景點數據
  const dailyItinerary = [
    // 第1天
    {
      day: 1,
      date: format(startDate, "yyyy-MM-dd"),
      places: [
        { id: 2, name: "桃園國際機場", lat: 25.0797, lng: 121.2342, city: "桃園市" },
        { id: 1, name: "吉安公園 (外婆家)", lat: 24.9667, lng: 121.5333, city: "新北市" },
        { id: 9, name: "新北市美術館", lat: 25.0095, lng: 121.4613, city: "新北市" },
        { id: 10, name: "東窩溪螢火蟲生態區", lat: 24.7177, lng: 121.1387, city: "新竹縣" }
      ]
    },
    // 第2天
    {
      day: 2,
      date: format(addDays(startDate, 1), "yyyy-MM-dd"),
      places: [
        { id: 1, name: "吉安公園 (外婆家)", lat: 24.9667, lng: 121.5333, city: "新北市" },
        { id: 11, name: "六福村主題遊樂園", lat: 24.8347, lng: 121.1763, city: "新竹縣" },
        { id: 26, name: "烘爐地南山福德宮", lat: 24.9908, lng: 121.4825, city: "新北市" }
      ]
    },
    // 第3天
    {
      day: 3,
      date: format(addDays(startDate, 2), "yyyy-MM-dd"),
      places: [
        { id: 19, name: "國立國父紀念館", lat: 25.0394, lng: 121.5599, city: "台北市" },
        { id: 30, name: "鼎泰豐 (101店)", lat: 25.0335, lng: 121.5646, city: "台北市" },
        { id: 20, name: "台北101觀景台", lat: 25.0334, lng: 121.5642, city: "台北市" },
        { id: 31, name: "象山步道", lat: 25.0235, lng: 121.5830, city: "台北市" },
        { id: 33, name: "通化街夜市", lat: 25.0310, lng: 121.5528, city: "台北市" }
      ]
    },
    // 第4天
    {
      day: 4,
      date: format(addDays(startDate, 3), "yyyy-MM-dd"),
      places: [
        { id: 18, name: "中正紀念堂", lat: 25.0347, lng: 121.5218, city: "台北市" },
        { id: 17, name: "迪化街", lat: 25.0687, lng: 121.5103, city: "台北市" },
        { id: 15, name: "西門町", lat: 25.0421, lng: 121.5074, city: "台北市" },
        { id: 35, name: "密室脫逃", lat: 25.0390, lng: 121.5050, city: "台北市" },
        { id: 16, name: "艋舺龍山寺", lat: 25.0371, lng: 121.4997, city: "台北市" }
      ]
    },
    // 第5天
    {
      day: 5,
      date: format(addDays(startDate, 4), "yyyy-MM-dd"),
      places: [
        { id: 1, name: "吉安公園 (外婆家)", lat: 24.9667, lng: 121.5333, city: "新北市" },
        { id: 5, name: "圓山大飯店", lat: 25.0797, lng: 121.5267, city: "台北市" },
        { id: 21, name: "士林夜市", lat: 25.0875, lng: 121.5246, city: "台北市" }
      ]
    },
    // 第6天
    {
      day: 6,
      date: format(addDays(startDate, 5), "yyyy-MM-dd"),
      places: [
        { id: 23, name: "擎天崗", lat: 25.1600, lng: 121.5636, city: "台北市" },
        { id: 25, name: "淡水老街", lat: 25.1726, lng: 121.4389, city: "新北市" },
        { id: 27, name: "淡水紅毛城", lat: 25.1756, lng: 121.4588, city: "新北市" },
        { id: 34, name: "淡水漁人碼頭", lat: 25.1827, lng: 121.4264, city: "新北市" }
      ]
    },
    // 第7天
    {
      day: 7,
      date: format(addDays(startDate, 6), "yyyy-MM-dd"),
      places: [
        { id: 5, name: "圓山大飯店", lat: 25.0797, lng: 121.5267, city: "台北市" },
        { id: 1, name: "吉安公園 (外婆家)", lat: 24.9667, lng: 121.5333, city: "新北市" }
      ]
    },
    // 第8天
    {
      day: 8,
      date: format(addDays(startDate, 7), "yyyy-MM-dd"),
      places: [
        { id: 24, name: "猴硐貓村", lat: 25.0874, lng: 121.8269, city: "新北市" },
        { id: 4, name: "九份老街", lat: 25.1089, lng: 121.8443, city: "新北市" },
        { id: 7, name: "金瓜石", lat: 25.1069, lng: 121.8603, city: "新北市" },
        { id: 8, name: "報時山觀景臺", lat: 25.1214, lng: 121.8631, city: "新北市" },
        { id: 3, name: "平溪老街", lat: 25.0249, lng: 121.7385, city: "新北市" }
      ]
    },
    // 第9天
    {
      day: 9,
      date: format(addDays(startDate, 8), "yyyy-MM-dd"),
      places: [
        { id: 36, name: "台北手工現烤鳳梨酥", lat: 25.04497034569352, lng: 121.50771249621252 , city: "台北市" },
        { id: 1, name: "吉安公園 (外婆家)", lat: 24.9667, lng: 121.5333, city: "新北市" },
        { id: 2, name: "桃園國際機場", lat: 25.0797, lng: 121.2342,  city: "桃園市" }
      ]
    }
  ];

  // Add language mapping for Google Maps
  const googleMapsLanguages = {
    zh: 'zh-TW',  // 繁體中文
    en: 'en',     // 英文
    ja: 'ja'      // 日文
  }

  // Load Google Maps API
  useEffect(() => {
    const loadMap = () => {
      try {
    // Check if Google Maps API is already loaded
    if (typeof window.google !== "undefined") {
      initMap()
      return
    }

    // Check if script is already in the document
    const existingScript = document.getElementById("google-maps-api")
    if (existingScript) {
      // If script exists but Google isn't loaded yet, wait for it
      existingScript.addEventListener("load", initMap)
      return () => {
        existingScript.removeEventListener("load", initMap)
      }
    }

    // If script doesn't exist, create and add it
    const script = document.createElement("script")
    script.id = "google-maps-api"
        // Add language parameter to the API URL
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&language=${googleMapsLanguages[currentLang as keyof typeof googleMapsLanguages]}`
    script.async = true
    script.defer = true
    script.onload = initMap
        script.onerror = () => {
          setMapError(t.loadError)
          setMapLoaded(false)
        }
    document.head.appendChild(script)

    return () => {
      // Only remove the script if it exists and we added it
      const scriptToRemove = document.getElementById("google-maps-api")
      if (scriptToRemove && scriptToRemove === script) {
        document.head.removeChild(scriptToRemove)
      }
      // Remove event listener if it was added
      script.removeEventListener("load", initMap)
    }
      } catch (error) {
        setMapError(t.initError)
        setMapLoaded(false)
        console.error("Map loading error:", error)
      }
    }

    loadMap()
  }, [currentLang])

      // Custom map style
      const mapStyles = [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#dedede" }, { lightness: 21 }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "on" }, { color: "#ffffff" }, { lightness: 16 }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }],
        },
        {
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#fefefe" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
        },
      ]

  // Initialize map
  const initMap = () => {
    if (mapRef.current && !mapInitializedRef.current) {
      try {
        setMapError(null)
        mapInitializedRef.current = true

        // Get city-specific coordinates
        const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
          "台北市": { lat: 25.0330, lng: 121.5654 },
          "新北市": { lat: 25.0169, lng: 121.4627 },
          "桃園市": { lat: 24.9936, lng: 121.3010 },
          "新竹縣": { lat: 24.8361, lng: 121.0177 },
          "台中市": { lat: 24.1477, lng: 120.6736 }
        }

        // 根據當前過濾模式設置中心點
        let initialCenter;
        if (filterType === "byCity") {
          initialCenter = cityCoordinates[activeCategory] || { lat: 23.6978, lng: 120.9605 };
        } else {
          // 根據當天行程選擇中心點
          const dayData = dailyItinerary.find(day => day.day === activeDay);
          if (dayData && dayData.places.length > 0) {
            // 使用當天第一個地點作為中心點
            initialCenter = { lat: dayData.places[0].lat, lng: dayData.places[0].lng };
          } else {
            initialCenter = { lat: 25.0330, lng: 121.5654 }; // 預設台北
          }
        }

      const map = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: mapStyles,
          language: googleMapsLanguages[currentLang as keyof typeof googleMapsLanguages] // Set map language
        })

        // Add idle listener to confirm map is fully loaded
        map.addListener('idle', () => {
          setMapLoaded(true)
          setMapError(null)
          setIsChangingCategory(false)
      })

      setGoogleMap(map)

      // Create a single info window to be reused
      const infoWindowInstance = new window.google.maps.InfoWindow()
      setInfoWindow(infoWindowInstance)

      // Add custom map controls
      const zoomInButton = document.createElement("button")
      zoomInButton.innerHTML = "+"
      zoomInButton.className = "custom-map-control zoom-in"
      zoomInButton.addEventListener("click", () => {
        map.setZoom(map.getZoom() + 1)
      })

      const zoomOutButton = document.createElement("button")
      zoomOutButton.innerHTML = "-"
      zoomOutButton.className = "custom-map-control zoom-out"
      zoomOutButton.addEventListener("click", () => {
        map.setZoom(map.getZoom() - 1)
      })

      // Apply styles to custom controls
      const controlStyles = `
        .custom-map-control {
          background-color: white;
          border: none;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          cursor: pointer;
          margin: 10px;
          padding: 0;
          text-align: center;
          width: 32px;
          height: 32px;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        .custom-map-control:hover {
          background-color: #f5f5f5;
        }
      `

      const styleElement = document.createElement("style")
      styleElement.type = "text/css"
      styleElement.appendChild(document.createTextNode(controlStyles))
      document.head.appendChild(styleElement)

      map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomInButton)
      map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomOutButton)
      } catch (error) {
        setMapError(t.initError)
        setMapLoaded(false)
        mapInitializedRef.current = false
        console.error("Map initialization error:", error)
      }
    }
  }

  // Add map visibility check
  useEffect(() => {
    const checkMapVisibility = () => {
      if (mapRef.current && googleMap) {
        const mapElement = mapRef.current
        const isVisible = mapElement.offsetParent !== null
        
        if (!isVisible) {
          console.warn("Map container is not visible")
          // Trigger map resize when it becomes visible
          const resizeObserver = new ResizeObserver(() => {
            if (mapElement.offsetParent !== null) {
              googleMap.setCenter(googleMap.getCenter()!)
              resizeObserver.disconnect()
            }
          })
          resizeObserver.observe(mapElement)
        }
      }
    }

    // Check visibility initially and on window resize
    checkMapVisibility()
    window.addEventListener('resize', checkMapVisibility)

    return () => {
      window.removeEventListener('resize', checkMapVisibility)
    }
  }, [googleMap])

  // Update the marker creation function
  const createMarker = (place: any) => {
    // 檢查是否為有效的地點
    if (!place || (!place.lat && !place.lng && !place.id)) {
      console.error('Invalid place data:', place);
      return null;
    }

    // 尋找完整的地點信息
    let fullPlaceInfo = place;
    let placeExists = true;
    
    // 如果是從dailyItinerary中來的地點，確保從locations中獲取完整信息
    if (filterType === "byDay") {
      placeExists = false;
      
      // 從locations中尋找對應的完整信息
      for (const category of locations) {
        const found = category.places.find(p => p.id === place.id);
        if (found) {
          fullPlaceInfo = found;
          placeExists = true;
          break;
        }
      }
    }

    // 如果找不到完整信息且沒有有效座標，無法創建標記
    if (!placeExists && (!place.lat || !place.lng)) {
      console.error('Missing coordinates for place with ID:', place.id);
      return null;
    }

    // 創建標記圖標
    const markerIcon = {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: "#E4002B",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 1.5,
      anchor: new window.google.maps.Point(12, 22),
    }

    try {
      // 根據當前語言獲取場所名稱
      const placeName = typeof fullPlaceInfo.name === 'object' 
        ? fullPlaceInfo.name[currentLang as keyof typeof fullPlaceInfo.name] || 
          fullPlaceInfo.name[Object.keys(fullPlaceInfo.name)[0]]
        : fullPlaceInfo.name;
      
      // 使用優先從locations獲取的座標創建標記
      const marker = new window.google.maps.Marker({
        position: { 
          lat: fullPlaceInfo.lat, 
          lng: fullPlaceInfo.lng 
        },
        map: googleMap,
        title: placeName,
        animation: window.google.maps.Animation.DROP,
        icon: markerIcon,
      });

      // 從地點數據中尋找完整信息以用於信息窗口
      let placeInfo = null;
      let isPlaceMissing = true;
      
      // 嘗試在locations中查找更詳細的地點信息
      for (const category of locations) {
        const foundPlace = category.places.find(p => p.id === fullPlaceInfo.id);
        if (foundPlace) {
          placeInfo = foundPlace;
          isPlaceMissing = false;
          break;
        }
      }

      // 添加標記點擊事件
      marker.addListener("click", () => {
        if (infoWindow) {
          infoWindow.close();
        }

        let content = '';
        
        if (isPlaceMissing) {
          // 顯示缺少翻譯的警告
          content = `
            <div class="info-window">
              <h3 class="text-lg font-semibold mb-2">${placeName}</h3>
              <div class="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-2 mb-2 text-sm">
                <p class="font-bold">${t.missingTranslation}</p>
                <p>${t.verifyPlace}</p>
              </div>
              <p class="mb-2"><strong>${t.address}:</strong> ${fullPlaceInfo.city || ''}</p>
              <p><strong>${t.description}:</strong> ${t.noDescription}</p>
            </div>
          `;
        } else {
          // 使用完整翻譯資料
          content = `
            <div class="info-window">
              <h3 class="text-lg font-semibold mb-2">${placeName}</h3>
              ${placeInfo ? `
                <p class="mb-2"><strong>${t.address}:</strong> ${placeInfo.address?.[currentLang as keyof typeof placeInfo.address] || ''}</p>
                <p><strong>${t.description}:</strong> ${placeInfo.description?.[currentLang as keyof typeof placeInfo.description] || t.noDescription}</p>
              ` : `
                <p><strong>${t.description}:</strong> ${t.noDescription}</p>
              `}
              <button class="view-details-btn mt-3">${t.viewDetails}</button>
            </div>
          `;
        }

        const newInfoWindow = new window.google.maps.InfoWindow({
          content,
          maxWidth: 300,
        });

        newInfoWindow.addListener('closeclick', () => {
          setIsInfoWindowVisible(false);
        });

        newInfoWindow.open({
          anchor: marker,
          map: googleMap,
        });

        setInfoWindow(newInfoWindow);
        setIsInfoWindowVisible(true);
        setSelectedPlace(fullPlaceInfo.id);

        // 添加查看詳情按鈕的點擊事件
        setTimeout(() => {
          const viewDetailsBtn = document.querySelector('.view-details-btn');
          if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
              setSelectedPlace(fullPlaceInfo.id);
            });
          }
        }, 100);
      });

      return marker;
    } catch (error) {
      console.error('Failed to create marker for place:', place.name, error);
      return null;
    }
  }

  // 新增：驗證 dailyItinerary 中的地點 ID 是否都能在 locations 中找到
  const [missingPlaces, setMissingPlaces] = useState<{day: number, placeId: number}[]>([]);
  
  // 檢查所有 dailyItinerary 中的地點
  useEffect(() => {
    const missing: {day: number, placeId: number}[] = [];
    
    // 檢查每一天的每個地點
    dailyItinerary.forEach(day => {
      day.places.forEach(place => {
        // 檢查此地點 ID 是否能在 locations 中找到
        let found = false;
        for (const category of locations) {
          if (category.places.some(p => p.id === place.id)) {
            found = true;
            break;
          }
        }
        
        // 如果找不到，添加到缺失列表
        if (!found) {
          missing.push({ day: day.day, placeId: place.id });
        }
      });
    });
    
    setMissingPlaces(missing);
    
    // 如果有缺失的地點，顯示在控制台
    if (missing.length > 0) {
      console.warn('Some places in dailyItinerary are not found in locations:', missing);
    }
  }, []);

  // 更新地圖標記的函數
  const updateMapMarkers = async () => {
    try {
      setIsChangingCategory(true);

      // 清除現有標記
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      let placesToShow = [];
      const allLocationsPlaces = locations.flatMap(cat => cat.places);

      if (filterType === "byCity") {
        // 按城市過濾
        const category = locations.find((cat) => cat.category.zh === activeCategory);
        if (!category) {
          console.warn('Category not found:', activeCategory);
          setIsChangingCategory(false);
          return;
        }
        placesToShow = category.places;
      } else {
        // 按天數過濾
        const dayData = dailyItinerary.find(day => day.day === activeDay);
        if (!dayData) {
          console.warn('Day not found:', activeDay);
          setIsChangingCategory(false);
          return;
        }
        
        // 對於行程模式，總是從locations中查找完整數據
        placesToShow = dayData.places.map(place => {
          // 查找對應的完整地點信息
          const fullPlaceInfo = allLocationsPlaces.find(p => p.id === place.id);
          
          if (fullPlaceInfo) {
            // 使用locations中的完整數據，包括座標和城市信息
            return fullPlaceInfo;
          } else {
            // 如果找不到，仍使用原始數據，但記錄警告
            console.warn(`Place with ID ${place.id} not found in locations data`);
            return place;
          }
        });
      }

      // 創建新標記
      const newMarkers = (await Promise.all(
        placesToShow.map(async (place) => {
          const marker = createMarker(place);
          return marker;
        })
      )).filter((marker): marker is google.maps.Marker => marker !== null);

      setMarkers(newMarkers);

      // 調整地圖範圍以顯示所有標記
    if (newMarkers.length > 0 && googleMap) {
        const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
          bounds.extend(marker.getPosition()!);
        });
          
          googleMap.fitBounds(bounds, {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        });

          const listener = googleMap.addListener('idle', () => {
            if (googleMap.getZoom()! > 15) {
            googleMap.setZoom(15);
          }
          google.maps.event.removeListener(listener);
          setIsChangingCategory(false);
        });
        } else {
          console.warn('No markers created for category:', activeCategory);
        setIsChangingCategory(false);
        }
      } catch (error) {
      console.error("Error updating map:", error);
      setMapError(t.loadError);
      setIsChangingCategory(false);
    }
  }

  // 更新標記當類別或天數變化時
  useEffect(() => {
    if (!googleMap || !window.google) return;
    updateMapMarkers();
  }, [googleMap, activeCategory, activeDay, filterType, currentLang]);

  // Add effect to monitor language changes
  useEffect(() => {
    console.log('Language changed:', {
      newLanguage: currentLang,
      activeCategory,
      markersCount: markers.length,
      mapInitialized: !!googleMap
    });

    // Check if markers are displaying correct language
    markers.forEach((marker, index) => {
      const category = locations.find((cat) => cat.category.zh === activeCategory);
      if (category && category.places[index]) {
        const place = category.places[index];
        const expectedTitle = place.name[currentLang as keyof typeof place.name];
        const currentTitle = marker.getTitle();
        
        if (currentTitle !== expectedTitle) {
          console.warn('Marker title mismatch:', {
            expected: expectedTitle,
            current: currentTitle,
            placeId: place.id
          });
        }
      }
    });
  }, [currentLang, googleMap, activeCategory, markers]);

  // Pan to selected place
  useEffect(() => {
    if (!googleMap || selectedPlace === null || !window.google) return

    const allPlaces = locations.flatMap((cat) => cat.places)
    const place = allPlaces.find((p) => p.id === selectedPlace)

    if (place) {
      googleMap.panTo({ lat: place.lat, lng: place.lng })
      googleMap.setZoom(16)

      // Find the marker for this place and trigger its click event
      const marker = markers.find((m) => m.getTitle() === place.name[currentLang as keyof typeof place.name])
      if (marker && infoWindow) {
        const infoWindowContent = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-size: 16px; color: #E4002B;">
              ${place.name[currentLang as keyof typeof place.name]}
            </h3>
            <p style="margin: 0; font-size: 14px;">
              ${place.description[currentLang as keyof typeof place.description]}
            </p>
          </div>
        `
        infoWindow.setContent(infoWindowContent)
        infoWindow.open(googleMap, marker)
      }
    }
  }, [googleMap, selectedPlace, markers, infoWindow, currentLang])

  // Handle tab change for city categories
  const handleCityTabChange = (value: string) => {
    if (value === activeCategory) return
    
    setIsChangingCategory(true)
    setSelectedPlace(null)
    if (infoWindow) {
      infoWindow.close()
    }

    // 清除現有標記
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    // 更新類別
    setActiveCategory(value)
    
    // 重新初始化地圖
    if (googleMap && mapRef.current) {
      const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
        "台北市": { lat: 25.0330, lng: 121.5654 },
        "新北市": { lat: 25.0169, lng: 121.4627 },
        "桃園市": { lat: 24.9936, lng: 121.3010 },
        "新竹縣": { lat: 24.8361, lng: 121.0177 },
        "台中市": { lat: 24.1477, lng: 120.6736 }
      }

      const newCenter = cityCoordinates[value] || { lat: 23.6978, lng: 120.9605 }
      
      // 更新地圖中心和縮放等級
      googleMap.setCenter(newCenter)
      googleMap.setZoom(11)

      // 添加監聽器處理中心變更
      google.maps.event.addListenerOnce(googleMap, 'idle', () => {
        setIsChangingCategory(false)
        google.maps.event.trigger(googleMap, 'resize')
        mapInitializedRef.current = false
        initMap()
      })
    }
  }

  // 處理天數標籤變更
  const handleDayTabChange = (value: string) => {
    const day = parseInt(value)
    if (day === activeDay) return
    
    setIsChangingCategory(true)
    setSelectedPlace(null)
    if (infoWindow) {
      infoWindow.close()
    }
    
    // 清除現有標記
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    // 更新當前天數
    setActiveDay(day)
    
    // 重新初始化地圖
    if (googleMap && mapRef.current) {
      const dayData = dailyItinerary.find(d => d.day === day)
      
      if (dayData && dayData.places.length > 0) {
        // 使用當天第一個地點的位置
        const newCenter = { lat: dayData.places[0].lat, lng: dayData.places[0].lng }
        
        // 更新地圖中心和縮放等級
        googleMap.setCenter(newCenter)
        googleMap.setZoom(11)

        // 添加監聽器處理中心變更
        google.maps.event.addListenerOnce(googleMap, 'idle', () => {
          setIsChangingCategory(false)
          google.maps.event.trigger(googleMap, 'resize')
      mapInitializedRef.current = false
          initMap()
        })
      }
    }
  }

  // 處理過濾類型變更
  const handleFilterTypeChange = (type: "byCity" | "byDay") => {
    if (type === filterType) return
    
    setFilterType(type)
    setIsChangingCategory(true)
    setSelectedPlace(null)
    
    if (infoWindow) {
      infoWindow.close()
    }
    
    // 清除現有標記
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])
      
    // 重置地圖
    mapInitializedRef.current = false
    setTimeout(() => {
      initMap()
    }, 100)
    }

  return (
    <section id="map" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-title"
      >
        <Map className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">{t.title}</h2>
      </motion.div>

      {/* 顯示缺失地點的警告 */}
      {missingPlaces.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-l-4 border-amber-500 p-4 mx-auto max-w-3xl mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                {missingPlaces.length === 1 
                  ? `有1個地點在 locations-data.ts 中找不到對應資料` 
                  : `有${missingPlaces.length}個地點在 locations-data.ts 中找不到對應資料`}
              </p>
              <div className="mt-2 text-xs text-amber-600">
                {missingPlaces.map(missing => (
                  <p key={`${missing.day}-${missing.placeId}`}>
                    第{missing.day}天: ID {missing.placeId}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 過濾類型選擇器 */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#FFF4D6] mb-2 p-1 rounded-lg flex">
          <button
            onClick={() => handleFilterTypeChange("byCity")}
            className={cn(
              "px-6 py-2 rounded-md transition-colors",
              filterType === "byCity" 
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            )}
          >
            {t.filterTypes.byCity}
          </button>
          <button
            onClick={() => handleFilterTypeChange("byDay")}
            className={cn(
              "px-6 py-2 rounded-md transition-colors",
              filterType === "byDay"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            )}
          >
            {t.filterTypes.byDay}
          </button>
        </div>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {filterType === "byCity" ? (
          <Tabs 
            defaultValue="新北市" 
            value={activeCategory} 
              onValueChange={handleCityTabChange}
            className="w-full"
          >
            <TabsList className="bg-[#FFF4D6] flex w-full h-auto flex-wrap mb-6 p-1 rounded-xl">
              {locations.map((category) => (
                <TabsTrigger
                  key={category.category.zh}
                  value={category.category.zh}
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {t.cities[category.category.zh as keyof typeof t.cities]}
                </TabsTrigger>
              ))}
            </TabsList>

            {locations.map((category) => (
              <TabsContent key={category.category.zh} value={category.category.zh} className="mt-0">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 order-2 md:order-1">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {category.places.map((place) => (
                        <motion.div
                          key={place.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer transition-all duration-300",
                            selectedPlace === place.id
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-[#FFF4D6] hover:bg-primary/50 hover:-translate-y-1 hover:shadow-sm",
                          )}
                          onClick={() => {
                            setSelectedPlace(place.id)
                          }}
                        >
                          <h4 className="font-medium">
                            {place.name[currentLang as keyof typeof place.name]}
                          </h4>
                          <p
                            className={cn(
                              "text-sm mt-1",
                              selectedPlace === place.id ? "text-primary-foreground/80" : "text-muted-foreground",
                            )}
                          >
                            {place.description[currentLang as keyof typeof place.description]}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 order-1 md:order-2">
                    <div className="relative">
                      <div 
                        ref={mapRef} 
                        className="w-full h-[400px] rounded-lg overflow-hidden shadow-inner"
                        style={{ 
                          opacity: (!mapLoaded || isChangingCategory) ? '0.6' : '1',
                          transition: 'opacity 0.3s ease-in-out'
                        }}
                      />
                      {(!mapLoaded || isChangingCategory) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
                          <div className="bg-background/95 px-6 py-4 rounded-lg shadow-lg">
                          <div className="animate-pulse flex flex-col items-center">
                              <Map className="h-8 w-8 text-primary mb-2" />
                              <p className="text-foreground font-medium">
                                  {mapError || (isChangingCategory ? t.switchingMap : t.loadingMap)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          ) : (
            <Tabs 
              defaultValue="1" 
              value={activeDay.toString()} 
              onValueChange={handleDayTabChange}
              className="w-full"
            >
              <TabsList className="bg-[#FFF4D6] flex w-full h-auto flex-wrap mb-6 p-1 rounded-xl">
                {dailyItinerary.map((day) => (
                  <TabsTrigger
                    key={day.day}
                    value={day.day.toString()}
                    className={cn(
                      "flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      day.day === 3 && "relative",
                      day.day === 7 && "relative"
                    )}
                  >
                    {t.dayPrefix}{day.day}{t.daySuffix}
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

              {dailyItinerary.map((day) => (
                <TabsContent key={day.day} value={day.day.toString()} className="mt-0">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 order-2 md:order-1">
                      <h3 className="text-xl font-bold mb-4">
                        {format(new Date(day.date), 'MM/dd')} - {t.dayTitles[day.day as keyof typeof t.dayTitles]}
                      </h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {day.places.map((place) => {
                          // 檢查此地點是否在 locations 中有對應項
                          let placeExists = false;
                          let fullPlaceInfo = null;

                          // 從locations中獲取完整信息
                          for (const category of locations) {
                            const foundPlace = category.places.find(p => p.id === place.id);
                            if (foundPlace) {
                              placeExists = true;
                              fullPlaceInfo = foundPlace;
                              break;
                            }
                          }
                          
                          // 確定要顯示的城市信息
                          const cityToDisplay = placeExists && fullPlaceInfo 
                            ? fullPlaceInfo.category 
                              ? fullPlaceInfo.category  // 如果地點有category屬性
                              : (() => {
                                  // 找出地點所屬的category
                                  for (const category of locations) {
                                    if (category.places.some(p => p.id === place.id)) {
                                      return category.category.zh;
                                    }
                                  }
                                  return place.city; // 如果找不到依然回退到原始數據
                                })()
                            : place.city;
                          
                          return (
                            <motion.div
                              key={place.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "p-3 rounded-lg cursor-pointer transition-all duration-300",
                                selectedPlace === place.id
                                  ? "bg-primary text-primary-foreground shadow-md"
                                  : placeExists 
                                    ? "bg-[#FFF4D6] hover:bg-primary/50 hover:-translate-y-1 hover:shadow-sm"
                                    : "bg-amber-50 border border-amber-300 hover:bg-amber-100 hover:-translate-y-1 hover:shadow-sm"
                              )}
                              onClick={() => {
                                setSelectedPlace(place.id)
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">
                                  {placeExists && fullPlaceInfo
                                    ? fullPlaceInfo.name[currentLang as keyof typeof fullPlaceInfo.name]
                                    : typeof place.name === 'object'
                                      ? place.name[currentLang as keyof typeof place.name] || place.name[Object.keys(place.name)[0]]
                                      : place.name
                                  }
                                  {!placeExists && (
                                    <span className="text-amber-500 ml-1.5">
                                      [{t.missingTranslation}]
                                    </span>
                                  )}
                                </h4>
                                {!placeExists && (
                                  <span className="bg-amber-200 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-2 whitespace-nowrap">
                                    !
                                  </span>
                                )}
                              </div>
                              <p className={cn(
                                "text-sm mt-1",
                                selectedPlace === place.id ? "text-primary-foreground/80" : "text-muted-foreground",
                              )}>
                                {placeExists
                                  ? (() => {
                                      // 尋找並顯示所屬城市的翻譯
                                      const cityKey = cityToDisplay as keyof typeof t.cities;
                                      return t.cities[cityKey] || cityToDisplay;
                                    })()
                                  : (
                                    <span className="flex items-center gap-1">
                                      {place.city}
                                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                                    </span>
                                  )
                                }
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="md:col-span-2 order-1 md:order-2">
                      <div className="relative">
                        <div 
                          ref={mapRef} 
                          className="w-full h-[400px] rounded-lg overflow-hidden shadow-inner"
                          style={{ 
                            opacity: (!mapLoaded || isChangingCategory) ? '0.6' : '1',
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                        />
                        {(!mapLoaded || isChangingCategory) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
                            <div className="bg-background/95 px-6 py-4 rounded-lg shadow-lg">
                              <div className="animate-pulse flex flex-col items-center">
                                <Calendar className="h-8 w-8 text-primary mb-2" />
                                <p className="text-foreground font-medium">
                                  {mapError || (isChangingCategory ? t.switchingMap : t.loadingMap)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
