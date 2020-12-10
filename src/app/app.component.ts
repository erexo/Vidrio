import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';

import 'capacitor-dark-mode';

import { Plugins } from '@capacitor/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

const { DarkMode } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform,
    private renderer: Renderer2,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is("android") || this.platform.is("ios")) {
        this.initializeThemeListener();
      }
    });
  }

  private async initializeThemeListener(): Promise<void> {
    const darkMode: { isDarkModeOn: boolean } = await DarkMode.isDarkModeOn();
    this.setAppTheme(darkMode.isDarkModeOn);
    
    DarkMode.addListener("darkModeStateChanged", state => {
      this.setAppTheme(state.isDarkModeOn);
      this.changeDetectorRef.detectChanges();
    });
  }

  private setAppTheme(darkTheme: boolean): void {
    darkTheme
      ? this.renderer.addClass(document.body, 'dark')
      : this.renderer.removeClass(document.body, 'dark');
  }
}
