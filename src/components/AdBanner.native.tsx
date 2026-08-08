import React from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { BANNER_AD_UNIT_ID } from "../utils/ads";
import { useAppData } from "../context/AppDataContext";
import { color, space } from "../theme/tokens";

/** A single adaptive banner placement, used at the bottom of the Home screen. */
export function AdBanner() {
  const { personalizedAdsAllowed } = useAppData();

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: !personalizedAdsAllowed }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: color.divider,
    paddingTop: space[3],
  },
});
