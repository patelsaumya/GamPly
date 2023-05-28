import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent implements OnInit, OnDestroy {
  @Input() key: string;
  @Input() isCorrect: any;
  @Output() keyClicked = new EventEmitter<string>();
  subscription = undefined;
  isFinished = false;

  constructor(private masterService: MasterService) {
  }

  clicked() {
    if (this.isCorrect === undefined && !this.isFinished) {
      this.keyClicked.emit(this.key);
    }
  }

  ngOnInit(): void {
    this.subscription = this.masterService.isFinishedBehaviorSubject.subscribe(isFinished => {
      this.isFinished = isFinished;
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
