import { useState } from 'react'
import { allCharacters, CharacterID, CharacterState } from "./common/characters-data"
import Character from "./components/character"

import './App.css'

interface CharacterEntry {
   id: CharacterID,
   state: CharacterState
}

function App() {
   const [characters, setCharacters] = useState(
      allCharacters.map((x: CharacterID) => (
         {id: x, state: CharacterState.DEFAULT}
      ))
   )

   const [team, setTeam] = useState(
      [CharacterID.NONE, CharacterID.NONE, CharacterID.NONE, CharacterID.NONE]
   )

   function generateRandomTeam() {
      // Pick 4 new characters for the team
      /*
      let newTeam: CharacterID[] = []
      while (newTeam.length < 4) {
         console.log("new team indexes:", newTeam)
         const randomIndex = Math.floor(Math.random() * characters.length)
         console.log("adding", randomIndex)
         if ((characters[randomIndex].state != CharacterState.DISABLED) && (newTeam.indexOf(randomIndex) >= 0))
            newTeam = [...newTeam, randomIndex]
      }
      */

      //console.log("new team indexes:", newTeam)

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
