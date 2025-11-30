import * as React from 'react';

import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 bg-white px-6 dark:bg-black">
        <SafeAreaView className="flex-1">
          <View className="py-6">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-center text-4xl font-bold text-primary-600 dark:text-primary-400">
                About MyGyroApp
              </Text>
              <Text className="mt-2 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
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
                Whole-Body Vibration (WBV) and Driver Stress (DS). This app
                helps quantify road-induced motions and their impact on driver
                health parameters.
              </Text>

              <View className="mb-4 rounded-xl bg-white/50 p-4 dark:bg-black/20">
                <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  🚗 The Problem
                </Text>
                <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  • WBV from road surfaces affects driver vigilance and
                  increases stress{'\n'}• 55.30% of professional drivers
                  experience Low Back Pain{'\n'}• Poor road conditions impair
                  attention and decision-making
                </Text>
              </View>

              <View className="rounded-xl bg-white/50 p-4 dark:bg-black/20">
                <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  💡 Our Solution
                </Text>
                <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  Using ESP32 and gyroscope sensors, we collect real-world,
                  low-cost road data to link measurable road-induced motions
                  with physiological outcomes.
                </Text>
              </View>
            </View>

            {/* Technical Background */}
            <View className="mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 dark:from-blue-900/20 dark:to-indigo-800/20">
              <Text className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                📱 Technical Approach
              </Text>

              <Text className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                This digital systems project combines experimental and
                analytical methods to quantify how measurable road-induced
                motions affect key driver health parameters.
              </Text>

              <View className="space-y-3">
                <View className="rounded-xl bg-white/50 p-4 dark:bg-black/20">
                  <Text className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                    🔧 Hardware
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    ESP32 microcontroller with integrated gyroscope and
                    accelerometer sensors
                  </Text>
                </View>

                <View className="rounded-xl bg-white/50 p-4 dark:bg-black/20">
                  <Text className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                    📊 Data Collection
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    Real-time multi-sensor recording with GPS coordinates and
                    weather data
                  </Text>
                </View>

                <View className="rounded-xl bg-white/50 p-4 dark:bg-black/20">
                  <Text className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                    🔬 Analysis
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    CSV export for comprehensive data analysis and research
                    validation
                  </Text>
                </View>
              </View>
            </View>

            {/* Health Impact */}
            <View className="mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-100 p-6 dark:from-red-900/20 dark:to-pink-800/20">
              <Text className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                🏥 Health Impact
              </Text>

              <Text className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Whole-Body Vibration (WBV) transmitted through vehicle seats
                directly impacts driver health:
              </Text>

              <View className="mb-3 rounded-xl bg-white/50 p-4 dark:bg-black/20">
                <Text className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                  Physical Effects
                </Text>
                <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  • Low Back Pain (55.30% prevalence in professional drivers)
                  {'\n'}• Increased physical fatigue and drowsiness{'\n'}•
                  Long-term musculoskeletal disorders
                </Text>
              </View>

              <View className="rounded-xl bg-white/50 p-4 dark:bg-black/20">
                <Text className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                  Cognitive Effects
                </Text>
                <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  • Reduced vigilance and attention{'\n'}• Impaired
                  decision-making ability{'\n'}• Increased accident risk
                </Text>
              </View>
            </View>

            {/* Research Impact */}
            <View className="mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 p-6 dark:from-amber-900/20 dark:to-orange-800/20">
              <Text className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                🎓 Research Impact
              </Text>
              <Text className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                This digital systems project bridges the gap between real-world
                road data and driver health outcomes, contributing to:
              </Text>
              <Text className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                • Safer road infrastructure design{'\n'}• Improved occupational
                health for professional drivers{'\n'}• Evidence-based policy
                recommendations{'\n'}• Cost-effective road quality monitoring
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
