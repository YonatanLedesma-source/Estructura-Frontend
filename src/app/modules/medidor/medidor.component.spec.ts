import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidorComponent } from './medidor.component';

describe('MedidorComponent', () => {
  let component: MedidorComponent;
  let fixture: ComponentFixture<MedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
