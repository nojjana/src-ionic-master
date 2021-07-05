import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeesawGameComponent } from './seesaw-game.component';

describe('SeesawGameComponent', () => {
  let component: SeesawGameComponent;
  let fixture: ComponentFixture<SeesawGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeesawGameComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeesawGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
