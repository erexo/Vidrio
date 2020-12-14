import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';

import { DragulaModule, DragulaService } from 'ng2-dragula';

import { AppRoutingModule } from '@app/app-routing.module';
import { CoreModule } from '@app/core/core.module';

import { APIInterceptorProvider } from '@app/core/providers/api-interceptor.provider';
import { HammerGestureProvider } from '@app/core/providers/hammer-gesture.provider';
import { IonicRouteProvider } from '@app/core/providers/ionic-route.provider';

import { AppComponent } from '@app/app.component';

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
    IonicRouteProvider,
    HammerGestureProvider,
    APIInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
