import {Component, OnDestroy, OnInit} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
  isFinished = false;
  numberOfIncorrects = 0;
  isCorrect = false;
  isFinishedSubscription = undefined;
  numberOfIncorrectsSubscription = undefined;
  isCorrectSubscription = undefined;

  constructor(private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.isFinishedSubscription = this.masterService.isFinishedBehaviorSubject.subscribe(isFinished => {
      this.isFinished = isFinished;
    })
    this.numberOfIncorrectsSubscription = this.masterService.numberOfIncorrectsBehaviorSubject.subscribe(numberOfIncorrects => {
      this.numberOfIncorrects = numberOfIncorrects;
    })
    this.isCorrectSubscription = this.masterService.isCorrectBehaviorSubject.subscribe(isCorrect => {
      this.isCorrect = isCorrect;
    })
  }

  ngOnDestroy(): void {
    this.isFinishedSubscription?.unsubscribe();
    this.numberOfIncorrectsSubscription?.unsubscribe();
    this.isCorrectSubscription?.unsubscribe();
  }

}
