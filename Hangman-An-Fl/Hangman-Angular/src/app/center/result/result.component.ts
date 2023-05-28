import {Component, OnDestroy, OnInit} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {
  isCorrect = false;
  isFinished = false;
  isUnlockHintClicked = false;
  secretWord = '';
  numberOfIncorrects = undefined;
  isCorrectSubscription = undefined;
  isFinishedSubscription = undefined;
  isUnlockHintClickedSubscription = undefined;
  secretWordSubscription = undefined;
  numberOfIncorrectsSubscription = undefined;

  constructor(private masterService: MasterService) {
  }

  ngOnDestroy(): void {
    this.isCorrectSubscription?.unsubscribe();
    this.isFinishedSubscription?.unsubscribe();
    this.isUnlockHintClickedSubscription?.unsubscribe();
    this.secretWordSubscription?.unsubscribe();
    this.numberOfIncorrectsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.isCorrectSubscription = this.masterService.isCorrectBehaviorSubject.subscribe(isCorrect => {
      this.isCorrect = isCorrect;
    })
    this.isFinishedSubscription = this.masterService.isFinishedBehaviorSubject.subscribe(isFinished => {
      this.isFinished = isFinished;
    })
    this.isUnlockHintClickedSubscription = this.masterService.isUnlockHintClickedBehaviorSubject.subscribe(isUnlockHintClicked => {
      this.isUnlockHintClicked = isUnlockHintClicked;
    })
    this.secretWordSubscription = this.masterService.secretWordBehaviorSubject.subscribe(secretWord => {
      this.secretWord = secretWord;
    })
    this.numberOfIncorrectsSubscription = this.masterService.numberOfIncorrectsBehaviorSubject.subscribe(numberOfIncorrects => {
      this.numberOfIncorrects = numberOfIncorrects;
    })
  }
}
