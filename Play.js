import * as fs from "fs";
import {parser, parserReverse, SplitStage} from "./MapData";

const stages = fs.readFileSync("map.txt");

const arr = stages.split('\n');

const matrix = SplitStage(arr);

for(let i=0; i<matrix.length; i++){
    SetPrompt(matrix[i])
}
function Sokovan(stage, str){
    const sequence = str.trim().split('');
    const parsed = parser(stage);
    sequence.forEach(char => {
        const row = parsed.find(row => row.includes(3));
        const rowIdx = parsed.findIndex(line => line.includes(3));
        const idx = row.indexOf(3);
        switch(char){
            case 'w':
                const point = parsed[rowIdx-1][idx]
                if(point===0){console.log(parserReverse(parsed)); console.log("경고!통과할 수 없습니다")}
                else if(point===2){
                    if(parsed[rowIdx-2][idx]===0){console.log(parserReverse(parsed)); console.log("경고!통과할 수 없습니다")}
                    else if(parsed[rowIdx-2][idx]===1){}
                }
        }
    })
}

