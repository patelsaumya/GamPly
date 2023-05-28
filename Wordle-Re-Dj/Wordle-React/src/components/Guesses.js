import classes from './Guesses.module.css';
import React from "react";
import Guess from "./Guess";
import Card from "../ui/Card";

const Guesses = (props) => {
    let columnWidth = 100 / props.secretWord.length;

    let gridTemplateColumns = '';
    for (let i = 0; i < props.secretWord.length-1; i++) {
        gridTemplateColumns += `${columnWidth}% `
    }
    gridTemplateColumns += `${columnWidth}%`;
    return (
        <Card styleToApply={{background: '#D23369'}}>
        {/*<Card classToAttach='bg-primary'>*/}
            <div>
                <h1 className={`card-title ${classes.cardTitle}`}>Guesses</h1>
            </div>
            <hr />
            {props.guesses.length !== 0 ?
                (<div className={classes.guesses}
                     style={{gridTemplateColumns}}>
                    {props.colorEncoding.map(guessColorEncoding => {
                        return <Guess key={Math.random()} guessColorEncoding={guessColorEncoding} columnWidth={columnWidth}/>
                    })}
                </div>) : !props.isQuitClicked ? (<div className={classes.noGuesses}>Make some guesses</div>) :
                    (<div className={classes.noGuesses}>Cannot make any guesses</div>)
            }
        </Card>
    );
}

export default Guesses;