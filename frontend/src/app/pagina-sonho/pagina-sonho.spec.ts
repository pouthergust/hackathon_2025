import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaSonho } from './pagina-sonho';

describe('PaginaSonho', () => {
  let component: PaginaSonho;
  let fixture: ComponentFixture<PaginaSonho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaSonho]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaSonho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
