import classes from './Progress.module.css';
import React from "react";
import Card from "../ui/Card";

const Progress = (props) => {
    let text = '';
    if (props.isQuitClicked) {
        text = 'You Quit'
        // text = <>You&nbsp;<b>Quit</b></>
    } else if (props.isCorrect) {
        text = 'You Won'
        // text = <>You&nbsp;<b>Won</b></>
    } else {
        if (props.numberOfGuesses < 6) {
            text = <>Guess Number:&nbsp;<b>{props.numberOfGuesses+1}</b>&nbsp;/&nbsp;<b>6</b></>
        } else {
            text = 'You Lost'
            // text = <>You&nbsp;<b>Lost</b></>
        }
    }
    return (
        <Card styleToApply={{background: '#005F99'}}>
        {/*<Card classToAttach='bg-primary'>*/}
            <div>
                <h1 className={`card-title ${classes.cardTitle}`}>Progress</h1>
            </div>
            <hr />
            <div className={classes.progress}>
                {text}
            </div>
        </Card>
    );
}

export default Progress;