"use client"

import { useEffect, useRef, useState } from "react"
import { Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { locations } from "@/lib/locations-data"
import { useLanguage } from "@/lib/language-context"

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
    cities: {
      "新北市": "新北市",
      "台北市": "台北市",
      "桃園市": "桃園市",
      "新竹縣": "新竹縣",
      "台中市": "台中市"
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
    cities: {
      "新北市": "New Taipei City",
      "台北市": "Taipei City",
      "桃園市": "Taoyuan City",
      "新竹縣": "Hsinchu County",
      "台中市": "Taichung City"
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
    cities: {
      "新北市": "新北市",
      "台北市": "台北市",
      "桃園市": "桃園市",
      "新竹縣": "新竹県",
      "台中市": "台中市"
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

        const initialCenter = cityCoordinates[activeCategory] || { lat: 23.6978, lng: 120.9605 }

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

  // Update marker click handler
  const createMarkerClickHandler = (marker: google.maps.Marker, place: any) => {
    return () => {
      const placeName = place.name[currentLang as keyof typeof place.name]
      const placeAddress = place.address[currentLang as keyof typeof place.address]
      const placeDescription = place.description[currentLang as keyof typeof place.description] || t.noDescription

      if (infoWindow) {
        infoWindow.close()
        setIsInfoWindowVisible(false)
      }

      const content = `
        <div class="info-window">
          <h3 class="text-lg font-semibold mb-2">${placeName}</h3>
          <p class="mb-2"><strong>${t.address}:</strong> ${placeAddress}</p>
          <p><strong>${t.description}:</strong> ${placeDescription}</p>
          <button class="view-details-btn mt-3">${t.viewDetails}</button>
        </div>
      `

      const newInfoWindow = new window.google.maps.InfoWindow({
        content,
        maxWidth: 300,
      })

      newInfoWindow.addListener('closeclick', () => {
        setIsInfoWindowVisible(false)
      })

      newInfoWindow.open({
        anchor: marker,
        map: googleMap,
      })

      setInfoWindow(newInfoWindow)
      setIsInfoWindowVisible(true)

      try {
        if (isInfoWindowVisible) {
          console.log('InfoWindow successfully opened for:', placeName)
        } else {
          console.log('InfoWindow failed to open for:', placeName)
        }
      } catch (error) {
        console.error('Error checking InfoWindow visibility:', error)
      }

      // Add click event listener for the "View Details" button
      setTimeout(() => {
        const viewDetailsBtn = document.querySelector('.view-details-btn')
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener('click', () => {
            setSelectedPlace(place.id)
          })
        }
      }, 100)
    }
  }

  // Update the marker creation in updateMap function
  const createMarker = (place: any) => {
    // Verify place data
    if (!place.lat || !place.lng) {
      console.error('Invalid coordinates for place:', place.name[currentLang as keyof typeof place.name]);
      return null;
    }

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
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: googleMap,
        title: place.name[currentLang as keyof typeof place.name] || place.name.zh,
        animation: window.google.maps.Animation.DROP,
        icon: markerIcon,
      })

      marker.addListener("click", createMarkerClickHandler(marker, place))
      return marker;
    } catch (error) {
      console.error('Failed to create marker for place:', place.name[currentLang as keyof typeof place.name], error);
      return null;
    }
  }

  // Update the markers creation in updateMap
  const updateMap = async () => {
    try {
      setIsChangingCategory(true)

      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])

      const category = locations.find((cat) => cat.category.zh === activeCategory)
      if (!category) {
        console.warn('Category not found:', activeCategory);
        setIsChangingCategory(false)
        return
      }

      // Create new markers
      const newMarkers = (await Promise.all(
        category.places.map(async (place) => {
          const marker = createMarker(place);
          if (marker) {
            return marker;
          }
          return null;
        })
      )).filter((marker): marker is google.maps.Marker => marker !== null);

      setMarkers(newMarkers)

      // Fit bounds to show all markers
      if (newMarkers.length > 0 && googleMap) {
        const bounds = new window.google.maps.LatLngBounds()
        newMarkers.forEach((marker) => {
          bounds.extend(marker.getPosition()!)
        })
        
        googleMap.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        })

        const listener = googleMap.addListener('idle', () => {
          if (googleMap.getZoom()! > 15) {
            googleMap.setZoom(15)
          }
          google.maps.event.removeListener(listener)
          setIsChangingCategory(false)
        })
      } else {
        console.warn('No markers created for category:', activeCategory);
        setIsChangingCategory(false)
      }

    } catch (error) {
      console.error("Error updating map:", error)
      setMapError(t.loadError)
      setIsChangingCategory(false)
    }
  }

  // Update markers when category changes
  useEffect(() => {
    if (!googleMap || !window.google) return

    const updateMap = async () => {
      try {
        setIsChangingCategory(true)

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    // Find the selected category
        const category = locations.find((cat) => cat.category.zh === activeCategory)
        if (!category) {
          console.warn('Category not found:', activeCategory);
          setIsChangingCategory(false)
          return
        }

        // Log category places for debugging
        console.log('Creating markers for category:', {
          category: category.category[currentLang as keyof typeof category.category],
          placesCount: category.places.length,
          currentLanguage: currentLang
        });

        // Create new markers with a slight delay
        await new Promise(resolve => setTimeout(resolve, 100))

    const newMarkers = category.places.map((place) => {
          // Log each place's data for verification
          console.log('Creating marker for place:', {
            name: place.name[currentLang as keyof typeof place.name],
            hasDescription: !!place.description[currentLang as keyof typeof place.description],
            coordinates: { lat: place.lat, lng: place.lng }
          });

      const markerIcon = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: "#E4002B",
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 22),
      }

      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: googleMap,
            title: place.name[currentLang as keyof typeof place.name],
        animation: window.google.maps.Animation.DROP,
        icon: markerIcon,
      })

          marker.addListener("click", createMarkerClickHandler(marker, place))

      return marker
    })

    setMarkers(newMarkers)

    // Fit bounds to show all markers
    if (newMarkers.length > 0 && googleMap) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition()!)
      })
          
          googleMap.fitBounds(bounds, {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          })

          // Ensure zoom level is not too high
          const listener = googleMap.addListener('idle', () => {
            if (googleMap.getZoom()! > 15) {
              googleMap.setZoom(15)
            }
            google.maps.event.removeListener(listener)
            setIsChangingCategory(false)
          })
        } else {
          console.warn('No markers created for category:', activeCategory);
          setIsChangingCategory(false)
        }

      } catch (error) {
        console.error("Error updating map:", error)
        setMapError(t.loadError)
        setIsChangingCategory(false)
      }
    }

    updateMap()
  }, [googleMap, activeCategory, currentLang])

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

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === activeCategory) return
    
    setIsChangingCategory(true)
    setSelectedPlace(null)
    if (infoWindow) {
      infoWindow.close()
    }

    // Reset map initialization flag
    mapInitializedRef.current = false
    
    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    // Update category
    setActiveCategory(value)
    
    // Reinitialize map with new center based on selected city
    if (googleMap && mapRef.current) {
      const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
        "台北市": { lat: 25.0330, lng: 121.5654 },
        "新北市": { lat: 25.0169, lng: 121.4627 },
        "桃園市": { lat: 24.9936, lng: 121.3010 },
        "新竹縣": { lat: 24.8361, lng: 121.0177 },
        "台中市": { lat: 24.1477, lng: 120.6736 }
      }

      const newCenter = cityCoordinates[value] || { lat: 23.6978, lng: 120.9605 }
      
      // Update map center and zoom
      googleMap.setCenter(newCenter)
      googleMap.setZoom(11)

      // Add a listener to handle the end of the center change
      google.maps.event.addListenerOnce(googleMap, 'idle', () => {
        setIsChangingCategory(false)
        // Force map resize after center change is complete
        google.maps.event.trigger(googleMap, 'resize')
        initMap()
      })
    }
  }

  // Add effect to update map language when language changes
  useEffect(() => {
    if (googleMap) {
      // Reset map initialization to force recreation with new language
      mapInitializedRef.current = false
      
      // Remove existing map
      markers.forEach((marker) => marker.setMap(null))
      setMarkers([])
      
      // Reinitialize map with new language
      initMap()
    }
  }, [currentLang])

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

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <Tabs 
            defaultValue="新北市" 
            value={activeCategory} 
            onValueChange={handleTabChange}
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
                                {mapError || (isChangingCategory ? "切換地圖中..." : "載入地圖中...")}
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
        </CardContent>
      </Card>
    </section>
  )
}
