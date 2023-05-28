import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MasterService} from "../../services/master.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-guess',
  templateUrl: './guess.component.html',
  styleUrls: ['./guess.component.css']
})
export class GuessComponent implements OnInit, OnDestroy {
  secretWordSubscription = undefined;
  keysGuessedSubscription = undefined;
  isFinishedSubscription = undefined;
  secretWord = '';
  gridTemplateColumns = '';
  keysGuessed = [];
  isFinished = false;

  constructor(private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.secretWordSubscription = this.masterService.secretWordBehaviorSubject.subscribe((secretWord) => {
      this.secretWord = secretWord;
      for (let i=0; i < secretWord.length; i++) {
        if (i !== secretWord.length-1) {
          this.gridTemplateColumns += (100-2*(secretWord.length-1))/(secretWord.length) + '% ';
        } else {
          this.gridTemplateColumns += (100-2*(secretWord.length-1))/(secretWord.length) + '%';
        }
      }
    })
    this.keysGuessedSubscription = this.masterService.keysGuessedBehaviorSubject.subscribe(keysGuessed => {
      this.keysGuessed = [...keysGuessed];
    })
    this.isFinishedSubscription = this.masterService.isFinishedBehaviorSubject.subscribe(isFinished => {
      this.isFinished = isFinished;
    })

  }

  ngOnDestroy(): void {
    this.secretWordSubscription?.unsubscribe();
    this.keysGuessedSubscription?.unsubscribe();
    this.isFinishedSubscription?.unsubscribe();
  }
}
