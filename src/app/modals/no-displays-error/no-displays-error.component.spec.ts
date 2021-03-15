import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoDisplaysErrorComponent } from './no-displays-error.component';

describe('NoDisplaysErrorComponent', () => {
  let component: NoDisplaysErrorComponent;
  let fixture: ComponentFixture<NoDisplaysErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoDisplaysErrorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoDisplaysErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
