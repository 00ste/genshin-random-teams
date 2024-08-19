import { useState } from 'react'
import { allCharacters, CharacterID, CharacterState } from "./common/characters-data"
import Character from "./components/character"
import { CharacterEntry } from "./common/definitions";
import { generateCode, decodeCode } from './common/codes';

import './App.css'

function App() {
   const [characters, setCharacters] = useState(
      allCharacters.map((x: CharacterID) => (
         {id: x, state: CharacterState.DEFAULT}
      ))
   )

   const [team, setTeam] = useState(
      [CharacterID.NONE, CharacterID.NONE, CharacterID.NONE, CharacterID.NONE]
   )

   const [codeInput, setCodeInput] = useState("");

   function generateRandomTeam() {
      let randomCharacters: CharacterID[] = [];
      const enabledCharacters = characters.filter((x: CharacterEntry) => (x.state != CharacterState.DISABLED))
      while (randomCharacters.length < 4) {
         const randomIndex = Math.floor(Math.random() * enabledCharacters.length);
         if (randomCharacters.indexOf(enabledCharacters[randomIndex].id) < 0) {
            randomCharacters.push(enabledCharacters[randomIndex].id);
         }
      }

      console.log("Team characters are:", randomCharacters)

      const newCharacters = characters.map((x: CharacterEntry) => {
         if (x.state == CharacterState.DISABLED) return x
         if (randomCharacters.indexOf(x.id) >= 0) return {id: x.id, state: CharacterState.SELECTED}
         return {id: x.id, state: CharacterState.DESELECTED}
      })
      
      setTeam(randomCharacters)
      setCharacters(newCharacters)
   }

   function clearTeam() {
      setTeam([CharacterID.NONE, CharacterID.NONE, CharacterID.NONE, CharacterID.NONE]);
      setCharacters(characters.map(c => {
         if (c.state == CharacterState.SELECTED) c.state = CharacterState.DESELECTED;
         return c;
      }));
   }

   function clickCharacter(id: CharacterID) {
      const newCharacters = characters.map((x: CharacterEntry) => {
         if (x.id == id) {
            if (x.state == CharacterState.DESELECTED) return {id: id, state: CharacterState.DISABLED}
            if (x.state == CharacterState.DISABLED) return {id: id, state: CharacterState.DESELECTED}
         }
         return x
      })

      setCharacters(newCharacters)
   }

   function applyCode(code: string) {
      console.log("Applying code", code);
      // Decode the code
      let newSelections = decodeCode(code);

      if (newSelections.length < characters.length) newSelections = Array(characters.length).fill(true);

      // Adjust the size by removing potential padding bits
      newSelections = newSelections.slice(newSelections.length - characters.length, -1);

      console.log("cleaned output:", newSelections);

      clearTeam();

      let newCharacters: CharacterEntry[] = [];
      for (let i = 0; i < characters.length; i++) {
         newCharacters.push(characters[i]);
         newCharacters[i].state = newSelections[i] ? CharacterState.DESELECTED : CharacterState.DISABLED;
      }
   }

   return (
      <>
         <div className="team">
            {
               [0, 1, 2, 3].map((x: number) => (
                  <Character
                     key={`t${x}`}
                     character={team[x]}
                     state={CharacterState.DESELECTED}
                     clickAction={() => (clickCharacter(team[x]))}
                  />
               ))
            }
         </div>
         <div className="control-panel">
            <button id="randomize-button" onClick={generateRandomTeam}>Randomize!</button> 
            <button id="clear-button" onClick={clearTeam}>Clear</button>
            <button id="generate-code-button" onClick={() => decodeCode(generateCode(characters))}>Generate profile code</button>
            <input type="text" id="insert-code-input" onChange={e => setCodeInput(e.target.value)}></input>
            <button id="apply-code-button" onClick={() => applyCode(codeInput)}>Apply code</button>
         </div>         
         <div className="characters-list">
            {
               characters.map((x: CharacterEntry) => (
                  <Character
                     key={x.id}
                     character={x.id}
                     state={x.state}
                     clickAction={() => (clickCharacter(x.id))}
                  />
               ))
            }
         </div>
      </>
   )
}

export default App
