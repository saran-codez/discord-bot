import fs from "fs";

const wordList = fs.readFileSync("words.txt", "utf8").split(",");
for (let i = 0; i < wordList.length; i++) {
  // removing leading and trailing spaces.
  wordList[i] = wordList[i].trim();
}
export default wordList;
