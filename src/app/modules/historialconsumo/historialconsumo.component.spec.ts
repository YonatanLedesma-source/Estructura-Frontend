import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialConsumoComponent } from './historialconsumo.component';

describe('HistorialConsumoComponent', () => {
  let component: HistorialConsumoComponent;
  let fixture: ComponentFixture<HistorialConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
