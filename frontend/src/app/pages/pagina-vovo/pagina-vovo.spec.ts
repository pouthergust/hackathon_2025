import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaVovo } from './pagina-vovo';

describe('PaginaVovo', () => {
  let component: PaginaVovo;
  let fixture: ComponentFixture<PaginaVovo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaVovo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaVovo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
