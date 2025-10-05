import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAgricultor } from './pagina-agricultor';

describe('PaginaAgricultor', () => {
  let component: PaginaAgricultor;
  let fixture: ComponentFixture<PaginaAgricultor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaAgricultor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaAgricultor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
