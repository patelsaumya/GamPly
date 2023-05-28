import React from "react";
import classes from './Hints.module.css';
import Card from "../ui/Card";
// '#73777B'
const Hints = (props) => {
    return (
        <Card styleToApply={{background: 'dimgrey', marginTop: '20px'}}>
            {/*<Card classToAttach='bg-primary'>*/}
            <div>
                <h1 className={`card-title ${classes.cardTitle}`}>Hints</h1>
            </div>
            <hr />
            {!props.isConstructingHints ?
                <>
                    {
                        props.isQuitClicked &&
                        props.guesses.length < 6 &&
                        !props.isUnlockHintClicked &&
                        <div className={classes.noHints}>Game is finished</div>
                    }
                    {
                        props.guesses.length < 3 &&
                        !props.isCorrect &&
                        !props.isQuitClicked &&
                        <div className={classes.noHints}>Make at-least 3 guesses to unlock</div>
                    }
                    {
                        props.guesses.length < 3 &&
                        props.isCorrect &&
                        <div className={classes.noHints}>Kudos, You guessed it without any hints</div>
                    }
                    {
                        props.guesses.length >= 3 &&
                        props.guesses.length < 6 &&
                        !props.isUnlockHintClicked &&
                        !props.isQuitClicked &&
                        !props.isCorrect &&
                        <div className={classes.noHints}>
                            <button
                                className={`btn btn-active`}
                                onClick={props.onUnlockHint}
                            >Unlock My Lifesaver
                            </button>
                        </div>
                    }
                    {
                        props.guesses.length >= 3 &&
                        props.guesses.length <= 6 &&
                        !props.isUnlockHintClicked &&
                        props.isCorrect &&
                        <div className={classes.noHints}>Kudos, You guessed it without any hints</div>
                    }
                    {
                        props.guesses.length >= 3 &&
                        props.guesses.length <= 6 &&
                        props.isUnlockHintClicked &&
                        <div className={classes.container}>
                            {
                                props.hints[0] === '' &&
                                props.hints[1][0][0] === undefined &&
                                props.hints[2].length === 0 ?
                                <div className={classes.noHints}>
                                    You know the word, don't you ?
                                </div> :
                                <div className={classes.hints}>
                                    <span><b>Backbone</b></span>
                                    <span>{props.hints[0] === '' ? 'N/A' : <b>{props.hints[0]}</b>}</span>
                                    <span><b>Frequency</b></span>
                                    <span>
                                        {props.hints[1][0][0] === undefined ? 'N/A' :
                                            <ul>
                                                {props.hints[1].map(([char, freq]) => {
                                                    return <li key={Math.random()}>
                                                        <b>{char}</b> (x <i>{freq}</i> times)
                                                    </li>
                                                })}
                                            </ul>
                                        }
                                    </span>
                                    <span><b>Absence</b></span>
                                    <span>
                                        {props.hints[2].length === 0 ? 'N/A' :
                                            <>
                                                {
                                                    props.hints[2].slice(0, props.hints[2].length - 1).map(char => {
                                                        return <><b>{char}</b> | </>
                                                    })
                                                }
                                                <b>{props.hints[2][props.hints[2].length - 1]}</b>
                                            </>
                                        }
                                    </span>
                                </div>
                            }
                        </div>
                    }
                    {
                        props.guesses.length === 6 &&
                        !props.isUnlockHintClicked &&
                        !props.isCorrect &&
                        <div className={classes.noHints}>Game is finished</div>
                    }
                </> : <div className={classes.noHints}>Constructing the Hints...</div>
            }
        </Card>
    );
}

export default Hints;