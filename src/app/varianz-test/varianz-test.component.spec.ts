import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VarianzTestComponent } from './varianz-test.component';

describe('VarianzTestComponent', () => {
  let component: VarianzTestComponent;
  let fixture: ComponentFixture<VarianzTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarianzTestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VarianzTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
