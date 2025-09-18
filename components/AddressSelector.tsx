"use client"

import { useState, useEffect } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { westJavaCities, type District } from "@/data/westJavaRegions"

interface AddressSelectorProps {
  selectedCity: string
  selectedDistrict: string
  fullAddress: string
  onCityChange: (cityId: string) => void
  onDistrictChange: (districtId: string) => void
  onFullAddressChange: (address: string) => void
}

export function AddressSelector({
  selectedCity,
  selectedDistrict,
  fullAddress,
  onCityChange,
  onDistrictChange,
  onFullAddressChange,
}: AddressSelectorProps) {
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([])

  useEffect(() => {
    if (selectedCity) {
      const city = westJavaCities.find((c) => c.id === selectedCity)
      setAvailableDistricts(city?.districts || [])

      // Remove onDistrictChange from dependency array to prevent infinite loop
      if (selectedDistrict && city && !city.districts.find((d) => d.id === selectedDistrict)) {
        onDistrictChange("")
      }
    } else {
      setAvailableDistricts([])
      if (selectedDistrict) {
        onDistrictChange("")
      }
    }
  }, [selectedCity, selectedDistrict]) // Removed onDistrictChange from dependencies

  return (
    <div className="space-y-4">
      {/* City/Kabupaten Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Kota/Kabupaten
        </label>
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            required
          >
            <option value="">Pilih Kota/Kabupaten</option>
            {westJavaCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* District/Kecamatan Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!selectedCity}
            required
          >
            <option value="">Pilih Kecamatan</option>
            {availableDistricts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {!selectedCity && <p className="text-xs text-gray-500 mt-1">Pilih kota/kabupaten terlebih dahulu</p>}
      </div>

      {/* Full Address Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
        <textarea
          value={fullAddress}
          onChange={(e) => onFullAddressChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, dll.)"
          required
        />
      </div>
    </div>
  )
}
