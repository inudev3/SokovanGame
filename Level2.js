import * as readline from 'readline';
import {parser, parserReverse} from "./MapData.js";



const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});
const stage2=
    'Stage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########\n'
function SetPropmt(stage){
    rl.setPrompt(stage+"SOKOVAN>");
    rl.prompt();
    rl.on("line", function(line){
        const parsed = parser(stage.split('\n'));
        parseString(parsed, line);
        rl.close();
    })
    rl.on("close", function(){
        process.exit();
    });
}


SetPropmt(stage2);


function parseString(parsed,str){
    const original = parserReverse(parsed);
    const sequence = str.trim().split('');
    let refresh = false, end=false;
    sequence.forEach(char => {
        const row = parsed.find(row => row.includes(3));
        const rowIdx = parsed.findIndex(line => line.includes(3));
        const idx = row.indexOf(3);
        let dx=0, dy=0, dir="";
        switch (char) {
            case 'w':
                dy+=1;
                dir="위쪽"
                break;
            case 'a':
                dx-=1;
                dir="왼쪽"
                break;
            case 's':
                dy-=1;
                dir="아래쪽"
                break;
            case 'd':
                dx+=1;
                dir="오른쪽"
                break;
            case 'q':
                end = true;
                break;
            case 'r':
                refresh = true;
                break;
            default:
                break;
        }
        if (dir!==""||[0, 1, 2].includes(parsed[rowIdx -dy][idx+dx])) { //장애물 여부
            console.log(parserReverse(parsed)) //그대로 문자열로 출력;
            console.log(`${char.toUpperCase()} (경고!): 해당 명령을 수행할 수 없습니다!"`);
        } else {
            parsed[rowIdx -dy][idx+dx] = 3;     //위치변경 후 문자열로 출력
            parsed[rowIdx][idx] = undefined;
            console.log(parserReverse(parsed));
            console.log(`${dir}으로 이동합니다.`);
        }
    });
    if(refresh) {
        SetPropmt(original, false);
    }
}


