import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameRunningComponent } from './game-running.component';

describe('GameRunningComponent', () => {
  let component: GameRunningComponent;
  let fixture: ComponentFixture<GameRunningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRunningComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GameRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
