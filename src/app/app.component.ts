import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
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
    private renderer: Renderer2
  ) {
    if (this.platform.is("android") || this.platform.is("ios")) {
      this.initializeThemeListener();
    }
  }

  private async initializeThemeListener(): Promise<void> {
    DarkMode.registerDarkModeChangeListener();
    
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
