import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MasterService} from "./services/master.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription = undefined;
  isLoading = false;
  constructor(private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.masterService.fetchSecretWord()
      .subscribe(response => {
        this.masterService.secretWordBehaviorSubject.next(response[0].toUpperCase());
        this.isLoading = false;
      })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
