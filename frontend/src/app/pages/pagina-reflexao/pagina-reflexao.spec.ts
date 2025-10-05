import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaReflexao } from './pagina-reflexao';

describe('PaginaReflexao', () => {
  let component: PaginaReflexao;
  let fixture: ComponentFixture<PaginaReflexao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaReflexao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaReflexao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
