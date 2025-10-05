import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaIntroducao } from './pagina-introducao';

describe('PaginaIntroducao', () => {
  let component: PaginaIntroducao;
  let fixture: ComponentFixture<PaginaIntroducao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaIntroducao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaIntroducao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
