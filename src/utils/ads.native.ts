import { Platform } from "react-native";
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import mobileAds, { MaxAdContentRating, TestIds } from "react-native-google-mobile-ads";

// Google's public test ad unit IDs — resolve to the right platform's test ID
// automatically and are safe to ship while no real AdMob account is wired up.
// Swap for a real ad unit ID (from your own AdMob account) before release;
// see app.json's react-native-google-mobile-ads plugin config for the
// matching App ID swap.
export const BANNER_AD_UNIT_ID = TestIds.BANNER;

/**
 * Requests iOS App Tracking Transparency consent (no-op on Android, where
 * there's no ATT prompt), sets AdMob's global request configuration for a
 * general-audience/teen-appropriate app (not tagged as child-directed), and
 * initializes the SDK. Returns whether personalized ads are allowed, so ad
 * placements can set `requestNonPersonalizedAdsOnly` accordingly.
 */
export async function initializeAds(): Promise<{ personalizedAdsAllowed: boolean }> {
  let personalizedAdsAllowed = true;

  if (Platform.OS === "ios") {
    const { status: existing } = await getTrackingPermissionsAsync();
    const status = existing === "undetermined" ? (await requestTrackingPermissionsAsync()).status : existing;
    personalizedAdsAllowed = status === "granted";
  }

  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.T,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  });
  await mobileAds().initialize();

  return { personalizedAdsAllowed };
}
