import { Injectable } from "@angular/core";

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";

@Injectable()
class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

export const HammerGestureProvider = {
  provide: HAMMER_GESTURE_CONFIG,
  useClass: MyHammerConfig
}