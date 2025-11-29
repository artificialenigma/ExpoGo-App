import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import MapView, { Polyline, Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Clock, MapPin } from 'lucide-react-native';
import { FocusAwareStatusBar } from '@/components/ui';

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
        gyro: { x: number; y: number; z: number };
        accel: { x: number; y: number; z: number };
        lat?: number;
        lon?: number;
        alt?: number;
        speed?: number;
    }[];
    impacts: {
        timestamp: number;
        magnitude: number;
        lat?: number;
        lon?: number;
    }[];
};

export default function MapScreen() {
    const [sessions, setSessions] = useState<RecordingSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<RecordingSession | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<RecordingSession['data'][0] | null>(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 25.2048,
        longitude: 55.2708,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    useFocusEffect(
        useCallback(() => {
            loadSessions();
        }, []),
    );

    const loadSessions = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('gyro-history');
            if (jsonValue != null) {
                const allSessions: RecordingSession[] = JSON.parse(jsonValue);
                // Filter sessions that have GPS data
                const sessionsWithGPS = allSessions.filter(session =>
                    session.data.some(d => d.lat != null && d.lon != null),
                );
                setSessions(sessionsWithGPS);
            }
        } catch (e) {
            console.error('Failed to load sessions', e);
        }
    };

    const selectSession = (session: RecordingSession) => {
        setSelectedSession(session);
        setSelectedSession(session);
        setSelectedPoint(null);

        // Extract coordinates
        const coords = session.data
            .filter(d => d.lat != null && d.lon != null)
            .map(d => ({
                latitude: d.lat!,
                longitude: d.lon!,
            }));

        if (coords.length > 0) {
            // Calculate bounds
            const lats = coords.map(c => c.latitude);
            const lons = coords.map(c => c.longitude);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLon = Math.min(...lons);
            const maxLon = Math.max(...lons);

            const centerLat = (minLat + maxLat) / 2;
            const centerLon = (minLon + maxLon) / 2;
            const deltaLat = (maxLat - minLat) * 1.5; // Add padding
            const deltaLon = (maxLon - minLon) * 1.5;

            setMapRegion({
                latitude: centerLat,
                longitude: centerLon,
                latitudeDelta: Math.max(deltaLat, 0.01),
                longitudeDelta: Math.max(deltaLon, 0.01),
            });
        }
    };

    const getRouteCoordinates = (session: RecordingSession) => {
        return session.data
            .filter(d => d.lat != null && d.lon != null)
            .map(d => ({
                latitude: d.lat!,
                longitude: d.lon!,
            }));
    };

    const getStartPoint = (session: RecordingSession) => {
        const coords = getRouteCoordinates(session);
        return coords.length > 0 ? coords[0] : null;
    };

    const getEndPoint = (session: RecordingSession) => {
        const coords = getRouteCoordinates(session);
        return coords.length > 0 ? coords[coords.length - 1] : null;
    };

    const calculateDistance = (coords: { latitude: number; longitude: number }[]) => {
        if (coords.length < 2) return 0;

        let distance = 0;
        for (let i = 1; i < coords.length; i++) {
            const lat1 = coords[i - 1].latitude;
            const lon1 = coords[i - 1].longitude;
            const lat2 = coords[i].latitude;
            const lon2 = coords[i].longitude;

            // Haversine formula
            const R = 6371; // Earth's radius in km
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distance += R * c;
        }
        return distance;
        return distance;
    };

    const onMapPress = (e: any) => {
        if (!selectedSession) return;

        const { coordinate } = e.nativeEvent;
        const validPoints = selectedSession.data.filter(d => d.lat != null && d.lon != null);

        if (validPoints.length === 0) return;

        // Find nearest point
        let minDist = Infinity;
        let nearest = null;

        validPoints.forEach(p => {
            const d = Math.sqrt(
                Math.pow(p.lat! - coordinate.latitude, 2) +
                Math.pow(p.lon! - coordinate.longitude, 2)
            );
            if (d < minDist) {
                minDist = d;
                nearest = p;
            }
        });

        // Threshold (approx 50-100m depending on zoom)
        if (minDist < 0.001 && nearest) {
            setSelectedPoint(nearest);
        } else {
            setSelectedPoint(null);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-neutral-900">
            <FocusAwareStatusBar />

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_DEFAULT}
                    region={mapRegion}
                    showsUserLocation
                    showsMyLocationButton
                    onPress={onMapPress}>
                    {selectedSession && (
                        <>
                            {/* Route Polyline */}
                            <Polyline
                                coordinates={getRouteCoordinates(selectedSession)}
                                strokeColor="#3b82f6"
                                strokeWidth={4}
                            />

                            {/* Start Marker */}
                            {getStartPoint(selectedSession) && (
                                <Marker
                                    coordinate={getStartPoint(selectedSession)!}
                                    title="Start"
                                    pinColor="green"
                                />
                            )}

                            {/* End Marker */}
                            {getEndPoint(selectedSession) && (
                                <Marker
                                    coordinate={getEndPoint(selectedSession)!}
                                    title="End"
                                    pinColor="red"
                                />
                            )}
                        </>
                    )}

                    {/* Impact Markers */}
                    {selectedSession && selectedSession.impacts && selectedSession.impacts.map((impact, index) => (
                        impact.lat && impact.lon && (
                            <Marker
                                key={`impact-${index}`}
                                coordinate={{
                                    latitude: impact.lat,
                                    longitude: impact.lon,
                                }}
                                pinColor="red"
                                zIndex={10}
                            >
                                <Callout>
                                    <View className="w-32 p-2">
                                        <Text className="font-bold text-red-600 mb-1">
                                            IMPACT DETECTED
                                        </Text>
                                        <Text className="text-lg font-bold">
                                            {impact.magnitude.toFixed(2)}g
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {new Date(impact.timestamp).toLocaleTimeString()}
                                        </Text>
                                    </View>
                                </Callout>
                            </Marker>
                        )
                    ))}

                    {/* Selected Point Marker */}
                    {selectedPoint && selectedPoint.lat && selectedPoint.lon && (
                        <Marker
                            coordinate={{
                                latitude: selectedPoint.lat,
                                longitude: selectedPoint.lon,
                            }}
                            pinColor="blue">
                            <Callout>
                                <View className="w-48 p-2">
                                    <Text className="font-bold mb-1">
                                        {new Date(selectedPoint.timestamp).toLocaleTimeString()}
                                    </Text>
                                    <Text className="text-xs">
                                        Speed: {selectedPoint.speed?.toFixed(1) ?? '--'} m/s
                                    </Text>
                                    <Text className="text-xs">
                                        Alt: {selectedPoint.alt?.toFixed(1) ?? '--'} m
                                    </Text>
                                    <View className="h-[1px] bg-gray-200 my-1" />
                                    <Text className="text-xs font-bold text-purple-600">
                                        Gyro: X:{selectedPoint.gyro.x.toFixed(2)} Y:{selectedPoint.gyro.y.toFixed(2)} Z:{selectedPoint.gyro.z.toFixed(2)}
                                    </Text>
                                    <Text className="text-xs font-bold text-red-600">
                                        Accel: X:{selectedPoint.accel.x.toFixed(2)} Y:{selectedPoint.accel.y.toFixed(2)} Z:{selectedPoint.accel.z.toFixed(2)}
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>
                    )}

                </MapView>

                {/* Selected Session Info Overlay */}
                {selectedSession && (
                    <View className="absolute bottom-4 left-4 right-4 rounded-xl bg-white p-4 shadow-lg dark:bg-neutral-800">
                        <Text className="mb-1 text-base font-bold text-gray-800 dark:text-white">
                            {selectedSession.samples} GPS points
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Distance: {calculateDistance(getRouteCoordinates(selectedSession)).toFixed(2)} km
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Duration: {selectedSession.duration}
                        </Text>
                    </View>
                )}
            </View>

            {/* Session List */}
            <View className="h-64 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-neutral-800">
                <Text className="px-4 py-3 text-lg font-bold text-gray-800 dark:text-white">
                    Driving History ({sessions.length})
                </Text>
                <ScrollView className="flex-1 px-4">
                    {sessions.length === 0 ? (
                        <View className="items-center justify-center py-8">
                            <MapPin color="#9ca3af" size={48} />
                            <Text className="mt-2 text-center text-gray-400">
                                No GPS routes recorded yet.
                            </Text>
                            <Text className="mt-1 text-center text-sm text-gray-400">
                                Record a session with location enabled.
                            </Text>
                        </View>
                    ) : (
                        sessions.map(session => (
                            <TouchableOpacity
                                key={session.id}
                                onPress={() => selectSession(session)}
                                className={`mb-3 rounded-xl p-4 ${selectedSession?.id === session.id
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'bg-gray-50 dark:bg-neutral-700'
                                    }`}>
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <View className="mb-1 flex-row items-center gap-2">
                                            <Clock color="#888" size={14} />
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                                {session.date}
                                            </Text>
                                        </View>
                                        <Text className="font-bold text-gray-800 dark:text-white">
                                            {session.samples} samples ({session.duration})
                                        </Text>
                                        {session.weather && (
                                            <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {session.weather.temp}°C, {session.weather.condition}
                                            </Text>
                                        )}
                                    </View>
                                    <MapPin
                                        color={selectedSession?.id === session.id ? '#3b82f6' : '#9ca3af'}
                                        size={24}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                    <View className="h-4" />
                </ScrollView>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
});
