import { Component, inject } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-pagina-introducao',
  imports: [],
  templateUrl: './pagina-introducao.html',
  styleUrl: './pagina-introducao.scss'
})
export class PaginaIntroducao {
  private readonly api = inject(Api);
  answer = '';
  onClick() {
    // Consulta o endpoint v0/nasa usando o serviço Api
    const pergunta = 'O que é um tempestade solar?';
    this.api.nasa$(pergunta).subscribe({
      next: (res) => {
        this.answer = res?.answer || 'Nenhuma resposta encontrada';
      },
      error: (err) => {
        console.error('Erro ao consultar NASA:', err);
        this.answer = 'Erro ao consultar a NASA';
      }
    });
  }
}
