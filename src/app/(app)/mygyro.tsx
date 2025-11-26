import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {
  BatteryCharging,
  RotateCw,
  Activity,
  Trash2,
  Share as ShareIcon,
  Clock,
} from 'lucide-react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {cssInterop} from 'nativewind';
import {Gyroscope} from 'expo-sensors';
import * as Battery from 'expo-battery';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {WeatherWidget} from '@/components/weather-widget';

cssInterop(LinearGradient, {className: 'style'});

type RecordingSession = {
  id: string;
  date: string;
  duration: string;
  samples: number;
  data: any[];
};

export default function SensorDashboardScreen() {
  // Sensor State
  const [gyroData, setGyroData] = useState({x: 0, y: 0, z: 0});
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const recordedData = useRef<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  // History State
  const [history, setHistory] = useState<RecordingSession[]>([]);

  // 1. Load History & Setup Sensors
  useEffect(() => {
    loadHistory();
    setupSensors();
    return () => _unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('gyro-history');
      if (jsonValue != null) {
        setHistory(JSON.parse(jsonValue));
      }
    } catch {
      console.error('Failed to load history');
    }
  };

  const setupSensors = async () => {
    const gyroAvailable = await Gyroscope.isAvailableAsync();
    if (gyroAvailable) {
      const {status} = await Gyroscope.requestPermissionsAsync();
      if (status === 'granted') {
        _subscribe();
      }
    }

    const {status: locationStatus} =
      await Location.requestForegroundPermissionsAsync();
    if (locationStatus === 'granted') {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        loc => setLocation(loc),
      );
    }

    const level = await Battery.getBatteryLevelAsync();
    setBatteryLevel(level);
  };

  // 2. Sensor Subscription
  const _subscribe = () => {
    Gyroscope.setUpdateInterval(100);
    setSubscription(
      Gyroscope.addListener(data => {
        setGyroData(data);

        if (isRecordingRef.current) {
          recordedData.current.push({
            timestamp: Date.now(),
            x: data.x,
            y: data.y,
            z: data.z,
          });
        }
      }),
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // 3. Recording Logic
  const toggleRecording = async () => {
    if (isRecording) {
      // STOP
      setIsRecording(false);
      isRecordingRef.current = false;
      await saveRecordingInternal();
    } else {
      // START
      recordedData.current = [];
      setStartTime(Date.now());
      setIsRecording(true);
      isRecordingRef.current = true;
    }
  };

  // 4. Internal Storage (AsyncStorage)
  const saveRecordingInternal = async () => {
    if (recordedData.current.length === 0) return;

    const endTime = Date.now();
    const durationSec = ((endTime - (startTime || endTime)) / 1000).toFixed(1);

    const newSession: RecordingSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      duration: `${durationSec}s`,
      samples: recordedData.current.length,
      data: recordedData.current, // Storing the actual data
    };

    const updatedHistory = [newSession, ...history];
    setHistory(updatedHistory); // Update UI

    try {
      // Save to persistent storage
      await AsyncStorage.setItem(
        'gyro-history',
        JSON.stringify(updatedHistory),
      );
      Alert.alert('Saved', 'Recording stored in app history.');
    } catch {
      Alert.alert('Error', 'Could not save to storage');
    }
  };

  // 5. Export/Share Logic
  const exportSession = async (session: RecordingSession) => {
    const header = 'Timestamp,X,Y,Z\n';
    const rows = session.data
      .map(d => `${d.timestamp},${d.x},${d.y},${d.z}`)
      .join('\n');

    const filename = `gyro_${session.id}.csv`;
    const fileUri = FileSystem.documentDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, header + rows, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  };

  const deleteSession = async (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    await AsyncStorage.setItem('gyro-history', JSON.stringify(updatedHistory));
  };

  const batLevelPercent =
    batteryLevel !== null ? (batteryLevel * 100).toFixed(0) : '--';

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-neutral-900">
      <LinearGradient
        colors={['#3498db', '#2ecc71']}
        className="pt-16 pb-8 px-6 rounded-b-3xl">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">MyGyro</Text>
            <Text className="text-white/80 mt-1">
              {isRecording
                ? `REC ● ${recordedData.current.length} pts`
                : 'Ready to Record'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleRecording}
            className={`p-4 rounded-full shadow-lg ${isRecording ? 'bg-red-500' : 'bg-white'}`}>
            {isRecording ? (
              <Activity color="white" size={28} />
            ) : (
              <RotateCw color="#3498db" size={28} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View className="p-4 -mt-6">
        {/* Weather Widget */}
        <WeatherWidget />

        {/* Live Monitor */}
        <View className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-5 mb-5">
          <View className="flex-row justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              Live Monitor
            </Text>
            <View className="flex-row items-center gap-1">
              <BatteryCharging color="#2ecc71" size={18} />
              <Text className="text-gray-500 font-bold">
                {batLevelPercent}%
              </Text>
            </View>
          </View>
          <AxisBar label="X" val={gyroData.x} color="bg-purple-500" />
          <AxisBar label="Y" val={gyroData.y} color="bg-indigo-500" />
          <AxisBar label="Z" val={gyroData.z} color="bg-pink-500" />

          <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Text className="text-sm font-bold text-gray-500 mb-3">
              GPS Data
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] mb-2">
                <Text className="text-xs text-gray-400">Latitude</Text>
                <Text className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {location?.coords.latitude.toFixed(4) ?? '--'}
                </Text>
              </View>
              <View className="w-[48%] mb-2">
                <Text className="text-xs text-gray-400">Longitude</Text>
                <Text className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {location?.coords.longitude.toFixed(4) ?? '--'}
                </Text>
              </View>
              <View className="w-[48%]">
                <Text className="text-xs text-gray-400">Altitude</Text>
                <Text className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {location?.coords.altitude?.toFixed(1) ?? '--'} m
                </Text>
              </View>
              <View className="w-[48%]">
                <Text className="text-xs text-gray-400">Speed</Text>
                <Text className="font-mono font-bold text-gray-800 dark:text-gray-200">
                  {location?.coords.speed?.toFixed(1) ?? '--'} m/s
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* History List */}
        <Text className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-3 px-1">
          Recording History ({history.length})
        </Text>

        {history.length === 0 ? (
          <Text className="text-center text-gray-400 py-8">
            No recordings yet.
          </Text>
        ) : (
          history.map(item => (
            <View
              key={item.id}
              className="bg-white dark:bg-neutral-800 p-4 rounded-xl mb-3 flex-row justify-between items-center shadow-sm">
              <View>
                <View className="flex-row items-center gap-2 mb-1">
                  <Clock color="#888" size={14} />
                  <Text className="text-gray-500 text-xs">{item.date}</Text>
                </View>
                <Text className="font-bold text-gray-800 dark:text-white">
                  {item.samples} samples{' '}
                  <Text className="font-normal text-gray-400">
                    ({item.duration})
                  </Text>
                </Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => exportSession(item)}
                  className="bg-blue-100 p-2 rounded-lg">
                  <ShareIcon size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteSession(item.id)}
                  className="bg-red-100 p-2 rounded-lg">
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View className="h-10" />
      </View>
    </ScrollView>
  );
}

const AxisBar = ({
  label,
  val,
  color,
}: {
  label: string;
  val: number;
  color: string;
}) => (
  <View className="mb-3">
    <View className="flex-row justify-between mb-1">
      <Text className="text-gray-600 dark:text-gray-400 font-bold">
        {label}
      </Text>
      <Text className="font-mono text-xs text-gray-500">{val.toFixed(2)}</Text>
    </View>
    <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <View
        className={`h-full ${color}`}
        style={{width: `${Math.min(Math.abs(val) * 50, 100)}%`}}
      />
    </View>
  </View>
);
