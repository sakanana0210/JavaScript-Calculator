import './App.css';
import React from 'react';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import * as math from 'mathjs';

// redux
const initialState = {
  formula: "",
  input: "0"
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "AC":
        return initialState;
      case "UPDATE_INPUT":
        return { ...state, formula: action.newFormula, input: action.newInput};
      case "RESULT":
        return { ...state, formula: action.newFormula, input: action.newInput};
      default:
        return state;
  }
};

const store = createStore(reducer);

// react
const Calculator = () => {
    const formula = useSelector(state => state.formula);
    const input = useSelector(state => state.input);
    const dispatch = useDispatch();

    const handleInput = e => {
      let newFormula = formula;
      let newInput = "0";
      if (formula === "Exceeded the maximum!"){
        return;
      }
      
      if (input.toString().length>12 || formula.length>28){
        newInput = "999999999999";
        newFormula = "Exceeded the maximum!"
        dispatch({ type: "UPDATE_INPUT", newFormula, newInput});
        return;
      }

      if (formula.includes("=")){
        newFormula = input;
      }

      if (formula === "" && (e.target.value === "+" || e.target.value === "*" || e.target.value === "/")){
        newFormula = formula;
        newInput = e.target.value;
      } else if ((formula === "") && e.target.value !== "."){
        newInput = e.target.value;
        newFormula = e.target.value;
      } else if((formula === "" || formula === "0") && e.target.value === "."){
        newInput = "0.";
        newFormula = "0.";
      }  else if (input === "0" && e.target.value === "."){
        newInput += e.target.value;
        newFormula += e.target.value;
      } else if (input === "0" && e.target.value === "0") {
        newInput = "0";
        newFormula = formula;
      } else if (input === "0" && e.target.value !== "0" && (e.target.value === "-" || e.target.value === "+" || e.target.value === "*" || e.target.value === "/")) {
        newInput = e.target.value;
        newFormula += e.target.value;
      } else if (input === "0" && e.target.value !== "0" && (e.target.value !== "." || e.target.value !== "+" || e.target.value !== "*" || e.target.value !== "/")) {
        newInput = e.target.value;
        newFormula = newFormula.slice(0, -1);
        newFormula += e.target.value;
      } else if (input === "0" && e.target.value !== "."){
        newInput = e.target.value;
        newFormula += e.target.value;
      } else if (formula.slice(-1) === "-" && (formula.slice(-2, -1) === "+" || formula.slice(-2, -1) === "*" || formula.slice(-2, -1) === "/") && (e.target.value === "+" || e.target.value === "*" || e.target.value === "/")){
        newFormula = newFormula.slice(0, -1);
        newFormula = newFormula.slice(0, -1);
        newFormula += e.target.value;
        newInput = "";
        newInput += e.target.value;
      } else if ((formula.slice(-1) === "+" || formula.slice(-1) === "*" || formula.slice(-1) === "/" ) && (e.target.value === "-")){
        newFormula += e.target.value;
        newInput = "";
        newInput += e.target.value;
      } else if ((formula.slice(-1) === "+" || formula.slice(-1) === "-" || formula.slice(-1) === "*" || formula.slice(-1) === "/" ) && (e.target.value === ".")){
        newFormula += "0";
        newFormula += e.target.value;
        newInput = "0";
        newInput += e.target.value;
      } else if ((formula.slice(-1) === ".") && (e.target.value === ".")){
        newInput = input;
        newFormula = newFormula.slice(0, -1);
        newFormula += e.target.value;
      }else if ((formula.slice(-1) === "." || formula.slice(-1) === "+" || formula.slice(-1) === "-" || formula.slice(-1) === "*" || formula.slice(-1) === "/" ) && (e.target.value === "." ||e.target.value === "+" || e.target.value === "-" || e.target.value === "*" || e.target.value === "/")){
        newInput = e.target.value;
        newFormula = newFormula.slice(0, -1);
        newFormula += e.target.value;
      } else if ((input === "+" || input === "-" || input === "*" || input === "/" ) && (e.target.value === "+" || e.target.value === "-" || e.target.value === "*" || e.target.value === "/")){
        newInput = e.target.value;
        newFormula = newFormula.slice(0, -1);
        newFormula += e.target.value;
      } else if (input === "+" || input === "-" || input === "*" || input === "/" || e.target.value === "+" || e.target.value === "-" || e.target.value === "*" || e.target.value === "/" ){
        newInput = e.target.value;
        newFormula += e.target.value;
      } else if (input.toString().includes(".") && e.target.value === "."){
        newInput = input;
        newFormula = formula;
      } else {
        newInput = input + e.target.value;
        newFormula += e.target.value;
      }
      dispatch({ type: "UPDATE_INPUT", newFormula, newInput});
    };

    const handleAC = () => {
      dispatch({ type: "AC"});
    };

    const handleEquals = () => {
      let newFormula = formula;
      let result;
      let newInput
      try{
        if (formula === "Exceeded the maximum!"){
          return;
        }
        
        if (formula.includes("=")){
          return;
        } else if(formula.slice(-1) === "-" || formula.slice(-1) === "+" || formula.slice(-1) === "*" || formula.slice(-1) === "/" ) {
          newFormula = formula.slice(0, -1);
          result = math.evaluate(newFormula).toFixed(8);
          if(result>"999999999999"){
            newInput = "999999999999";
            newFormula = "Exceeded the maximum!"
            dispatch({ type: "RESULT", newFormula, newInput});
            return;
          }
          newFormula += "=";
          result = result.replace(/(\.\d*?)0+$/, "$1");
          if(result.toString().slice(-1) === "."){
            result = result.slice(0, -1);
          }
          newFormula += result;
          newInput = result;
          dispatch({ type: "RESULT", newFormula, newInput});
        } else {
          result = math.evaluate(newFormula).toFixed(8);
          if(result>"999999999999"){
            newInput = "999999999999";
            newFormula = "Exceeded the maximum!"
            dispatch({ type: "RESULT", newFormula, newInput});
            return;
          } else if (result.toString().length>12){
            result = result.toString().slice(0, 12);
          }
          newFormula += "=";
          result=result.replace(/(\.\d*?)0+$/, "$1");
          if(result.toString().slice(-1) === "."){
            result = result.slice(0, -1);
          }
          newFormula += result;
          newInput = result;
          dispatch({ type: "RESULT", newFormula, newInput});
        }
      }catch (error) {
        newFormula = "Error";
        newInput = "Press AC";
        dispatch({ type: "RESULT", newFormula, newInput});
      }
    };
    
  return (
    <div className="calculator">
      <div id="formula">　{formula}</div>
      <div id="display">{input}</div>
      <div id="calculatorBottom">
        <div className="bottonRow">
          <button onClick={handleAC} id="clear" value="AC">AC</button>
          <button onClick={handleInput} className="smallBtn" id="divide" value="/">÷</button>
        </div>
        <div className="bottonRow">
          <button onClick={handleInput} className="smallBtn" id="seven" value="7">7</button>
          <button onClick={handleInput} className="smallBtn" id="eight" value="8">8</button>
          <button onClick={handleInput} className="smallBtn" id="nine" value="9">9</button>
          <button onClick={handleInput} className="smallBtn" id="multiply" value="*">x</button>
        </div>
        <div className="bottonRow">
          <button onClick={handleInput} className="smallBtn" id="four" value="4">4</button>
          <button onClick={handleInput} className="smallBtn" id="five" value="5">5</button>
          <button onClick={handleInput} className="smallBtn" id="six" value="6">6</button>
          <button onClick={handleInput} className="smallBtn" id="subtract"value="-">-</button>
        </div>
        <div className="bottonRow">
          <button onClick={handleInput} className="smallBtn" id="one" value="1">1</button>
          <button onClick={handleInput} className="smallBtn" id="two" value="2">2</button>
          <button onClick={handleInput} className="smallBtn" id="three" value="3">3</button>
          <button onClick={handleInput} className="smallBtn" id="add" value="+">+</button> 
        </div>
        <div className="bottonRow">
          <button onClick={handleInput} id="zero" value="0">0</button>
          <button onClick={handleInput} className="smallBtn" id="decimal" value=".">.</button>
          <button onClick={handleEquals} className="smallBtn" id="equals" value="=">=</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Calculator />
    </Provider>
  );
}
export default App;
