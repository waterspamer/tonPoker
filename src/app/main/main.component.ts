import { Component } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  loadingProgress: number = 0;
  loaded: boolean = false;
  gameInProgress: boolean = false;

  constructor(private readonly _gameService: GameService) {

  }

  onLoadingProgress(progress: number): void {
    this.loadingProgress = progress;
  }

  onLoaded(): void {
    this.loaded = true;
  }

  play(): void {
    this._gameService.startGame();
    this.gameInProgress = true;
  }
}
