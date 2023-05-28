import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit, OnDestroy {
  isFinished = false;
  isFinishedSubscription = undefined;
  constructor(private masterService: MasterService) {
  }
  onQuit() {
    this.masterService.isFinishedBehaviorSubject.next(true);
    this.masterService.isCorrectBehaviorSubject.next(false);
  }

  ngOnInit(): void {
    this.isFinishedSubscription = this.masterService.isFinishedBehaviorSubject.subscribe(isFinished => {
      this.isFinished = isFinished;
    })
  }

  ngOnDestroy(): void {
    this.isFinishedSubscription?.unsubscribe();
  }

  onReset() {

  }
}
