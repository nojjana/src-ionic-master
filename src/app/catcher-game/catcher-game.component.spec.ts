import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CatcherGameComponent } from './catcher-game.component';

describe('CatcherGameComponent', () => {
  let component: CatcherGameComponent;
  let fixture: ComponentFixture<CatcherGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatcherGameComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatcherGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
