import React from "react";
import Die from "./assets/Components/Die"
import "./App.css";
import Confetti from "react-confetti";

export default function App(){
  const [dice, setDice] = React.useState(generateRandom());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollCount, setRollCount] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const bestTime = localStorage.getItem("bestTime") || 0;

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if(allHeld && allSameValue){
      setTenzies(true);
      console.log("You won!!");
    }
  }, [dice])  

  //it generates a random number between 1 and 6(inclusive)
  function generateNewDie(){
    let randomNum = Math.ceil(Math.random() * 6);
    let newObject = {
      value: randomNum,
      isHeld: false,
      id: generateRandomId(10) 
    }
    return newObject;
  }

  //it re-rolls the dice components
  function rollDice(){
    if(!tenzies){
      setRollCount(rollCount + 1);
      setDice((dice) => {
        return dice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      })
    }else{
      if(seconds < bestTime){
        localStorage.setItem("bestTime", seconds);
      }
      setSeconds(0);
      setRollCount(0);
      setTenzies(false);
      setDice(generateRandom);
    }
  }

  //it toggles the 'isHeld' prop of any die
  function holdDice(id){
    setDice((dice) => {
      return dice.map((dice) => {
        return dice.id === id ? 
        {...dice, isHeld: !dice.isHeld} : dice;
      })
    })
  }

  //it generates an array of random numbers between 1 and 6
  function generateRandom(){
    let randomArray = [];
    for(let i = 0; i < 10; i++){
      randomArray.push(generateNewDie());
    }
    return randomArray; 
  }

  //it generates each component for the random numbers
  const dieRenders = dice.map((currObj) => {
    return <Die 
      key = {currObj.id} 
      number = {currObj.value} 
      isHeld = {currObj.isHeld}
      holdDice = {() => holdDice(currObj.id)}
    />
  })

  //function to generate a random id for each die
  function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  }

  //function to keep track of a timer
  React.useEffect(() => {
    if(rollCount > 0 && !tenzies){
      const interval = setInterval(() => {
        setSeconds(seconds + 1);
      }, 1000)
      return () => clearInterval(interval);
    }
  }, [tenzies, rollCount, seconds])


  return(
    <main>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <h4 className="best-time">Best Time to beat: {bestTime}s</h4>
      <div className="die-level">
        {dieRenders}
      </div>
      <button onClick = {rollDice} className="roll-btn">
        {tenzies ? "New Game" : "Roll"}
      </button>
      {tenzies && <Confetti />}
      {rollCount > 0 && <div>Roll Count: {rollCount}</div>}
      <h3>Timer: {seconds}s</h3>
    </main>
  ); 
}