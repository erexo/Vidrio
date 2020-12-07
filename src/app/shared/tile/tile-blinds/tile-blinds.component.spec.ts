import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TileBlindsComponent } from './tile-blinds.component';

describe('TileBlindsComponent', () => {
  let component: TileBlindsComponent;
  let fixture: ComponentFixture<TileBlindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileBlindsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TileBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
