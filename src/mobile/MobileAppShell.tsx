'use client';

import React, { useEffect, useState } from 'react';
import { MobileBottomNavigation, useMobileNavigation } from './MobileBottomNavigation';
import { useViewport } from './ResponsiveLayout';
import { NativeDeviceFeatures } from './NativeDeviceFeatures';
import { Haptics } from './MobileOptimizations';

interface AppConfig {
  appName: string;
  version: string;
  buildNumber: string;
  minSupportedVersion: string;
  requiredPermissions: string[];
}

interface MobileAppState {
  isInitialized: boolean;
  isOnline: boolean;
  userPreferences: Record<string, any>;
}

/**
 * Main Mobile App Shell Component
 */
export function MobileAppShell() {
  const { activeTab, handleTabChange: changeTab } = useMobileNavigation('home');
  const viewport = useViewport();
  const [appState, setAppState] = useState<MobileAppState>({
    isInitialized: false,
    isOnline: true,
    userPreferences: {},
  });

  const appConfig: AppConfig = {
    appName: 'Kotravel Vedic Astrology',
    version: '1.0.0',
    buildNumber: '1',
    minSupportedVersion: '14.0',
    requiredPermissions: [
      'camera',
      'location',
      'calendar',
      'contacts',
      'notifications',
    ],
  };

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const unsubscribe = NativeDeviceFeatures.onConnectivityChange(isOnline => {
      setAppState(prev => ({ ...prev, isOnline }));
    });
    return () => unsubscribe();
  }, []);

  const initializeApp = async () => {
    try {
      await requestPermissions(appConfig.requiredPermissions);
      const preferences = await NativeDeviceFeatures.loadUserPreferences();
      setAppState(prev => ({
        ...prev,
        userPreferences: preferences,
        isInitialized: true,
      }));
      await NativeDeviceFeatures.registerForPushNotifications();
      console.log(`${appConfig.appName} v${appConfig.version} initialized`);
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  };

  const requestPermissions = async (permissions: string[]) => {
    for (const permission of permissions) {
      try {
        await NativeDeviceFeatures.requestPermission(permission);
      } catch (error) {
        console.warn(`Permission request for ${permission} failed:`, error);
      }
    }
  };

  const handleTabChange = (tabId: string) => {
    Haptics.tap();
    changeTab(tabId);
  };

  if (!appState.isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
        <div style={{ fontSize: 24, color: '#D4A574' }}>Loading Kotravel...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'home' && <HomeScreen isOnline={appState.isOnline} />}
        {activeTab === 'chart' && <ChartScreen />}
        {activeTab === 'dasha' && <DashaScreen />}
        {activeTab === 'transits' && <TransitsScreen />}
        {activeTab === 'menu' && <MenuScreen />}
      </div>

      <MobileBottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {!appState.isOnline && (
        <div style={{ backgroundColor: '#e74c3c', padding: '8px 16px', color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 'semibold' }}>
          ⚠️ Offline Mode - Limited functionality
        </div>
      )}
    </div>
  );
}

function HomeScreen({ isOnline }: { isOnline: boolean }) {
  return (
    <div style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>🌟 Welcome to Kotravel</h2>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Vedic Astrology at your fingertips</p>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderLeft: '4px solid #D4A574' }}>
        <h3 style={{ fontSize: 16, fontWeight: 'semibold', color: '#333', marginBottom: 12 }}>Quick Actions</h3>
        <button style={{ width: '100%', backgroundColor: '#D4A574', color: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 8, fontWeight: 'semibold', border: 'none', cursor: 'pointer' }}>
          📊 View Your Chart
        </button>
        <button style={{ width: '100%', backgroundColor: '#D4A574', color: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 8, fontWeight: 'semibold', border: 'none', cursor: 'pointer' }}>
          🔮 Today's Transits
        </button>
        <button style={{ width: '100%', backgroundColor: '#D4A574', color: '#fff', padding: '12px 16px', borderRadius: 8, fontWeight: 'semibold', border: 'none', cursor: 'pointer' }}>
          ⏱️ Dasha Timeline
        </button>
      </div>

      {!isOnline && (
        <p style={{ fontSize: 12, color: '#e74c3c', textAlign: 'center' }}>⚠️ Offline - Some features may be limited</p>
      )}
    </div>
  );
}

function ChartScreen() {
  return (
    <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>📊 Your Birth Chart</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, aspectRatio: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: '#999' }}>Chart will be rendered here</p>
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 14, fontWeight: 'semibold', color: '#333', marginBottom: 8 }}>Chart Overview</p>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Lagna: Taurus 12°</p>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Moon: Libra 25°</p>
        <p style={{ fontSize: 12, color: '#666' }}>Sun: Leo 15°</p>
      </div>
    </div>
  );
}

function DashaScreen() {
  return (
    <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>⏱️ Dasha Timeline</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>Current Dasha: Jupiter - Mercury</p>
        <p style={{ fontSize: 12, color: '#999' }}>Duration: 2024 - 2026</p>
      </div>
    </div>
  );
}

function TransitsScreen() {
  return (
    <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>🌍 Transit Analysis</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>Current Transits</p>
        <p style={{ fontSize: 12, color: '#999' }}>Loading transit data...</p>
      </div>
    </div>
  );
}

function MenuScreen() {
  return (
    <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>☰ Menu</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        {['Settings', 'Help & Support', 'Classical References', 'About Kotravel', 'Privacy Policy'].map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: 16,
              borderBottom: idx < 4 ? '1px solid #eee' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 14, color: '#333' }}>{item}</span>
            <span style={{ fontSize: 16, color: '#D4A574' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
