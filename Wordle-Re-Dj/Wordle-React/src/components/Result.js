import React from "react";
import classes from "./Result.module.css";

const Result = (props) => {
    return (
      <div className={classes.output}>
          {
              (props.isCorrect || (!props.isCorrect && (props.numberOfGuesses === 6 || props.isQuitClicked))) &&
              <hr className={classes.rulerResult}/>
          }
          {
              props.isCorrect &&
              (
                  <div className={classes.container}>
                      <div className={classes.result}>
                          <span>Score</span>
                          {/*<span>{parseFloat(`${props.numberOfGuesses * 100 / 6}`).toFixed(2)} %</span>*/}
                          <span>{props.numberOfGuesses} / 6</span>
                          <span>Hint Used</span>
                          <span>{props.isUnlockHintClicked && !(
                              props.hints[0] === '' &&
                              props.hints[1][0][0] === undefined &&
                              props.hints[2].length === 0
                          ) ? 'Yes' : 'No'}</span>
                          <span>Did Quit</span>
                          <span>{props.isQuitClicked ? 'Yes' : 'No'}</span>
                          <span>Secret Word</span>
                          <span>{props.secretWord}</span>
                      </div>
                      <div className={classes.winOrLose}>
                          <b>WON</b>
                      </div>
                  </div>
              )
          }
          {
              !props.isCorrect && (props.numberOfGuesses === 6 || props.isQuitClicked) &&
              (
                  <div className={classes.container}>
                      <div className={classes.result}>
                          <span>Score</span>
                          <span>N / A</span>
                          <span>Hint Used</span>
                          <span>{props.isUnlockHintClicked && !(
                              props.hints[0] === '' &&
                              props.hints[1][0][0] === undefined &&
                              props.hints[2].length === 0
                          ) ? 'Yes' : 'No'}</span>
                          <span>Did Quit</span>
                          <span>{props.isQuitClicked ? 'Yes' : 'No'}</span>
                          <span>Secret Word</span>
                          <span>{props.secretWord}</span>
                      </div>
                      <div className={classes.winOrLose}>
                          <b>LOST</b>
                      </div>
                  </div>
              )
          }
      </div>
    );
}

export default Result;