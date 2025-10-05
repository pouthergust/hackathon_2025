import { Component } from '@angular/core';
import { ChatBaloon } from "../../components/chat-baloon/chat-baloon";

@Component({
  selector: 'app-livro-capa',
  standalone: true,
  imports: [ChatBaloon],
  templateUrl: './livro-capa.html',
  styleUrl: './livro-capa.scss'
})
export class LivroCapa {

}
