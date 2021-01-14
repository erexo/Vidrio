import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlindsPage } from './blinds.page';

describe('BlindsPage', () => {
  let component: BlindsPage;
  let fixture: ComponentFixture<BlindsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlindsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlindsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
