import * as fs from "fs";
import {parser, parserReverse, SplitStage} from "./MapData.js";
import {switchChar} from "./Level2.js";
import * as readline from 'readline';

fs.readFile('map.txt', 'utf8',  (err,data)=>{
    const arr = data.toString();
    const matrix = SplitStage(arr);
    const gen = generateMatrix(matrix);
    ReadLine(gen);
})

function* generateMatrix(matrix){
   for(const stage of matrix){
       yield parser(stage)
   }
}


const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout,
    terminal:false,
});
function ReadLine(gen){
    const next = gen.next();
    if(next.done){
        console.log("모든 스테이지를 클리어하셨습니다.");
        rl.close();
    }
    const parsed = next.value;
    const{GoalCount, HoleCors} = process(parsed);
    let turnCount = 0;
    rl.setPrompt(parserReverse(parsed)+"SOKOVAN>");
    rl.prompt();
    rl.on('line', (line)=> {

        if (['q', 'r'].some(el => line.includes(el))) {
            line.split('').forEach(char => {
                if (char === 'q') {
                    rl.close();
                } else if (char === 'r') {
                    turnCount=0;
                    rl.setPrompt(parserReverse(parsed)+"SOKOVAN>");
                    rl.prompt();
                }
            })
        } else {
           const after = Sokovan(parsed, line, turnCount, HoleCors);
           const {currCount:curr} = process(after);
            if(curr===GoalCount){ //목표개수에 도달하면 작동해야하는데, 이상하게
                console.log("Cleared!");
                console.log("축하합니다!\n 턴수:", turnCount);
                ReadLine(gen);            }
            else{
                rl.prompt();
            }
        }
    });
    rl.on('close', ()=>{console.log('Bye!'); process.exit(0)});

}



function process(parsed){
    const currCount= parsed.reduce((result, row) => {
        result += row.reduce((cnt, num) => cnt + (num === '0'), 0);
        return result
    }, 0);
    const HoleCors = parsed.reduce((result, row, index) => { // 원래 hole 좌정보를 저장한다.
        if (row.includes(1)) {row.forEach((char, idx) => {if (char === 1) {result.push([index, idx])}})}
        return result;
    }, []);
    const GoalCount = parsed.reduce((result, row) => { // 목표 갯수를 센다
        result += row.reduce((cnt, num) => cnt + (num === 1), 0)
        return result
    }, 0);
    return {currCount, HoleCors, GoalCount}
}


function Sokovan(parsed, str, turnCount, goals, holes) {
    const sequence = str.trim().split(''); //입력을 받고
    for(const char of sequence){ // 매 입력마다
        const {dx, dy, dir} = switchChar(char); //입력에 따른 위치변환정보를 받아와서
        const {stop} = switchPos(parsed, dx, dy) //위치를 변환하고 이동여부를 확인한 다음
        const BallCors = parsed.reduce((result, row, index) => { //현재 공의 위치정보
            if (row.includes(2)) {
                row.forEach((char, idx) => {
                    if (char === 2) {result.push([index, idx])}});
            }return result;}, [])
       holes.forEach(([ycors, xcors]) => {if (parsed[ycors][xcors] === undefined) {parsed[ycors][xcors] = 1} //구멍의 좌표 중 지워진 부분은 다시 복구시킨다.
        });
        BallCors.forEach(([y,x])=>{ //구멍좌표와 공좌표가 일치하면 '0'으로 바꿔준다.
            if(holes.some(([ycors,xcors])=>x===xcors && y===ycors)){parsed[y][x] ='0';}
        })
        console.log(parserReverse(parsed)) //그대로 문자열로 출력한다.
        if (stop) { //stop 플래그가 true면 경고를 출력한다.
            console.log(`${char.toUpperCase()} (경고!): 해당 명령을 수행할 수 없습니다!"`);
        } else { // 아니면 턴수에 1추가하고 정상 출력한다.
            turnCount+=1
            console.log(`${char.toUpperCase()}: ${dir}으로 이동합니다.`);
        }
        return parsed;
    }


}

function switchPos(parsed, dx, dy){
    let stop = false;
    const row = parsed.find(row => row.includes(3));
    const rowIdx = parsed.findIndex(line => line.includes(3));
    const idx = row.indexOf(3);
    const dest =parsed[rowIdx - dy][idx + dx];
    switch (dest) { // 위치를 변경해준 다음
        case 0:
            stop = true;
            break;
        case 1:
            parsed[rowIdx][idx] = undefined;
            parsed[rowIdx - dy][idx + dx] = 3;
            break;
        case 2: case '0':
            if (parsed[rowIdx - dy * 2][idx + dx * 2] === 2 || parsed[rowIdx - dy * 2][idx + dx * 2] === 0 || parsed[rowIdx - dy * 2][idx + dx * 2] === '0') {
                stop = true;
                break;
            } else {
                parsed[rowIdx][idx] = undefined;
                parsed[rowIdx - dy][idx + dx] = 3;
                parsed[rowIdx - dy * 2][idx + dx * 2] = 2;
                break;
            }
        default:
            parsed[rowIdx - dy][idx + dx] = 3;
            parsed[rowIdx][idx] = undefined;
            break;
    }
    return {stop}
}
