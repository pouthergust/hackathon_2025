import { Component, Output, signal } from '@angular/core';
import { LivroCapa } from './pages/livro-capa/livro-capa';
import { ChatBaloon } from './components/chat-baloon/chat-baloon';
import { PaginaAgricultor } from "./pages/pagina-agricultor/pagina-agricultor";
import { PaginaVovo } from "./pages/pagina-vovo/pagina-vovo";
import { CommonModule } from '@angular/common';
import { PaginaFotografo } from "./pages/pagina-fotografo/pagina-fotografo";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LivroCapa, ChatBaloon, PaginaAgricultor, PaginaVovo, CommonModule, PaginaFotografo],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 
}
