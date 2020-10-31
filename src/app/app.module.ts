import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { DragulaModule, DragulaService } from 'ng2-dragula';

import { AppComponent } from './app.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    DragulaModule.forRoot(),
    HammerModule
  ],
  providers: [
    DragulaService,
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
