import {useRouter} from 'expo-router';
import React from 'react';
import {ScrollView} from 'react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';

import {useAuth} from '@/app/providers/auth/auth-provider';

export default function Onboarding() {
  const {setIsFirstTime} = useAuth();
  const router = useRouter();

  return (
    <View className="flex h-full bg-white dark:bg-black">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-6">
        <View className="py-8">
          {/* Header */}
          <View className="mb-8 mt-4">
            <Text className="text-center text-5xl font-bold text-primary-600 dark:text-primary-400">
              MyGyroApp
            </Text>
            <Text className="mt-2 text-center text-xl font-semibold text-gray-700 dark:text-gray-300">
              Road Anomaly Detection System
            </Text>
          </View>

          {/* Project Overview */}
          <View className="mb-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 dark:from-primary-900/20 dark:to-primary-800/20">
            <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Why MyGyroApp?
            </Text>

            <Text className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Road conditions significantly influence driver health through
              Whole-Body Vibration (WBV) and Driver Stress (DS). This app helps
              quantify road-induced motions and their impact on driver health
              parameters.
            </Text>

            <View className="mb-4 rounded-xl bg-white/50 p-4 dark:bg-black/20">
              <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                🚗 The Problem
              </Text>
              <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                • WBV from road surfaces affects driver vigilance and increases
                stress{'\n'}• 55.30% of professional drivers experience Low Back
                Pain{'\n'}• Poor road conditions impair attention and
                decision-making
              </Text>
            </View>

            <View className="rounded-xl bg-white/50 p-4 dark:bg-black/20">
              <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                💡 Our Solution
              </Text>
              <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                Using ESP32 and gyroscope sensors, we collect real-world,
                low-cost road data to link measurable road-induced motions with
                physiological outcomes.
              </Text>
            </View>
          </View>

          {/* Features */}
          <View className="mb-6">
            <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Key Features
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                <Text className="mr-3 text-3xl">📊</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    Multi-Sensor Recording
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Gyroscope, accelerometer, and motion data
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                <Text className="mr-3 text-3xl">📍</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    GPS Tracking
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time location per sample
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                <Text className="mr-3 text-3xl">🌤️</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    Weather Integration
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Environmental data per session
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
                <Text className="mr-3 text-3xl">📁</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    CSV Export
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Easy data analysis and sharing
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Research Impact */}
          <View className="mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 p-6 dark:from-amber-900/20 dark:to-orange-800/20">
            <Text className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              🎓 Research Impact
            </Text>
            <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              This digital systems project bridges the gap between real-world
              road data and driver health outcomes, contributing to safer road
              infrastructure and improved occupational health for professional
              drivers.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <SafeAreaView className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-black">
        <Button
          label="Get Started"
          onPress={async () => {
            await setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
