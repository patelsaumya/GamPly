import classes from './Guess.module.css';
import React from "react";

const Guess = (props) => {
    let widthOfEachCharacter = props.columnWidth * 100 / 33.33;
    return (
        <>
            {props.guessColorEncoding.map(character => {
                return (
                    <div key={Math.random()} className={classes.badgeHolder}>
                        <div
                        style={{width: `${widthOfEachCharacter}px`}}
                        className={`badge ${classes[character.classToAttach]} ${classes.character}`}>
                            {character.char}
                        </div>
                    </div>
                )
            })}
        </>
    );
}

export default Guess;