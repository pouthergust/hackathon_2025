import { Component, Output, signal } from '@angular/core';
import { LivroCapa } from './pages/livro-capa/livro-capa';
import { ChatBaloon } from './components/chat-baloon/chat-baloon';
import { PaginaAgricultor } from "./pages/pagina-agricultor/pagina-agricultor";
import { PaginaVovo } from "./pages/pagina-vovo/pagina-vovo";
import { CommonModule } from '@angular/common';
import { PaginaFotografo } from "./pages/pagina-fotografo/pagina-fotografo";
import { PaginaSonho } from "./pages/pagina-sonho/pagina-sonho";
import { PaginaReflexao } from "./pages/pagina-reflexao/pagina-reflexao";
import { PaginaConclusao } from "./pages/pagina-conclusao/pagina-conclusao";
import { PaginaIntroducao } from "./pages/pagina-introducao/pagina-introducao";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LivroCapa, PaginaAgricultor, PaginaVovo, CommonModule, PaginaFotografo, PaginaSonho, PaginaReflexao, PaginaConclusao, PaginaIntroducao, ChatBaloon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 pagNumber = 0;

 increasePage() {
  this.pagNumber++;
 }

 decreasePage() {
  this.pagNumber--;
 }
}
