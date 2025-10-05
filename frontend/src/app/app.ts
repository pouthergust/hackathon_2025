import { Component, Output, signal } from '@angular/core';
import { LivroCapa } from './pages/livro-capa/livro-capa';
import { ChatBaloon } from './components/chat-baloon/chat-baloon';
import { PaginaAgricultor } from "./pages/pagina-agricultor/pagina-agricultor";
import { PaginaVovo } from "./pages/pagina-vovo/pagina-vovo";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LivroCapa, ChatBaloon, PaginaAgricultor, PaginaVovo, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'hack25front';
  pagNumber = 1;

  increasePage() {
    this.pagNumber++;
  }

  decreasePage() {
    this.pagNumber--;
  }
}
