import {
  AfterViewChecked,
	Directive,
	ElementRef,
	EventEmitter,
	OnDestroy,
	Output,
	Renderer2
} from '@angular/core';
import { IonTabButton } from '@ionic/angular';

import 'hammerjs';

@Directive({
	selector: '[swipeTab]',
})

export class SwipeTabDirective implements AfterViewChecked, OnDestroy {
	@Output() tabChange = new EventEmitter();
	
	public tabNames: String[] = [];
	
	private currentTabIndex = 0;
	private tabCount = 0;
	private swipeCoords: [number, number];
	private swipeDuration: number;
	private browserSwipeGesture: HammerManager;
	private touchListenersFns = [];
	
	constructor(
		public elementRef: ElementRef,
		private renderer: Renderer2
	) {}
		
	ngAfterViewChecked() {
    const tabButtonsList: NodeList
      = this.elementRef.nativeElement.querySelectorAll('ion-tab-button');
    const tabButtonsArray: IonTabButton[]
      = <IonTabButton[]><unknown>Array.from(tabButtonsList);
    
    this.tabNames = tabButtonsArray.map(tabButton => tabButton.tab);
		this.tabCount = this.tabNames.length - 1;
	}
		
  ngOnDestroy() {
    if (this.touchListenersFns.length) {
      this.touchListenersFns.forEach(fn => fn());
    } else if (this.browserSwipeGesture) {
      this.browserSwipeGesture.off('swipe');
    }
  }
		
	public onTabInitialized(tabName: string): void {
		this.currentTabIndex = this.tabNames.indexOf(tabName);
		
		const currentTabName: string = `app-${tabName}`;
		const elem: HTMLElement = this.elementRef.nativeElement.querySelectorAll(currentTabName)[0];
		
		if (!elem) {
			throw new Error('Make sure tab selector has app prefix');
		} else {
			const content: HTMLIonContentElement = elem.getElementsByTagName('ion-content')[0];
			
			if (content.querySelector('.swipe-area') === null) {
				this.createWrapperDiv(content);
			}
		}
	}
	
	private createWrapperDiv(content: HTMLElement): void {
		const divElement: HTMLElement = this.renderer.createElement('div');
		this.renderer.addClass(divElement, 'swipe-area');
		this.renderer.insertBefore(content, divElement, null);
		
		while (content.children.length > 1) {
			const child: Element = content.children[0];
			this.renderer.removeChild(content, child);
			this.renderer.appendChild(divElement, child);
		}
		
		this.addEventListeners(divElement);
	}
	
	private addEventListeners(divElement: HTMLElement) {
		if ('ontouchstart' in document.documentElement) {
			this.touchListenersFns.push(
				this.renderer.listen(divElement, 'touchstart', ($event) => {
					this.deviceSwipeHandler($event, 'start');
				}),
				this.renderer.listen(divElement, 'touchend', ($event) => {
					this.deviceSwipeHandler($event, 'end');
				})
				);
			} else {
				this.browserSwipeGesture = new Hammer(divElement);
				this.browserSwipeGesture.on('swipe', (event) => {
					this.browserSwipeHandler(event);
				});
			}
		}
		
  private deviceSwipeHandler(event: TouchEvent, status: string): void {
		const coords: [number, number] = [event.changedTouches[0].pageX, event.changedTouches[0].pageY];
		const time: number = new Date().getTime();
		
		if (status === 'start') {
			this.swipeCoords = coords;
			this.swipeDuration = time;
		} else if (status === 'end') {
			const direction: number[] = [coords[0] - this.swipeCoords[0], coords[1] - this.swipeCoords[1]];
			const duration: number = time - this.swipeDuration;
			
			if (duration < 1000 && Math.abs(direction[0]) > 50
			&& Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
				if (direction[0] > 0) {
					this.moveBackward();
				} else {
					this.moveForward();
				}
			}
		}
	}
	
	private browserSwipeHandler(event) {
		switch (event.direction) {
			case 2:
			this.moveForward();
			break;
			
			case 4:
			this.moveBackward();
			break;
			
			default:
			break;
		}
	}
	
	private moveForward(): void {
		if (this.currentTabIndex < this.tabCount) {
			this.currentTabIndex++;
			this.tabChange.emit(this.tabNames[this.currentTabIndex]);
		}
	}
	
	private moveBackward(): void {
		if (this.currentTabIndex > 0) {
			this.currentTabIndex--;
			this.tabChange.emit(this.tabNames[this.currentTabIndex]);
		}
	}
}