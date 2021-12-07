import * as fs from "fs";
import {parser, SplitStage} from "./MapData";

const stages = fs.readFileSync("map.txt");

const arr = stages.split('\n');

const matrix = SplitStage(arr);

for(let i=0; i<matrix.length; i++){
    const parsed = parser(matrix[i]);
    let flag= false;
    SetPrompt(matrix[i], flag)
    if(!flag){
        continue
    }
}


