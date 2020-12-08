import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TileLightsComponent } from './tile-lights.component';

describe('TileLightsComponent', () => {
  let component: TileLightsComponent;
  let fixture: ComponentFixture<TileLightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileLightsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TileLightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
