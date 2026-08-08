// Web stub: react-native-google-mobile-ads is a native-only module and
// can't be bundled for web. Metro/webpack picks this file automatically for
// web builds via the .web.ts extension; ads.native.ts is used on iOS/Android.
export const BANNER_AD_UNIT_ID = "";

export async function initializeAds(): Promise<{ personalizedAdsAllowed: boolean }> {
  return { personalizedAdsAllowed: false };
}
