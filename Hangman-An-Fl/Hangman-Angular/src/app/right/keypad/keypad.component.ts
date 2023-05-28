import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.css']
})
export class KeypadComponent implements OnInit, OnDestroy {
  secretWordSubscription = undefined;
  keysGuessedSubscription = undefined;
  secretWord = '';
  isCorrect = {};

  constructor(private masterService: MasterService) {
  }

  keyClicked(key: string) {
    if (!this.masterService.isKeyAlreadyClicked(key)) {
      this.masterService.addKeyClicked(key);
      if (this.secretWord.includes(key)) {
        this.isCorrect[key] = true;
        this.masterService.addKeyGuessed(key);
      } else {
        this.isCorrect[key] = false;
        this.masterService.addIncorrect();
      }
    }
  }

  ngOnInit(): void {
    this.secretWordSubscription = this.masterService.secretWordBehaviorSubject.subscribe((secretWord) => {
      this.secretWord = secretWord;
    })
    for (const i of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      this.isCorrect[i] = undefined;
    }
    this.keysGuessedSubscription = this.masterService.keysGuessedBehaviorSubject.subscribe(keysGuessed => {
      if ((new Set(Array.from(this.secretWord))).size === keysGuessed.length) {
        this.masterService.isCorrectBehaviorSubject.next(true);
        this.masterService.isFinishedBehaviorSubject.next(true);
      }
    })
  }

  ngOnDestroy(): void {
    this.secretWordSubscription?.unsubscribe();
    this.keysGuessedSubscription?.unsubscribe();
  }
}
