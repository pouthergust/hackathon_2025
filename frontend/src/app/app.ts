import { Component, signal } from '@angular/core';
import { LivroCapa } from './pages/livro-capa/livro-capa';
import { ChatBaloon } from './components/chat-baloon/chat-baloon';
import { PaginaAgricultor } from "./pages/pagina-agricultor/pagina-agricultor";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LivroCapa, ChatBaloon, PaginaAgricultor],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hack25front');
}
