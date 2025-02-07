#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h> // Firebase import 추가
#import <RNKakaoLogins.h> // Kakao SDK 추가

@implementation AppDelegate

// openURL 메서드 통합 (중복 제거)
- (BOOL)application:(UIApplication *)application 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options 
{
  if ([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
    return [RNKakaoLogins handleOpenUrl:url];
  }

  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";
  self.initialProps = @{};

  // Firebase 초기화
  if ([FIRApp defaultApp] == nil) {     
    [FIRApp configure];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Universal Links
- (BOOL)application:(UIApplication *)application 
continueUserActivity:(nonnull NSUserActivity *)userActivity 
restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler 
{
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

@end
