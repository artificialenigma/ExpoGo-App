import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from 'expo-router';
import {LineChart} from 'react-native-gifted-charts';
import {ChevronDown, ChevronUp, Clock} from 'lucide-react-native';
import {FocusAwareStatusBar} from '@/components/ui';

type RecordingSession = {
  id: string;
  date: string;
  duration: string;
  samples: number;
  weather?: {
    temp: number;
    condition: string;
    location: string;
  };
  data: {
    timestamp: number;
    gyro: {x: number; y: number; z: number};
    accel: {x: number; y: number; z: number};
    lat?: number;
    lon?: number;
    alt?: number;
    speed?: number;
  }[];
};

export default function HistoricalDataScreen() {
  const [history, setHistory] = useState<RecordingSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('gyro-history');
      if (jsonValue != null) {
        setHistory(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          Historical Data
        </Text>

        {history.length === 0 ? (
          <View className="mt-20 items-center justify-center">
            <Text className="text-lg text-gray-400">No recordings found.</Text>
            <Text className="mt-2 text-sm text-gray-400">
              Go to &quot;My Gyro&quot; to record some data.
            </Text>
          </View>
        ) : (
          history.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              isExpanded={expandedId === session.id}
              onToggle={() => toggleExpand(session.id)}
            />
          ))
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}

const SessionCard = ({
  session,
  isExpanded,
  onToggle,
}: {
  session: RecordingSession;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  // Prepare data for charts
  // Downsample if too many points to keep performance high
  const step = Math.ceil(session.data.length / 50); // Limit to ~50 points
  const chartDataGyroX = session.data
    .filter((_, i) => i % step === 0)
    .map(d => ({value: d.gyro.x}));
  const chartDataGyroY = session.data
    .filter((_, i) => i % step === 0)
    .map(d => ({value: d.gyro.y}));
  const chartDataGyroZ = session.data
    .filter((_, i) => i % step === 0)
    .map(d => ({value: d.gyro.z}));

  const chartDataAccelX = session.data
    .filter((_, i) => i % step === 0)
    .map(d => ({value: d.accel.x}));
  const chartDataAccelY = session.data
    .filter((_, i) => i % step === 0)
    .map(d => ({value: d.accel.y}));
  const chartDataAccelZ = session.data
    .filter((_, i) => i % step === 0)
    .map(d => ({value: d.accel.z}));

  return (
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-neutral-800">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between p-4">
        <View>
          <View className="mb-1 flex-row items-center gap-2">
            <Clock color="#888" size={14} />
            <Text className="text-xs text-gray-500">{session.date}</Text>
          </View>
          <Text className="text-base font-bold text-gray-800 dark:text-white">
            {session.samples} samples{' '}
            <Text className="font-normal text-gray-400">
              ({session.duration})
            </Text>
          </Text>
          {session.weather && (
            <Text className="mt-1 text-xs text-gray-500">
              {session.weather.temp}°C, {session.weather.condition}
            </Text>
          )}
        </View>
        {isExpanded ? (
          <ChevronUp color="#888" size={20} />
        ) : (
          <ChevronDown color="#888" size={20} />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View className="border-t border-gray-100 p-4 dark:border-gray-700">
          <Text className="mb-2 text-sm font-bold text-gray-600 dark:text-gray-300">
            Gyroscope Data (rad/s)
          </Text>
          <View className="items-center overflow-hidden rounded-lg bg-gray-50 py-2 dark:bg-neutral-900">
            <LineChart
              data={chartDataGyroX}
              data2={chartDataGyroY}
              data3={chartDataGyroZ}
              height={150}
              width={Dimensions.get('window').width - 80}
              spacing={Dimensions.get('window').width / 60}
              initialSpacing={0}
              color1="#a855f7"
              color2="#6366f1"
              color3="#ec4899"
              dataPointsColor1="#a855f7"
              dataPointsColor2="#6366f1"
              dataPointsColor3="#ec4899"
              thickness={2}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
            />
          </View>
          <View className="mt-2 flex-row justify-center gap-4">
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-purple-500" />
              <Text className="text-xs text-gray-500">X</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-indigo-500" />
              <Text className="text-xs text-gray-500">Y</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-pink-500" />
              <Text className="text-xs text-gray-500">Z</Text>
            </View>
          </View>

          <Text className="mb-2 mt-6 text-sm font-bold text-gray-600 dark:text-gray-300">
            Accelerometer Data (m/s²)
          </Text>
          <View className="items-center overflow-hidden rounded-lg bg-gray-50 py-2 dark:bg-neutral-900">
            <LineChart
              data={chartDataAccelX}
              data2={chartDataAccelY}
              data3={chartDataAccelZ}
              height={150}
              width={Dimensions.get('window').width - 80}
              spacing={Dimensions.get('window').width / 60}
              initialSpacing={0}
              color1="#ef4444"
              color2="#22c55e"
              color3="#3b82f6"
              dataPointsColor1="#ef4444"
              dataPointsColor2="#22c55e"
              dataPointsColor3="#3b82f6"
              thickness={2}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
            />
          </View>
          <View className="mt-2 flex-row justify-center gap-4">
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-red-500" />
              <Text className="text-xs text-gray-500">X</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-green-500" />
              <Text className="text-xs text-gray-500">Y</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-blue-500" />
              <Text className="text-xs text-gray-500">Z</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
