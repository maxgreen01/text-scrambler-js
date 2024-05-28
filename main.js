// get the string from the input box, scramble it, then display in the output box
function runProgram() {
    let input = document.getElementById("input").value;

    let output = scrambleText(input);
    if (output !== "") {
        document.getElementById("output").value = output;
    }
}

// split the input into words, scramble them, then re-combine everything
// return a string for the output text, or "" if input is empty
function scrambleText(input) {
    if (input === "") {
        return "";
    }

    // this regex uses positive lookbehind to match any whitespace or hyphens WITHOUT CONSUMING THEM,
    // which means the whitespace characters are preserved in the resulting output array, so formatting is preserved in the final output
    let words = input.split(/(?<=[\s-])/);
    return words.map(scrambleWord).join("");
}

// scramble an individual word
function scrambleWord(word) {
    // convert the word into an array of chars, which will be scrambled later
    const chars = Array.from(word);

    // this array stores the location of each of the saved (non scrambled) chars using sub-arrays of the form `[index, char]`.
    // this is populated before anything is scrambled, then iterated to insert them back into the scrambled words
    const savedChars = [];

    // true once we have found the first alphanumeric char and saved it
    let foundFirstAlphanumericChar = false;
    // store the index of the last alphanumeric char, which will later be saved and not scrambled
    let lastAlphanumericIndex = -1;

    for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        // check if the character is alphanumeric
        if (/[A-Za-z0-9]/.test(ch)) {
            // char is alphanumeric

            if (!foundFirstAlphanumericChar) {
                // there have not been any alphanumeric chars yet, so save the first one and don't scramble it
                savedChars.push([i, ch]);
                foundFirstAlphanumericChar = true;
            }

            lastAlphanumericIndex = i;
        } else {
            // char is not alphanumeric, so save the position of this char since it shouldn't be scrambled
            savedChars.push([i, ch]);
        }
    }

    // save the last alphanumeric char if there is one (since there could be words with no chars to scramble), and if this char isn't already saved
    if (lastAlphanumericIndex != -1 && savedChars.find((data) => data[0] == lastAlphanumericIndex) === undefined) {
        savedChars.push([lastAlphanumericIndex, chars[lastAlphanumericIndex]]);
    }

    // since the map is not ordered (because of the last alphanumeric char potentially being in the middle),
    // we sort by reverse order so we can remove later indices first to avoid issues with shifting indices
    savedChars.sort((a, b) => b[0] - a[0]);

    // remove all the saved chars from the word before scrambling
    for (const data of savedChars) {
        chars.splice(data[0], 1);
    }

    const output = scrambleLetters(chars);

    // re-add the saved chars from front to back, which is reversed order compared to how the array currently exists
    for (const data of savedChars.toReversed()) {
        output.splice(data[0], 0, data[1]);
    }

    // join the array back into a string so it can be returned to the output
    return output.join("");
}

// scramble the individual letters of a word, in the form of an array
function scrambleLetters(chars) {
    // check for trivial cases
    if (chars.length < 2 || chars.every((c) => c === chars[0])) {
        // too short to scramble, or all letters are the same
        return chars;
    } else if (chars.length == 2) {
        // only one possible scramble, where the chars are swapped
        let temp = chars[0];
        chars[0] = chars[1];
        chars[1] = temp;
        return chars;
    }

    // non-trivial scramble is needed.
    // first, clone the letters so we can ensure the scramble actually worked at the end of the method
    let scrambled = Array.from(chars);

    // repeatedly try scrambling the chars, ensuring that the result is different from the original chars array
    do {
        shuffleArray(scrambled);
    } while (scrambled.every((val, i) => val === chars[i]));

    // the scramble was successful
    return scrambled;
}

// randomize array in-place using the Durstenfeld shuffle algorithm, an optimized version of the Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
