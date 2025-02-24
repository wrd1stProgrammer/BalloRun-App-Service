import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";

const configureAdMob = async () => {
  await mobileAds().setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,

    // An array of test device IDs to allow.
    testDeviceIdentifiers: ["EMULATOR"],
  });
};

export const initializeAdMob = async () => {
  await configureAdMob();
  const adapterStatuses = await mobileAds().initialize();
  return adapterStatuses;
};