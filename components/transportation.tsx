"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Train, ArrowDown, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { locations, type Place, type LocationCategory, type LocalizedText } from "@/lib/locations-data"
import { useLanguage } from "@/lib/language-context"

type Language = "zh" | "en" | "ja"

interface Translations {
  [key: string]: {
    title: string
    searchOrigin: string
    searchDestination: string
    inputOriginPlaceholder: string
    inputDestinationPlaceholder: string
    transportationMode: string
    calculateRoute: string
    calculating: string
    loadingMap: string
    routeInfo: string
    distance: string
    time: string
    from: string
    to: string
    switchingMap: string
    unknownDistance: string
    unknownTime: string
    cannotCalculate: string
  }
}

interface TransportMode {
  value: string
  label: {
    [key in Language]: string
  }
  icon: string
}

// Add translations
const translations: Translations = {
  zh: {
    title: "交通資訊",
    searchOrigin: "搜尋起點",
    searchDestination: "搜尋終點",
    inputOriginPlaceholder: "輸入起點名稱",
    inputDestinationPlaceholder: "輸入終點名稱",
    transportationMode: "交通方式",
    calculateRoute: "計算路線",
    calculating: "計算中...",
    loadingMap: "載入地圖中...",
    routeInfo: "路線資訊",
    distance: "距離",
    time: "時間",
    from: "從",
    to: "到",
    switchingMap: "切換地圖中...",
    unknownDistance: "未知距離",
    unknownTime: "未知時間",
    cannotCalculate: "無法計算"
  },
  en: {
    title: "Transportation",
    searchOrigin: "Search Origin",
    searchDestination: "Search Destination",
    inputOriginPlaceholder: "Enter origin name",
    inputDestinationPlaceholder: "Enter destination name",
    transportationMode: "Transportation Mode",
    calculateRoute: "Calculate Route",
    calculating: "Calculating...",
    loadingMap: "Loading map...",
    routeInfo: "Route Information",
    distance: "Distance",
    time: "Time",
    from: "From",
    to: "to",
    switchingMap: "Switching map...",
    unknownDistance: "Unknown distance",
    unknownTime: "Unknown time",
    cannotCalculate: "Cannot calculate"
  },
  ja: {
    title: "交通情報",
    searchOrigin: "出発地を検索",
    searchDestination: "目的地を検索",
    inputOriginPlaceholder: "出発地名を入力",
    inputDestinationPlaceholder: "目的地名を入力",
    transportationMode: "移動手段",
    calculateRoute: "ルート計算",
    calculating: "計算中...",
    loadingMap: "地図を読み込み中...",
    routeInfo: "ルート情報",
    distance: "距離",
    time: "時間",
    from: "から",
    to: "まで",
    switchingMap: "地図切り替え中...",
    unknownDistance: "不明な距離",
    unknownTime: "不明な時間",
    cannotCalculate: "計算できません"
  }
}

// Add transportation modes with translations
const transportModes: TransportMode[] = [
  { 
    value: "DRIVING", 
    label: {
      zh: "開車",
      en: "Drive",
      ja: "車"
    }, 
    icon: "🚗" 
  },
  { 
    value: "TRANSIT", 
    label: {
      zh: "大眾運輸",
      en: "Transit",
      ja: "公共交通"
    }, 
    icon: "🚌" 
  },
  { 
    value: "WALKING", 
    label: {
      zh: "步行",
      en: "Walk",
      ja: "徒歩"
    }, 
    icon: "🚶" 
  },
]

// Use any for Google Maps types to avoid complex type definitions
declare global {
  interface Window {
    google: any
  }
}

export default function Transportation() {
  const { currentLang } = useLanguage()
  const t = translations[currentLang as keyof typeof translations]
  
  const mapRef = useRef<HTMLDivElement>(null)
  const [googleMap, setGoogleMap] = useState<any>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  // State for route calculation
  const [origin, setOrigin] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [originSearch, setOriginSearch] = useState<string>("")
  const [destinationSearch, setDestinationSearch] = useState<string>("")
  const [travelMode, setTravelMode] = useState<string>("DRIVING")
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [filteredOrigins, setFilteredOrigins] = useState<string[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([])
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)

  // 獲取按照id排序的所有地點
  const sortedPlaces = useMemo(() => {
    const allPlacesWithIds = locations.flatMap((cat: LocationCategory) => 
      cat.places.map((place: Place) => ({
        id: place.id,
        name: place.name[currentLang as keyof LocalizedText]
      }))
    );
    return allPlacesWithIds.sort((a, b) => a.id - b.id).map(place => place.name);
  }, [currentLang]);

  // Move allPlaces calculation into useMemo
  const allPlaces = useMemo(() => 
    locations.flatMap((cat: LocationCategory) => 
      cat.places.map((place: Place) => place.name[currentLang as keyof LocalizedText])
    ),
    [currentLang]
  );

  // Load Google Maps API
  useEffect(() => {
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = initMap
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
  }, [])

  // Initialize map
  const initMap = () => {
    if (mapRef.current && !googleMap) {
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
      ]

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 23.6978, lng: 120.9605 }, // Center of Taiwan
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: mapStyles,
      })

      setGoogleMap(map)
      setMapLoaded(true)

      // Initialize DirectionsRenderer
      const renderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: "#E4002B",
          strokeWeight: 5,
          strokeOpacity: 0.7,
        },
      })
      renderer.setMap(map)
      setDirectionsRenderer(renderer)
    }
  }

  // Update useEffect dependencies
  useEffect(() => {
    if (originSearch) {
      const filtered = allPlaces.filter(place => 
        place.toLowerCase().includes(originSearch.toLowerCase())
      )
      setFilteredOrigins(filtered)
      setShowOriginDropdown(filtered.length > 0)
    } else {
      setFilteredOrigins([])
      setShowOriginDropdown(false)
    }
  }, [originSearch, allPlaces])

  useEffect(() => {
    if (destinationSearch) {
      const filtered = allPlaces.filter(place => 
        place.toLowerCase().includes(destinationSearch.toLowerCase())
      )
      setFilteredDestinations(filtered)
      setShowDestinationDropdown(filtered.length > 0)
    } else {
      setFilteredDestinations([])
      setShowDestinationDropdown(false)
    }
  }, [destinationSearch, allPlaces])

  // Add translation helpers
  const translateDistance = (distance: string) => {
    if (!distance) return t.unknownDistance;
    
    // 移除可能存在的引號
    distance = distance.replace(/['"]/g, '');
    
    const [value, unit] = distance.split(' ');
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return t.unknownDistance;
    
    if (unit.toLowerCase().includes('km')) {
      return currentLang === 'zh' ? `${numValue} 公里` :
             currentLang === 'ja' ? `${numValue} キロメートル` : 
             `${numValue} kilometers`;
    } else if (unit.toLowerCase().includes('m')) {
      const km = (numValue / 1000).toFixed(1);
      return currentLang === 'zh' ? `${km} 公里` :
             currentLang === 'ja' ? `${km} キロメートル` : 
             `${km} kilometers`;
    }
    
    return distance;
  }

  const translateDuration = (duration: string) => {
    if (!duration) return t.unknownTime;
    
    // 移除可能存在的引號和多餘的空格
    duration = duration.replace(/['"]/g, '').trim();
    console.log('Duration before processing:', duration);
    
    // 處理純分鐘格式（例如："38分"）
    const minutesMatch = duration.match(/^(\d+)\s*分$/);
    if (minutesMatch) {
      const minutes = parseInt(minutesMatch[1]);
      return currentLang === 'zh' ? `${minutes} 分鐘` :
             currentLang === 'ja' ? `${minutes} 分` :
             `${minutes} minutes`;
    }
    
    // 處理日文/中文格式的時間（例如："1 時間45分" 或 "1小時45分"）
    const timeMatch = duration.match(/^(\d+)\s*(時間|小時|時)?\s*(\d+)?\s*(分)?$/);
    if (timeMatch) {
      const hours = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
      const minutes = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
      
      let result = '';
      if (hours > 0) {
        result += currentLang === 'zh' ? `${hours} 小時 ` :
                 currentLang === 'ja' ? `${hours} 時間 ` :
                 `${hours} hours `;
      }
      if (minutes > 0) {
        result += currentLang === 'zh' ? `${minutes} 分鐘` :
                 currentLang === 'ja' ? `${minutes} 分` :
                 `${minutes} minutes`;
      }
      return result.trim();
    }
    
    // 處理英文格式（例如："1 hour 45 minutes"）
    const parts = duration.split(' ');
    let result = '';
    
    for (let i = 0; i < parts.length; i += 2) {
      const value = parseInt(parts[i]);
      const unit = parts[i + 1]?.toLowerCase() || '';
      
      if (isNaN(value)) continue;
      
      if (unit.includes('小時') || unit.includes('時間') || unit.includes('hour')) {
        result += currentLang === 'zh' ? `${value} 小時 ` :
                 currentLang === 'ja' ? `${value} 時間 ` :
                 `${value} hours `;
      } else if (unit.includes('分') || unit.includes('min')) {
        result += currentLang === 'zh' ? `${value} 分鐘` :
                 currentLang === 'ja' ? `${value} 分` :
                 `${value} minutes`;
      }
    }
    
    console.log('Translated duration:', result || t.unknownTime);
    return result.trim() || t.unknownTime;
  }

  // Function to calculate route
  const calculateRoute = () => {
    // 檢查必要條件
    if (!googleMap || !directionsRenderer || !origin || !destination) {
      console.error("Missing required parameters:", { googleMap, directionsRenderer, origin, destination })
      setRouteInfo({
        distance: t.cannotCalculate,
        duration: t.cannotCalculate,
      })
      return
    }

    setIsCalculating(true)

    // 清除之前的路線
    directionsRenderer.setMap(null)
    directionsRenderer.setMap(googleMap)

    // 從所有地點中找到起點和終點
    const allPlaces = locations.flatMap((cat: LocationCategory) => cat.places)
    const originPlace = allPlaces.find((p: Place) => p.name[currentLang as keyof LocalizedText] === origin)
    const destPlace = allPlaces.find((p: Place) => p.name[currentLang as keyof LocalizedText] === destination)

    // 檢查是否找到地點
    if (!originPlace || !destPlace) {
      console.error("Could not find places:", { origin, destination, originPlace, destPlace })
      setIsCalculating(false)
      setRouteInfo({
        distance: t.cannotCalculate,
        duration: t.cannotCalculate,
      })
      return
    }

    // 創建路線服務
    const directionsService = new window.google.maps.DirectionsService()

    // 請求路線
    directionsService.route(
      {
        origin: { lat: originPlace.lat, lng: originPlace.lng },
        destination: { lat: destPlace.lat, lng: destPlace.lng },
        travelMode: travelMode as google.maps.TravelMode,
        provideRouteAlternatives: true,
        // 添加更多選項以提高路線查找成功率
        optimizeWaypoints: true,
        avoidFerries: false,
        avoidHighways: false,
        avoidTolls: false,
      },
      (result: any, status: any) => {
        setIsCalculating(false)
        console.log('Google Maps API Response:', { status, result })

        if (status === window.google.maps.DirectionsStatus.OK && result) {
          // 設置路線到地圖上
          directionsRenderer.setDirections(result)

          const route = result.routes[0]
          console.log('Selected Route:', route)

          if (route && route.legs[0]) {
            const distance = route.legs[0].distance?.text
            const duration = route.legs[0].duration?.text
            console.log('Route Details:', { distance, duration })

            // 轉換並設置路線信息
            const translatedDistance = translateDistance(distance || '')
            const translatedDuration = translateDuration(duration || '')
            console.log('Translated Route Info:', { translatedDistance, translatedDuration })

            setRouteInfo({
              distance: translatedDistance || t.unknownDistance,
              duration: translatedDuration || t.unknownTime
            })
          } else {
            console.error('No route legs found in response')
            setRouteInfo({
              distance: t.unknownDistance,
              duration: t.unknownTime
            })
          }
        } else {
          console.error("Directions request failed:", status)
          let errorMessage = '';
          
          // 根據不同的錯誤狀態提供適當的錯誤信息
          switch(status) {
            case 'ZERO_RESULTS':
              errorMessage = currentLang === 'zh' ? '找不到可行的路線' :
                           currentLang === 'ja' ? 'ルートが見つかりません' :
                           'No route available';
              break;
            case 'NOT_FOUND':
              errorMessage = currentLang === 'zh' ? '找不到指定的地點' :
                           currentLang === 'ja' ? '指定された場所が見つかりません' :
                           'Location not found';
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = currentLang === 'zh' ? '請求次數超過限制' :
                           currentLang === 'ja' ? 'リクエスト制限を超えました' :
                           'Query limit exceeded';
              break;
            default:
              errorMessage = t.cannotCalculate;
          }
          
          setRouteInfo({
            distance: errorMessage,
            duration: errorMessage,
          })
        }
      },
    )
  }

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOriginDropdown || showDestinationDropdown) {
        const target = event.target as HTMLElement
        if (!target.closest(".origin-dropdown") && !target.closest(".origin-input")) {
          setShowOriginDropdown(false)
        }
        if (!target.closest(".destination-dropdown") && !target.closest(".destination-input")) {
          setShowDestinationDropdown(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showOriginDropdown, showDestinationDropdown])

  return (
    <section id="transportation" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-title"
      >
        <Train className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">{t.title}</h2>
      </motion.div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.searchOrigin}</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={t.inputOriginPlaceholder}
                        className="pl-8 origin-input"
                        value={originSearch}
                        onChange={(e) => setOriginSearch(e.target.value)}
                        onFocus={() => {
                          // 顯示按id排序的前5個景點
                          const defaultPlaces = sortedPlaces.slice(0, 5)
                          setFilteredOrigins(defaultPlaces)
                          setShowOriginDropdown(true)
                        }}
                      />
                      {showOriginDropdown && (
                        <div className="origin-dropdown absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {filteredOrigins.map((place) => (
                            <div
                              key={place}
                              className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                              onClick={() => {
                                setOrigin(place)
                                setOriginSearch(place)
                                setShowOriginDropdown(false)
                              }}
                            >
                              {place}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <ArrowDown className="h-6 w-6 text-primary" />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.searchDestination}</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={t.inputDestinationPlaceholder}
                        className="pl-8 destination-input"
                        value={destinationSearch}
                        onChange={(e) => setDestinationSearch(e.target.value)}
                        onFocus={() => {
                          // 顯示按id排序的前5個景點
                          const defaultPlaces = sortedPlaces.slice(0, 5)
                          setFilteredDestinations(defaultPlaces)
                          setShowDestinationDropdown(true)
                        }}
                      />
                      {showDestinationDropdown && (
                        <div className="destination-dropdown absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                          {filteredDestinations.map((place) => (
                            <div
                              key={place}
                              className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors"
                              onClick={() => {
                                setDestination(place)
                                setDestinationSearch(place)
                                setShowDestinationDropdown(false)
                              }}
                            >
                              {place}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.transportationMode}</label>
                    <div className="flex gap-2">
                      {transportModes.map((mode) => (
                        <Button
                          key={mode.value}
                          variant={travelMode === mode.value ? "default" : "outline"}
                          className={`flex-1 transition-all duration-300 ${
                            travelMode === mode.value ? "shadow-md" : ""
                          }`}
                          onClick={() => setTravelMode(mode.value)}
                        >
                          <span className="mr-1">{mode.icon}</span> {mode.label[currentLang as keyof typeof mode.label]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-taiwan-red hover:bg-taiwan-red/90"
                    onClick={calculateRoute}
                    disabled={!origin || !destination || origin === destination || isCalculating}
                  >
                    {isCalculating ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        {t.calculating}
                      </div>
                    ) : (
                      t.calculateRoute
                    )}
                  </Button>
                </div>

                {routeInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-muted p-4 rounded-lg border"
                  >
                    <h4 className="font-medium mb-2">{t.routeInfo}</h4>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="text-sm bg-primary/10">
                        {t.distance}: {routeInfo.distance}
                      </Badge>
                      <Badge variant="outline" className="text-sm bg-primary/10">
                        {t.time}: {routeInfo.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.from} <span className="font-medium">{origin}</span> {t.to}{" "}
                      <span className="font-medium">{destination}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
            <div className="md:col-span-2 order-1 md:order-2">
              <div className="relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="animate-pulse flex flex-col items-center">
                      <Train className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">{t.loadingMap}</p>
                    </div>
                  </div>
                )}
                <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden shadow-inner" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
