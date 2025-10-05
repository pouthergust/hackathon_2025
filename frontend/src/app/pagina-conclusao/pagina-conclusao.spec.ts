import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaConclusao } from './pagina-conclusao';

describe('PaginaConclusao', () => {
  let component: PaginaConclusao;
  let fixture: ComponentFixture<PaginaConclusao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaConclusao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaConclusao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
