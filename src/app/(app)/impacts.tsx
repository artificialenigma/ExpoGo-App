import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { FocusAwareStatusBar } from '@/components/ui';
import { Activity, AlertTriangle, Zap } from 'lucide-react-native';

type ImpactEvent = {
    id: string;
    timestamp: number;
    magnitude: number;
};

export default function ImpactsScreen() {
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState<any>(null);
    const [totalG, setTotalG] = useState(0);
    const [impacts, setImpacts] = useState<ImpactEvent[]>([]);
    const [maxG, setMaxG] = useState(0);

    const lastImpactTime = useRef(0);
    const IMPACT_THRESHOLD = 1.5; // 1.5g
    const DEBOUNCE_TIME = 500; // 500ms

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    const _subscribe = () => {
        Accelerometer.setUpdateInterval(100);
        setSubscription(
            Accelerometer.addListener(accelerometerData => {
                setData(accelerometerData);

                // Calculate G-force magnitude
                const { x, y, z } = accelerometerData;
                const magnitude = Math.sqrt(x * x + y * y + z * z);
                setTotalG(magnitude);

                if (magnitude > maxG) {
                    setMaxG(magnitude);
                }

                // Detect Impact
                if (magnitude > IMPACT_THRESHOLD) {
                    const now = Date.now();
                    if (now - lastImpactTime.current > DEBOUNCE_TIME) {
                        lastImpactTime.current = now;
                        addImpact(magnitude);
                    }
                }
            }),
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const addImpact = (magnitude: number) => {
        const newImpact: ImpactEvent = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            magnitude,
        };
        setImpacts(prev => [newImpact, ...prev].slice(0, 50)); // Keep last 50
    };

    const clearHistory = () => {
        setImpacts([]);
        setMaxG(0);
    };

    const getImpactColor = (magnitude: number) => {
        if (magnitude > 2.0) return 'text-red-600';
        if (magnitude > 1.5) return 'text-orange-500';
        return 'text-gray-800';
    };

    const getBarColor = (magnitude: number) => {
        if (magnitude > 2.0) return 'bg-red-500';
        if (magnitude > 1.5) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
            <FocusAwareStatusBar />

            <ScrollView className="flex-1 px-4 pt-4">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Impact Monitor
                </Text>

                {/* G-Force Meter */}
                <View className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm mb-4 items-center">
                    <Text className="text-gray-500 dark:text-gray-400 mb-2">Current G-Force</Text>
                    <Text className={`text-5xl font-bold ${getImpactColor(totalG)}`}>
                        {totalG.toFixed(2)}g
                    </Text>
                    <View className="w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded-full mt-4 overflow-hidden">
                        <View
                            className={`h-full ${getBarColor(totalG)}`}
                            style={{ width: `${Math.min((totalG / 3) * 100, 100)}%` }}
                        />
                    </View>
                    <View className="flex-row justify-between w-full mt-2">
                        <Text className="text-xs text-gray-400">0g</Text>
                        <Text className="text-xs text-gray-400">1.5g</Text>
                        <Text className="text-xs text-gray-400">3.0g+</Text>
                    </View>
                </View>

                {/* Stats */}
                <View className="flex-row gap-4 mb-4">
                    <View className="flex-1 bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Zap size={20} color="#f59e0b" />
                            <Text className="text-gray-500 dark:text-gray-400 font-medium">Shocks</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                            {impacts.length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Activity size={20} color="#ef4444" />
                            <Text className="text-gray-500 dark:text-gray-400 font-medium">Max G</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                            {maxG.toFixed(2)}g
                        </Text>
                    </View>
                </View>

                {/* Recent Impacts */}
                <View className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden mb-8">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-100 dark:border-neutral-700">
                        <Text className="text-lg font-bold text-gray-800 dark:text-white">
                            Recent Impacts
                        </Text>
                        <TouchableOpacity onPress={clearHistory}>
                            <Text className="text-blue-500">Clear</Text>
                        </TouchableOpacity>
                    </View>

                    {impacts.length === 0 ? (
                        <View className="p-8 items-center">
                            <Text className="text-gray-400 text-center">No impacts detected yet.</Text>
                            <Text className="text-gray-400 text-xs text-center mt-1">
                                Shocks &gt; 1.5g will appear here.
                            </Text>
                        </View>
                    ) : (
                        impacts.map((impact, index) => (
                            <View
                                key={impact.id}
                                className={`flex-row justify-between items-center p-4 border-b border-gray-100 dark:border-neutral-700 ${index % 2 === 0 ? 'bg-gray-50/50 dark:bg-neutral-800' : ''
                                    }`}
                            >
                                <View className="flex-row items-center gap-3">
                                    <AlertTriangle
                                        size={20}
                                        color={impact.magnitude > 2.0 ? '#ef4444' : '#f59e0b'}
                                    />
                                    <View>
                                        <Text className="font-bold text-gray-800 dark:text-white">
                                            {impact.magnitude.toFixed(2)}g
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {new Date(impact.timestamp).toLocaleTimeString()}
                                        </Text>
                                    </View>
                                </View>
                                <View className={`px-2 py-1 rounded-full ${impact.magnitude > 2.0 ? 'bg-red-100' : 'bg-orange-100'
                                    }`}>
                                    <Text className={`text-xs font-bold ${impact.magnitude > 2.0 ? 'text-red-700' : 'text-orange-700'
                                        }`}>
                                        {impact.magnitude > 2.0 ? 'SEVERE' : 'BUMP'}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
