import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroCapa } from './livro-capa';

describe('LivroCapa', () => {
  let component: LivroCapa;
  let fixture: ComponentFixture<LivroCapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroCapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroCapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
