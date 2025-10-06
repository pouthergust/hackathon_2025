import { Component } from '@angular/core';
import { ChatBaloon } from "../../components/chat-baloon/chat-baloon";

@Component({
  selector: 'app-pagina-vovo',
  standalone: true,
  imports: [ChatBaloon],
  templateUrl: './pagina-vovo.html',
  styleUrl: './pagina-vovo.scss'
})
export class PaginaVovo {

}
