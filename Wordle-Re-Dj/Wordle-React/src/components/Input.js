import classes from './Input.module.css';
import React, {useEffect, useState} from "react";

const Input = (props) => {
    const [enteredWord, setEnteredWord] = useState('');
    const [isValidInput, setIsValidInput] = useState(false);

    useEffect(() => {
        let itemPresentInDictionary = undefined;
        if (props.guesses.includes(enteredWord)) {
            setIsValidInput(false);
        } else if (enteredWord.length === props.wordLength) {
            let isBreak = false;
            for (let i = 0; i < enteredWord.length; i++) {
                if (
                    !('a'.charCodeAt(0) <= enteredWord.charCodeAt(i) &&  enteredWord.charCodeAt(i) <= 'z'.charCodeAt(0))
                && !('A'.charCodeAt(0) <= enteredWord.charCodeAt(i) &&  enteredWord.charCodeAt(i) <= 'Z'.charCodeAt(0))
                ) {
                    setIsValidInput(false);
                    isBreak = true;
                    break;
                }
            }
            if (!isBreak) {
                itemPresentInDictionary = setTimeout(async () => {
                    // const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord}`)
                    const response = await fetch(`http://localhost:8000/apis/is-word-valid/${enteredWord}`);
                    const data = await response.text();
                    console.log(data);
                    if (data === 'True') {
                        setIsValidInput(true);
                    } else {
                        setIsValidInput(false);
                    }
                }, 500);
                setIsValidInput(false);

                // setIsValidInput(true);
            }
        } else {
            setIsValidInput(false);
        }

        return () => {
            if (itemPresentInDictionary) {
                clearTimeout(itemPresentInDictionary);
            }
        }
    }, [enteredWord]);

    const wordChangeHandler = (event) => {
        setEnteredWord(event.target.value.toUpperCase());
    }

    const submitWordHandler = (event) => {
        event.preventDefault();
        props.onAddGuess(enteredWord);
        setEnteredWord('');
        setIsValidInput(false);
    }

    return (
        <form
            className={classes.input}
            onSubmit={submitWordHandler}
        >
            <input
                type="text"
                placeholder={`Guess... (${props.wordLength} letter)`}
                className={`input input-bordered w-full max-w-xs`}
                onChange={wordChangeHandler}
                value={props.isQuitClicked || props.numberOfGuesses === 6 ? '': enteredWord}
                disabled={props.numberOfGuesses === 6 || props.isQuitClicked || props.isCorrect || props.isConstructingHints}
            />
            <button
                className={`btn btn-active ${classes.check}`}
                disabled={!isValidInput}
                type="submit"
            >Check</button>
            <div className={classes.quitAndReset}>
                <button
                    className={`btn btn-outline btn-warning`}
                    onClick={props.onReset}
                    disabled={props.isConstructingHints}
                    type="button"
                >{props.numberOfGuesses === 6 || props.isQuitClicked || props.isCorrect ? 'Play Again' : 'Reset'}</button>
                <button
                    className={`btn btn-outline btn-warning`}
                    onClick={props.onQuit}
                    disabled={props.isQuitClicked || props.isCorrect || props.numberOfGuesses === 6 || props.isConstructingHints}
                    type="button"
                >Quit</button>
            </div>
        </form>
    );
}

export default Input;