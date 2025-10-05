import { Component, signal } from '@angular/core';
import { LivroCapa } from './livro-capa/livro-capa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LivroCapa],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hack25front');
}
