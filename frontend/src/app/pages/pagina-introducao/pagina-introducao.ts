import { Component } from '@angular/core';

@Component({
  selector: 'app-pagina-introducao',
  imports: [],
  templateUrl: './pagina-introducao.html',
  styleUrl: './pagina-introducao.scss'
})
export class PaginaIntroducao {
  onClick() {
    console.log('Botão de tempestade solar clicado!');
  }
}
