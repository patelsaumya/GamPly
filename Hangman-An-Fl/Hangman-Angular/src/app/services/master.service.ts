import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MasterService {
  public secretWordBehaviorSubject = new BehaviorSubject<string>('');
  public keysClicked = [];
  public keysGuessed = [];
  public keysGuessedBehaviorSubject = new BehaviorSubject<any>([]);
  public numberOfIncorrects = 0;
  public numberOfIncorrectsBehaviorSubject = new BehaviorSubject<number>(0);
  public isFinishedBehaviorSubject = new BehaviorSubject<boolean>(false);
  public isCorrectBehaviorSubject = new BehaviorSubject<boolean>(false);
  public isUnlockHintClickedBehaviorSubject = new BehaviorSubject<boolean>(false);
  public isConstructingHintsBehaviorSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {
  }

  initialize() {
    this.secretWordBehaviorSubject.next('');
    this.keysClicked = [];
    this.keysGuessed = [];
    this.keysGuessedBehaviorSubject.next([]);
    this.numberOfIncorrects = 0;
    this.numberOfIncorrectsBehaviorSubject.next(0);
    this.isFinishedBehaviorSubject.next(false);
    this.isCorrectBehaviorSubject.next(false);
    this.isUnlockHintClickedBehaviorSubject.next(false);
    this.isConstructingHintsBehaviorSubject.next(false);
  }

  fetchSecretWord() {
    const wordLengths = [2,3,4,5,6,7,8,9,10,11,12];
    const wordLength = wordLengths[Math.floor(Math.random()*wordLengths.length)];
    return this.httpClient.get(`https://random-word-api.herokuapp.com/word?length=${wordLength}&lang=en`);
  }

  getKeysClicked() {
    return [...this.keysClicked];
  }

  isKeyAlreadyClicked(key) {
    return this.keysClicked.includes(key);
  }

  addKeyClicked(key) {
    this.keysClicked.push(key);
  }

  addKeyGuessed(key) {
    this.keysGuessed.push(key);
    this.keysGuessedBehaviorSubject.next(Array.from(this.keysGuessed));
  }

  addIncorrect() {
    this.numberOfIncorrects += 1;
    this.numberOfIncorrectsBehaviorSubject.next(this.numberOfIncorrects);
    if (this.numberOfIncorrects === 6) {
      this.isFinishedBehaviorSubject.next(true);
      this.isCorrectBehaviorSubject.next(false);
    } else {
      this.isFinishedBehaviorSubject.next(false);
      this.isCorrectBehaviorSubject.next(false);
    }
  }
}
