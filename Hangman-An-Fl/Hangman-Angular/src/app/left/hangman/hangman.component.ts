import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangmanComponent implements OnInit, OnDestroy {
  numberOfIncorrects = 0;
  numberOfIncorrectsSubscription = undefined;

  constructor(private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.numberOfIncorrectsSubscription = this.masterService.numberOfIncorrectsBehaviorSubject.subscribe(numberOfIncorrects => {
      this.numberOfIncorrects = numberOfIncorrects;
    })
  }

  ngOnDestroy(): void {
    this.numberOfIncorrectsSubscription?.unsubscribe();
  }


}
