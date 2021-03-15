import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WrongLobbyCodeComponent } from './wrong-lobby-code.component';

describe('WrongLobbyCodeComponent', () => {
  let component: WrongLobbyCodeComponent;
  let fixture: ComponentFixture<WrongLobbyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrongLobbyCodeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WrongLobbyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
