import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Archive, Heart, Settings, Sun } from "lucide-react-native";
import { StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/HomeScreen";
import { ArchiveScreen } from "../screens/ArchiveScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { color, fontFamily } from "../theme/tokens";

export type TabParamList = {
  今日: undefined;
  アーカイブ: undefined;
  お気に入り: undefined;
  設定: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS = { 今日: Sun, アーカイブ: Archive, お気に入り: Heart, 設定: Settings } as const;

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: color.accent,
        tabBarInactiveTintColor: color.text,
        tabBarStyle: [
          styles.tabBar,
          { height: 64 + insets.bottom, paddingBottom: insets.bottom },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ color: c, size }) => {
          const Icon = ICONS[route.name];
          return <Icon color={c} size={size} strokeWidth={1.8} />;
        },
        tabBarLabel: ({ color: c }) => (
          <Text style={[styles.label, { color: c }]}>{route.name}</Text>
        ),
      })}
    >
      <Tab.Screen name="今日" component={HomeScreen} />
      <Tab.Screen name="アーカイブ" component={ArchiveScreen} />
      <Tab.Screen name="お気に入り" component={FavoritesScreen} />
      <Tab.Screen name="設定" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: color.bg,
    borderTopWidth: 2,
    borderTopColor: color.divider,
    height: 64,
    paddingTop: 10,
  },
  tabItem: { gap: 4 },
  label: {
    fontFamily: fontFamily.headingRegular,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
