import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaFotografo } from './pagina-fotografo';

describe('PaginaFotografo', () => {
  let component: PaginaFotografo;
  let fixture: ComponentFixture<PaginaFotografo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaFotografo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaFotografo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
