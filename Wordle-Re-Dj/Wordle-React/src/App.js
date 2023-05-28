import React, {useEffect, useState} from "react";
import classes from './App.module.css';
import Progress from "./components/Progress";
import Input from "./components/Input";
import Guesses from "./components/Guesses";
import Hints from "./components/Hints";
import Result from "./components/Result";

async function getSecretWord() {
    let possibleWordLength = [2,3,4,5,6,7,8,9,10,11,12];
    let wordLength = possibleWordLength[Math.floor(Math.random() * possibleWordLength.length)];
    // return fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}&lang=en`);
    return fetch(`http://localhost:8000/apis/fetch-word-by-length/${wordLength}`);
}

function constructCorrectlyKnownPlacesFrequencyAbsence(secretWord, guesses) {
    let correctlyKnownPlacesFrequencyAbsence = {places: [], frequency: [], absence: []};
    let correctFrequencyAbsence = {frequency: {}, absence: []};
    let knownFrequencies = new Set();
    for (let i of secretWord) {
        if (Object.keys(correctFrequencyAbsence.frequency).includes(i))  {
            correctFrequencyAbsence.frequency[i] += 1;
        } else {
            correctFrequencyAbsence.frequency[i] = 1;
        }
    }
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i of alphabets) {
        if (!secretWord.includes(i)) {
            correctFrequencyAbsence.absence.push(i);
        }
    }
    for (let guess of guesses) {
        let frequencyAbsence = {frequency: {}, absence: []};
        for (let i of guess) {
            if (Object.keys(frequencyAbsence.frequency).includes(i))  {
                frequencyAbsence.frequency[i] += 1;
            } else {
                frequencyAbsence.frequency[i] = 1;
            }
        }
        for (let i of alphabets) {
            if (guess.includes(i) && !secretWord.includes(i)) {
                frequencyAbsence.absence.push(i);
            }
        }
        for (let i in correctFrequencyAbsence.frequency) {
            if (!correctlyKnownPlacesFrequencyAbsence.frequency.includes(i) &&
                Object.keys(frequencyAbsence.frequency).includes(i)) {
                if (frequencyAbsence.frequency[i] > correctFrequencyAbsence.frequency[i]) {
                    correctlyKnownPlacesFrequencyAbsence.frequency.push(i);
                } else if (frequencyAbsence.frequency[i] === correctFrequencyAbsence.frequency[i]) {
                    knownFrequencies.add(i);
                }
            }
        }
        for (let i of correctFrequencyAbsence.absence) {
            if (!correctlyKnownPlacesFrequencyAbsence.absence.includes(i) &&
                frequencyAbsence.absence.includes(i)) {
                correctlyKnownPlacesFrequencyAbsence.absence.push(i);
            }
        }
        for (let i=0; i < secretWord.length; i++) {
            if (!correctlyKnownPlacesFrequencyAbsence.places.includes(i) &&
                secretWord[i] === guess[i]) {
                correctlyKnownPlacesFrequencyAbsence.places.push(i);
            }
        }
    }

    if (knownFrequencies.size === Object.keys(correctFrequencyAbsence.frequency).length) {
        correctlyKnownPlacesFrequencyAbsence.frequency = [];
        for (let i in correctFrequencyAbsence.frequency) {
            correctlyKnownPlacesFrequencyAbsence.frequency.push(i);
        }
        correctlyKnownPlacesFrequencyAbsence.absence = Array.from(alphabets);
    }

    return correctlyKnownPlacesFrequencyAbsence;
}

function constructBackboneHints(secretWord, numberOfReveals, correctlyKnownPlacesFrequencyAbsence) {
    const indices = [];
    let backboneHints = '';
    const randomIndices = [];

    for (let i=0; i < secretWord.length; i++) {
        if (!correctlyKnownPlacesFrequencyAbsence.places.includes(i)) {
            indices.push(i);
        }
    }

    for (let i=0; i < numberOfReveals; i++) {
        if (indices.length === 0) {
            break;
        }
        let randomNumber = Math.floor(Math.random() * indices.length);
        let randomIndex = indices[randomNumber];
        randomIndices.push(randomIndex);
        indices.splice(randomNumber, 1);
    }
    for (let i=0; i < secretWord.length; i++) {
        if (randomIndices.includes(i)) {
            backboneHints += secretWord[i];
        } else {
            backboneHints += '_';
        }
        if (i !== secretWord.length-1) {
            backboneHints += ' ';
        }
    }

    return backboneHints;
}

function constructFreqHints(secretWord, numberOfReveals, correctlyKnownPlacesFrequencyAbsence) {
    let freqHints = [];
    const indices = [];
    let frequency = {};

    for (let i = 0; i < secretWord.length; i++) {
        frequency[secretWord[i]] = 1 + ((secretWord[i] in frequency) ? frequency[secretWord[i]] : 0);
    }
    let uniqueAlphabets = Object.keys(frequency);
    for (let i=0; i < uniqueAlphabets.length; i++) {
        if (!correctlyKnownPlacesFrequencyAbsence.frequency.includes(uniqueAlphabets[i])) {
            indices.push(i);
        }
    }
    for (let i=0; i < numberOfReveals; i++) {
        if (indices.length === 0) {
            break;
        }
        let randomNumber = Math.floor(Math.random() * indices.length);
        let randomIndex = indices[randomNumber];
        indices.splice(randomNumber, 1);
        freqHints.push([uniqueAlphabets[randomIndex], frequency[uniqueAlphabets[randomIndex]]]);
    }

    return freqHints;
}

function constructNonExistenceHints(secretWord, numberOfReveals, correctlyKnownPlacesFrequencyAbsence) {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nonExistenceHints = [];
    let doesNotInclude = [];
    let indices = [];

    for (let i of alphabets) {
        if (!secretWord.includes(i)) {
            doesNotInclude.push(i);
        }
    }
    for (let i = 0; i < doesNotInclude.length; i++) {
        if (!correctlyKnownPlacesFrequencyAbsence.absence.includes(doesNotInclude[i])) {
            indices.push(i);
        }
    }
    for (let i=0; i < numberOfReveals; i++) {
        if (indices.length === 0) {
            break;
        }
        let randomNumber = Math.floor(Math.random() * indices.length);
        let randomIndex = indices[randomNumber];
        nonExistenceHints.push(doesNotInclude[randomIndex]);
        indices.splice(randomNumber, 1);
    }

    return nonExistenceHints;
}

function constructHints(secretWord, guesses) {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const hints = [];
    const correctlyKnownPlacesFrequencyAbsence = constructCorrectlyKnownPlacesFrequencyAbsence(secretWord, guesses);

    switch (secretWord.length-correctlyKnownPlacesFrequencyAbsence.places.length) {
        case 0: {
            hints.push('');
            break;
        }
        case 1:
        case 2:
        case 3:
        case 4: {
            hints.push(constructBackboneHints(secretWord, 1, correctlyKnownPlacesFrequencyAbsence));
            break;
        }
        case 5:
        case 6:
        case 7:
        case 8: {
            hints.push(constructBackboneHints(secretWord, 2, correctlyKnownPlacesFrequencyAbsence));
            break;
        }
        case 9:
        case 10: {
            hints.push(constructBackboneHints(secretWord, 3, correctlyKnownPlacesFrequencyAbsence));
            break;
        }
        case 11:
        case 12:
        case 13: {
            hints.push(constructBackboneHints(secretWord, 4, correctlyKnownPlacesFrequencyAbsence));
            break;
        }
        case 14:
        case 15: {
            hints.push(constructBackboneHints(secretWord, 5, correctlyKnownPlacesFrequencyAbsence));
            break;
        }
    }

    switch (new Set(Array.from(secretWord)).size-correctlyKnownPlacesFrequencyAbsence.frequency.length) {
        case 0: {
            hints.push([[undefined, undefined]]);
            break;
        }
        case 1:
        case 2:
        case 3:
        case 4: {
            const freqHints = constructFreqHints(secretWord, 1, correctlyKnownPlacesFrequencyAbsence);
            hints.push([]);
            for (let i of freqHints) {
                hints[1].push([i[0], i[1]]);
            }
            break;
        }
        case 5:
        case 6:
        case 7:
        case 8: {
            const freqHints = constructFreqHints(secretWord, 2, correctlyKnownPlacesFrequencyAbsence);
            hints.push([]);
            for (let i of freqHints) {
                hints[1].push([i[0], i[1]]);
            }
            break;
        }
        case 9:
        case 10: {
            const freqHints = constructFreqHints(secretWord, 3, correctlyKnownPlacesFrequencyAbsence);
            hints.push([]);
            for (let i of freqHints) {
                hints[1].push([i[0], i[1]]);
            }
            break;
        }
        case 11:
        case 12:
        case 13: {
            const freqHints = constructFreqHints(secretWord, 4, correctlyKnownPlacesFrequencyAbsence);
            hints.push([]);
            for (let i of freqHints) {
                hints[1].push([i[0], i[1]]);
            }
            break;
        }
        case 14:
        case 15: {
            const freqHints = constructFreqHints(secretWord, 5, correctlyKnownPlacesFrequencyAbsence);
            hints.push([]);
            for (let i of freqHints) {
                hints[1].push([i[0], i[1]]);
            }
            break;
        }
    }

    switch (Array.from(alphabets).filter(x=>!secretWord.includes(x)).length-correctlyKnownPlacesFrequencyAbsence.absence.length) {
        case 0: {
            hints.push([]);
            break;
        }
        case 1:
        case 2:
        case 3:
        case 4: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 1, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        case 5:
        case 6:
        case 7:
        case 8: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 3, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        case 9:
        case 10: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 5, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        case 11:
        case 12:
        case 13: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 6, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        case 14:
        case 15: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 7, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        case 16:
        case 17:
        case 18: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 8, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        case 19:
        case 20: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 9, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
        default: {
            hints.push(Array.from(constructNonExistenceHints(secretWord, 10, correctlyKnownPlacesFrequencyAbsence)));
            break;
        }
    }

    return hints;
}

function constructColorEncoding(secretWord, guess) {
    let correctIndicesOfCharacters = {};
    let colorEncoding = [];
    for (let i=0; i < secretWord.length; i++) {
        if (Object.keys(correctIndicesOfCharacters).includes(secretWord[i])) {
            correctIndicesOfCharacters[secretWord[i]].push(i);
        } else {
            correctIndicesOfCharacters[secretWord[i]] = [i];
        }
    }

    let misplacedIndicesForEachGuess = [];
    let rightIndicesForEachGuess = [];
    let wrongIndicesForEachGuess = [];
    let indicesOfCharacters = {};

    for (let i=0; i < guess.length; i++) {
        if (Object.keys(indicesOfCharacters).includes(guess[i])) {
            indicesOfCharacters[guess[i]].push(i);
        } else {
            indicesOfCharacters[guess[i]] = [i];
        }
    }

    for (let i in correctIndicesOfCharacters) {
        let rightIndicesForEachCharacter = [];
        let misplacedIndicesForEachCharacter = [];
        let wrongIndicesForEachCharacter = [];
        let misplacedAndWrongIndicesForEachCharacter = [];

        if (Object.keys(indicesOfCharacters).includes(i)) {
            for (let j of correctIndicesOfCharacters[i]) {
                if (indicesOfCharacters[i].includes(j)) {
                    rightIndicesForEachCharacter.push(j);
                }
            }
            let numberOfMisplacedCharacters = correctIndicesOfCharacters[i].length - rightIndicesForEachCharacter.length;
            for (let j of indicesOfCharacters[i]) {
                if (!rightIndicesForEachCharacter.includes(j)) {
                    misplacedAndWrongIndicesForEachCharacter.push(j);
                    // if (numberOfMisplacedCharacters !== 0) {
                    //     misplacedIndicesForEachCharacter.push(j);
                    //     numberOfMisplacedCharacters -= 1;
                    // } else {
                    //     wrongIndicesForEachCharacter.push(j);
                    // }
                }
            }

            let range = [];
            for (let j = 0; j < misplacedAndWrongIndicesForEachCharacter.length; j++) {
                range.push(j);
            }
            numberOfMisplacedCharacters = Math.min(misplacedAndWrongIndicesForEachCharacter.length, numberOfMisplacedCharacters);
            for (let j=0; j < numberOfMisplacedCharacters; j++) {
                const randomNumber = Math.floor(Math.random()*range.length);
                const randomIndex = range[randomNumber];
                misplacedIndicesForEachCharacter.push(misplacedAndWrongIndicesForEachCharacter[randomIndex]);
                range.splice(randomNumber, 1);
            }

            for (let j of misplacedAndWrongIndicesForEachCharacter) {
                if (!misplacedIndicesForEachCharacter.includes(j)) {
                    wrongIndicesForEachCharacter.push(j);
                }
            }

            if (rightIndicesForEachCharacter.length !== 0) {
                rightIndicesForEachGuess.push(...rightIndicesForEachCharacter);
            }
            if (misplacedIndicesForEachCharacter.length !== 0) {
                misplacedIndicesForEachGuess.push(...misplacedIndicesForEachCharacter);
            }
            if (wrongIndicesForEachCharacter.length !== 0) {
                wrongIndicesForEachGuess.push(...wrongIndicesForEachCharacter);
            }
        }
    }

    for (let i in indicesOfCharacters) {
        if (!Object.keys(correctIndicesOfCharacters).includes(i)) {
            for (let j of indicesOfCharacters[i]) {
                wrongIndicesForEachGuess.push(j);
            }
        }
    }

    for (let i=0; i < guess.length; i++) {
        if (rightIndicesForEachGuess.includes(i)) {
            colorEncoding.push({
                classToAttach: 'right',
                char: guess[i]
            });
        } else if (misplacedIndicesForEachGuess.includes(i)) {
            colorEncoding.push({
                classToAttach: 'misplaced',
                char: guess[i]
            });
        } else if (wrongIndicesForEachGuess.includes(i)) {
            colorEncoding.push({
                classToAttach: 'wrong',
                char: guess[i]
            });
        }
    }

    return colorEncoding;
}

const App = () => {
    const [guesses, setGuesses] = useState([]);
    const [secretWord, setSecretWord] = useState('');
    const [reset, setReset] = useState(0);
    const [isQuitClicked, setIsQuitClicked] = useState(false);
    // const [hints, setHints] = useState([]);
    // const [isConstructingHints, setIsConstructingHints] = useState(false);
    const [hints, setHints] = useState({
        hints: [],
        isConstructingHints: false
    });
    const [isUnlockHintClicked, setIsUnlockHintClicked] = useState(false);
    const [colorEncoding, setColorEncoding] = useState([]);

    useEffect(() => {
        getSecretWord().then(async response => {
            // const word = (await response.json())[0].toUpperCase()
            const word = (await response.text()).toUpperCase();
            setSecretWord(word);
            // setHints(constructHints(word));
            // setHints([]);
            // setIsConstructingHints(false);
            setHints({
                hints: [],
                isConstructingHints: false
            });
            setIsUnlockHintClicked(false);
            setGuesses([]);
            setIsQuitClicked(false);
            setColorEncoding([]);
        });
    }, [reset]);

    const addGuessHandler = (guess) => {
        setGuesses((prevGuesses) => {
            let newColorEncoding = constructColorEncoding(secretWord, guess);
            setColorEncoding((prevColorEncoding) => {
                return [...prevColorEncoding, [...newColorEncoding]];
            })
            return [...prevGuesses, guess];
        });
    }

    const resetHandler = () => {
        setSecretWord('');
        setReset((prevState) => {
            return prevState+1;
        });
    }

    const quitHandler = () => {
        setIsQuitClicked(true);
    }

    const unlockHintHandler = () => {
        setIsUnlockHintClicked(true);
        setHints(({hints,isConstructingHints}) => {
            return {
                hints,
                isConstructingHints: true
            };
        });
        setHints(({hints,isConstructingHints}) => {
            return {
                isConstructingHints,
                hints: constructHints(secretWord, guesses)
            };
        });
        setHints(({hints,isConstructingHints}) => {
            return {
                hints,
                isConstructingHints: false
            };
        });
    }
    
    return (
        <>
            {
                secretWord &&
                <div className={classes.outerLayoutAfterLoading}>
                    <div>
                        <Progress
                            numberOfGuesses={guesses.length}
                            isCorrect={secretWord === guesses[guesses.length-1]}
                            isQuitClicked={isQuitClicked}
                        />
                        <Hints
                            guesses={guesses}
                            isCorrect={secretWord === guesses[guesses.length-1]}
                            isUnlockHintClicked={isUnlockHintClicked}
                            isQuitClicked={isQuitClicked}
                            onUnlockHint={unlockHintHandler}
                            hints={hints.hints}
                            isConstructingHints={hints.isConstructingHints}
                        />
                    </div>
                    <div>
                        <Input
                            wordLength={secretWord.length}
                            onAddGuess={addGuessHandler}
                            numberOfGuesses={guesses.length}
                            isCorrect={secretWord === guesses[guesses.length-1]}
                            guesses={guesses}
                            onReset={resetHandler}
                            isQuitClicked={isQuitClicked}
                            onQuit={quitHandler}
                            isConstructingHints={hints.isConstructingHints}
                        />
                        <Result
                            numberOfGuesses={guesses.length}
                            isCorrect={secretWord === guesses[guesses.length-1]}
                            secretWord={secretWord}
                            isUnlockHintClicked={isUnlockHintClicked}
                            isQuitClicked={isQuitClicked}
                            hints={hints.hints}
                        />
                    </div>
                    {/*<Input*/}
                    {/*    wordLength={secretWord.length}*/}
                    {/*    onAddGuess={addGuessHandler}*/}
                    {/*    numberOfGuesses={guesses.length}*/}
                    {/*    isCorrect={secretWord === guesses[guesses.length-1]}*/}
                    {/*    secretWord={secretWord}*/}
                    {/*    guesses={guesses}*/}
                    {/*    isUnlockHintClicked={isUnlockHintClicked}*/}
                    {/*    onReset={resetHandler}*/}
                    {/*    isQuitClicked={isQuitClicked}*/}
                    {/*    onQuit={quitHandler}*/}
                    {/*/>*/}

                    {/*<div>*/}
                    {/*    <Guesses*/}
                    {/*        guesses={guesses}*/}
                    {/*        secretWord={secretWord}*/}
                    {/*    />*/}
                    {/*    <Hints*/}
                    {/*        guesses={guesses}*/}
                    {/*        isCorrect={secretWord === guesses[guesses.length-1]}*/}
                    {/*        isUnlockHintClicked={isUnlockHintClicked}*/}
                    {/*        isQuitClicked={isQuitClicked}*/}
                    {/*        onUnlock={unlockHandler}*/}
                    {/*        hints={hints}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <Guesses
                        guesses={guesses}
                        secretWord={secretWord}
                        colorEncoding={colorEncoding}
                        isQuitClicked={isQuitClicked}
                    />
                </div>
            }
            {
                !secretWord &&
                <div className={classes.outerLayoutAtTimeOfLoad}>
                    Fetching the Secret Word...
                </div>
            }
        </>
    );
}

export default App;