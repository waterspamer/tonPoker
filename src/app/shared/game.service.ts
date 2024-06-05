import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, mergeMap, Observable, of, Subject, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _state$ = new BehaviorSubject<any>(null);

  get session$(): Observable<any> {
    return this._state$.asObservable();
  }

  get session(): any {
    return this._state$.getValue();
  }

  private _gameStart$ = new Subject<void>();

  get gameStart$(): Observable<void> {
    return this._gameStart$.asObservable();
  }

  constructor() {}

  startGame(): void {
    this._gameStart$.next();
  }
}
