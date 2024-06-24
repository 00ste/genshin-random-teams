import { CharacterID, CharacterState, charactersData } from "../common/characters-data"

import './character.css'

interface CharacterProps {
    character: CharacterID,
    state: CharacterState,
    clickAction: () => void
}

const Character: React.FC<CharacterProps> = (props) => {
    if (props.character == CharacterID.NONE)
    {
        return (
            <div className="character empty" onClick={props.clickAction}>
                <p className="character-name">Empty</p>
            </div>
        )
    }
    else
    {
        return (
            <div className={`character ${props.state}`} onClick={props.clickAction}>
                <p className="character-name">{charactersData[props.character].name}</p>
                <p className="character-element">{charactersData[props.character].element}</p>
                <p className="character-weapon">{charactersData[props.character].weapon}</p>
            </div>
        )
    }
}

export default Character;