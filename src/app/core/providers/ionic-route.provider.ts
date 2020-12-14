import { RouteReuseStrategy } from "@angular/router";

import { IonicRouteStrategy } from "@ionic/angular";

export const IonicRouteProvider = {
  provide: RouteReuseStrategy,
  useClass: IonicRouteStrategy
};