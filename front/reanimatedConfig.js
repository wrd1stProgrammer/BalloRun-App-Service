import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
  } from 'react-native-reanimated';
  
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn, 
    strict: false,  // Disable strict mode
  });

  //바텀시트 때문에 적용한 거임