import { CharacterState } from "./characters-data";
import { CharacterEntry } from "./definitions";

const SYMBOL_SIZE = 4;
const RADIX = 2 ** SYMBOL_SIZE;

export function generateCode(characters: CharacterEntry[]): string {
    // Convert characters data to binary string
    let binString = "";
    for (let i = 0; i < characters.length; i++) {
        binString += characters[i].state == CharacterState.DISABLED ? "0" : "1";
    }
    console.log(binString.length, "bits for selection are:", binString);

    // Add padding so that the total length of the binary string is a multiple of the symbol size
    while (binString.length % SYMBOL_SIZE != 0) binString = "0" + binString;

    // Convert binary string to hex
    let hexString = "";
    for (let i = 0; i < binString.length; i += SYMBOL_SIZE) {
        let temp = "";
        for (let j = 0; j < SYMBOL_SIZE; j++){
            temp += binString[i+j];
        }
        hexString += parseInt(temp, 2).toString(RADIX);
    }
    console.log("Code for selection is:", hexString);

    return hexString;
}

export function decodeCode(hexString: string): boolean[] {
    // Convert hex string to binary
    let binString = "";
    for (let i = 0; i < hexString.length; i++) {
        let temp = parseInt(hexString[i], RADIX).toString(2);
        while (temp.length < SYMBOL_SIZE) temp = "0" + temp;
        binString += temp;
    }
    
    console.log(binString.length, "bits decoded:", binString);

    // Map binaries to boolean values
    return binString.split("") .map(x => x == "0" ? false : true);
}