import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.css']
})
export class HintsComponent implements OnInit, OnDestroy {
  numberOfIncorrects = 0;
  secretWord = '';
  isCorrect = false;
  isFinished = false;
  isCorrectSubscription = undefined;
  numberOfIncorrectsSubscription = undefined;
  secretWordSubscription = undefined;
  isFinishedSubscription = undefined;
  isUnlockHintClickedSubscription = undefined;
  isConstructingHintsSubscription = undefined;
  presenceHint = [];
  absenceHint = [];
  keysClicked = [];
  isUnlockHintClicked = false;
  isConstructingHints = false;

  constructor(private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.numberOfIncorrectsSubscription = this.masterService.numberOfIncorrectsBehaviorSubject.subscribe(numberOfIncorrects => {
      this.numberOfIncorrects = numberOfIncorrects;
    });
    this.secretWordSubscription = this.masterService.secretWordBehaviorSubject.subscribe((secretWord) => {
      this.secretWord = secretWord;
    });
    this.isCorrectSubscription = this.masterService.isCorrectBehaviorSubject.subscribe(isCorrect => {
      this.isCorrect = isCorrect;
    });
    this.isFinishedSubscription = this.masterService.isFinishedBehaviorSubject.subscribe(isFinished => {
      this.isFinished = isFinished;
    })
    this.isUnlockHintClickedSubscription = this.masterService.isUnlockHintClickedBehaviorSubject.subscribe(isUnlockHintClicked => {
      this.isUnlockHintClicked = isUnlockHintClicked;
    })
    this.isConstructingHintsSubscription = this.masterService.isConstructingHintsBehaviorSubject.subscribe(isConstructingHints => {
      this.isConstructingHints = isConstructingHints;
    })
  }

  ngOnDestroy(): void {
    this.numberOfIncorrectsSubscription?.unsubscribe();
    this.secretWordSubscription?.unsubscribe();
    this.isCorrectSubscription?.unsubscribe();
    this.isFinishedSubscription?.unsubscribe();
    this.isUnlockHintClickedSubscription?.unsubscribe();
    this.isConstructingHintsSubscription?.unsubscribe();
  }


  constructHints() {
    this.masterService.isConstructingHintsBehaviorSubject.next(true);
    this.keysClicked = this.masterService.getKeysClicked();
    let toBeKnownPresence = [];
    let toBeKnownAbsence = [];
    let presenceReveals = 0;
    let absenceReveals = 0;
    for (const i of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      if (!this.keysClicked.includes(i)) {
        if (this.secretWord.includes(i)) {
          toBeKnownPresence.push(i);
        } else {
          toBeKnownAbsence.push(i);
        }
      }
    }
    switch (toBeKnownPresence.length) {
      case 0:
        presenceReveals = 0;
        break;
      case 1:
      case 2:
      case 3:
      case 4:
        presenceReveals = 1;
        break;
      case 5:
      case 6:
      case 7:
      case 8:
        presenceReveals = 2;
        break;
      case 9:
      case 10:
      case 11:
      case 12:
        presenceReveals = 3;
        break;
    }
    switch (toBeKnownAbsence.length) {
      case 0:
        absenceReveals = 0;
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        absenceReveals = 1;
        break;
      case 6:
      case 7:
        absenceReveals = 2;
        break;
      case 8:
      case 9:
      case 10:
        absenceReveals = 3;
        break;
      case 11:
      case 12:
        absenceReveals = 4;
        break;
      case 13:
      case 14:
        absenceReveals = 5;
        break;
      case 15:
      case 16:
      case 17:
        absenceReveals = 6;
        break;
      case 18:
      case 19:
      case 20:
        absenceReveals = 7;
        break;
      case 21:
      case 22:
      case 23:
        absenceReveals = 8;
        break;
      case 24:
      case 25:
      case 26:
        absenceReveals = 9;
        break;

    }
    let indices = [];
    for (let i=0; i < toBeKnownPresence.length; i++) {
      indices.push(i);
    }
    for (let i=0; i < presenceReveals; i++) {
      if (indices.length === 0) {
        break;
      }
      let randomNumber = Math.floor(Math.random()*indices.length);
      let randomIndex = indices[randomNumber];
      this.presenceHint.push(toBeKnownPresence[randomIndex]);
      indices.splice(randomNumber, 1);
    }

    indices = [];
    for (let i=0; i < toBeKnownAbsence.length; i++) {
      indices.push(i);
    }
    for (let i=0; i < absenceReveals; i++) {
      if (indices.length === 0) {
        break;
      }
      let randomNumber = Math.floor(Math.random()*indices.length);
      let randomIndex = indices[randomNumber];
      this.absenceHint.push(toBeKnownAbsence[randomIndex]);
      indices.splice(randomNumber, 1);
    }
    this.masterService.isUnlockHintClickedBehaviorSubject.next(true);
    this.masterService.isConstructingHintsBehaviorSubject.next(false);
  }
}
