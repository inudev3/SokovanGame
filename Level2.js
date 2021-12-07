import * as readline from 'readline';
import {parser, parserReverse} from "./MapData.js";



const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

function SetPropmt(txt, flag){
    rl.setPrompt(txt+"SOKOVAN>");
    rl.prompt();
    rl.on("line", function(line){
        let end=false
        const parsed = parser(txt.split('\n'));
        parseString(parsed, line, end);
        if(end){
            rl.close();
        }
    })
    rl.on("close", function(){
        process.exit();
    });
}
const stage2=
    'Stage 2\n  #######\n###  O  ###\n#    o    #\n# Oo P oO #\n###  o  ###\n #   O  # \n ########\n'

SetPropmt(stage2);


function parseString(parsed,str, end){

    const sequence = str.trim().split('');
    sequence.forEach(char => {
        const row = parsed.find(row => row.includes(3));
        const rowIdx = parsed.findIndex(line => line.includes(3));
        const idx = row.indexOf(3);
        switch (char) {
            case 'w':
                if ([0, 1, 2, 3].includes(parsed[rowIdx - 1][idx])) { //장애물 여부
                    console.log(parserReverse(parsed)) //그대로 문자열로 출력;
                    console.log(" (경고!): 해당 명령을 수행할 수 없습니다!");
                } else {
                    parsed[rowIdx - 1][idx] = 3;     //위치변경 후 문자열로 출력
                    parsed[rowIdx][idx] = undefined;
                    console.log(parserReverse(parsed));
                    console.log(" 위쪽으로 이동합니다.");
                }
                break;
            case 'a':
                if ([0, 1, 2, 3].includes(parsed[rowIdx][idx - 1])) {
                    console.log(parserReverse(parsed));
                    console.log(" (경고!): 해당 명령을 수행할 수 없습니다!");
                } else {
                    row[idx - 1] = 3;
                    row[idx] = undefined;
                    console.log(parserReverse(parsed));
                    console.log(" 왼쪽으로 이동합니다.");
                }
                break;
            case 's':
                if ([0, 1, 2, 3].includes(parsed[rowIdx + 1][idx])) {
                    console.log(parserReverse(parsed));
                    console.log(" (경고!): 해당 명령을 수행할 수 없습니다!");
                } else {
                    parsed[rowIdx + 1][idx] = 3;
                    row[idx] = undefined;
                    console.log(parserReverse(parsed));
                    console.log(" 아래쪽으로 이동합니다.");
                }
                break;
            case 'd':
                if ([0, 1, 2, 3].includes(row[idx + 1])) {
                    console.log(parserReverse(parsed));
                    console.log(" (경고!): 해당 명령을 수행할 수 없습니다!");
                } else {
                    row[idx] = undefined;
                    row[idx + 1] = 3;
                    console.log(parserReverse(parsed));
                    console.log(" 오른쪽으로 이동합니다");
                }
                break;
            case 'q':
                console.log('bye')
                end = true;
                break;
            default:
                console.log(parserReverse(parsed));
                console.log("(경고!): 해당 명령을 수행할 수 없습니다!");
                break;
        }

    });
    SetPropmt(parserReverse(parsed));
}


