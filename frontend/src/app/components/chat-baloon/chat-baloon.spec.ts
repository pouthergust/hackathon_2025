import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBaloon } from './chat-baloon';

describe('ChatBaloon', () => {
  let component: ChatBaloon;
  let fixture: ComponentFixture<ChatBaloon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBaloon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBaloon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
