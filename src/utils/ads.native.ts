import { Platform } from "react-native";
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import mobileAds, { MaxAdContentRating, TestIds } from "react-native-google-mobile-ads";

// Real banner ad unit (AdMob account: gyudonmaru). AdMob policy requires
// using test ads during development — clicking/serving your own real ad
// units outside production counts as invalid traffic — so __DEV__ still
// resolves to Google's public test ID. Release/preview/production builds
// (__DEV__ false) use the real one.
const REAL_BANNER_AD_UNIT_ID = "ca-app-pub-8619552988214526/8570019455";
export const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.BANNER : REAL_BANNER_AD_UNIT_ID;

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
