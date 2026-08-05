import React from "react";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import type { TabParamList } from "./TabNavigator";
import { ShareSheetScreen } from "../screens/ShareSheetScreen";
import { QuoteDetailScreen } from "../screens/QuoteDetailScreen";

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Share: { quoteId: string };
  QuoteDetail: { quoteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="QuoteDetail"
        component={QuoteDetailScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Share"
        component={ShareSheetScreen}
        options={{ presentation: "transparentModal", animation: "slide_from_bottom" }}
      />
    </Stack.Navigator>
  );
}
