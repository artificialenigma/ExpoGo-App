import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { FocusAwareStatusBar, ScrollView, Text, View } from '@/components/ui';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { Laptop, Smartphone, Globe, Cpu } from 'lucide-react-native';

export default function Profile() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      setDeviceInfo({
        model: Device.modelName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        brand: Device.brand,
        manufacturer: Device.manufacturer,
      });

      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (e) {
        console.log('Error fetching IP', e);
        setIpAddress('Unavailable');
      }
    };

    fetchInfo();
  }, []);

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | null | undefined;
  }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-neutral-800">
      <View className="flex-row items-center gap-3">
        <View className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <Icon size={20} className="text-blue-500" color="#3b82f6" />
        </View>
        <Text className="text-gray-600 dark:text-gray-300 font-medium">
          {label}
        </Text>
      </View>
      <Text className="text-gray-900 dark:text-white font-bold">
        {value || 'Unknown'}
      </Text>
    </View>
  );

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 mb-8">
            Device & Network Information
          </Text>

          <View className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-5 shadow-sm">
            <Text className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
              Device Details
            </Text>

            <InfoRow
              icon={Platform.OS === 'ios' || Platform.OS === 'android' ? Smartphone : Laptop}
              label="Model"
              value={deviceInfo?.model}
            />
            <InfoRow
              icon={Cpu}
              label="OS Version"
              value={`${deviceInfo?.osName} ${deviceInfo?.osVersion}`}
            />
            <InfoRow
              icon={Globe}
              label="IP Address"
              value={ipAddress}
            />
            <InfoRow
              icon={Smartphone}
              label="Brand"
              value={deviceInfo?.brand}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
