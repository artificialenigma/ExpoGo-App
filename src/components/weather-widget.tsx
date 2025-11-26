import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getWeather, WeatherData} from '@/api/weather';
import {MapPin, Thermometer, Wind, Edit2, X} from 'lucide-react-native';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [currentLocation, setCurrentLocation] = useState('New York');

  useEffect(() => {
    loadLocationAndWeather();
  }, []);

  const loadLocationAndWeather = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('weather-location');
      const locationToUse = savedLocation || 'New York';
      setCurrentLocation(locationToUse);
      await loadWeather(locationToUse);
    } catch (e) {
      console.error('Failed to load location', e);
      await loadWeather('New York');
    }
  };

  const saveLocation = async () => {
    if (!locationInput.trim()) return;
    try {
      await AsyncStorage.setItem('weather-location', locationInput);
      setCurrentLocation(locationInput);
      setModalVisible(false);
      await loadWeather(locationInput);
    } catch (e) {
      console.error('Failed to save location', e);
    }
  };

  const loadWeather = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeather(query);
      setWeather(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm mb-4 items-center justify-center h-32">
        <ActivityIndicator color="#3498db" />
        <Text className="text-gray-400 mt-2 text-xs">Loading Weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl mb-4 border border-red-100 dark:border-red-800">
        <Text className="text-red-500 text-center text-sm">{error}</Text>
        <Text className="text-red-400 text-center text-xs mt-1">
          Please check API Key
        </Text>
      </View>
    );
  }

  if (!weather) return null;

  return (
    <>
      <View className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm mb-4">
        <View className="flex-row justify-between items-start">
          <View>
            <View className="flex-row items-center gap-1 mb-1">
              <MapPin size={14} color="#888" />
              <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                {weather.location.name}, {weather.location.country}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log('Edit icon pressed');
                  setLocationInput(currentLocation);
                  setModalVisible(true);
                  console.log('Modal visible set to true');
                }}
                className="ml-1 p-2">
                <Edit2 size={16} color="#3498db" />
              </TouchableOpacity>
            </View>
            <Text className="text-3xl font-bold text-gray-800 dark:text-white">
              {weather.current.temperature}°
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm capitalize">
              {weather.current.weather_descriptions[0]}
            </Text>
          </View>

          <View className="items-end">
            {weather.current.weather_icons[0] && (
              <Image
                source={{uri: weather.current.weather_icons[0]}}
                style={{width: 64, height: 64, borderRadius: 8}}
              />
            )}
          </View>
        </View>

        <View className="flex-row gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-2">
            <Wind size={16} color="#3498db" />
            <Text className="text-gray-600 dark:text-gray-300 text-xs">
              {weather.current.wind_speed} km/h
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Thermometer size={16} color="#e74c3c" />
            <Text className="text-gray-600 dark:text-gray-300 text-xs">
              Feels {weather.current.feelslike}°
            </Text>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-neutral-800 p-6 rounded-2xl w-4/5 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800 dark:text-white">
                Change Location
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Enter City or Country
            </Text>
            <TextInput
              value={locationInput}
              onChangeText={setLocationInput}
              placeholder="e.g. London, UK"
              placeholderTextColor="#999"
              className="bg-gray-100 dark:bg-neutral-700 p-3 rounded-xl text-gray-800 dark:text-white mb-4"
              autoFocus
            />

            <TouchableOpacity
              onPress={saveLocation}
              className="bg-blue-500 p-3 rounded-xl items-center">
              <Text className="text-white font-bold">Save Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
