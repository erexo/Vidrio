import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import 'capacitor-dark-mode';

const { DarkMode } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
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
    this.initializeThemeListener();
  }

  private initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private async initializeThemeListener(): Promise<void> {
    const nonMobilePlatform: boolean = !(this.platform.is("android") || this.platform.is("ios"));

    if (nonMobilePlatform) {
      DarkMode.registerDarkModeChangeListener();
    }
    
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
