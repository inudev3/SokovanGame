const readline = require('readline');
function MapReader(str){
    const arr = str.split('\n');

    let stack =[]
    const matrix = arr.reduce((result,row, index,src)=>{
        stack.push(row);
        if(row.includes("=") || index===src.length-1){
            result.push(stack);
            stack=[]
        }
        return result;
    }, []);

    matrix.map(stage=>{
        const parsed =parser(stage);
        const prop = props(parsed);

        Object.entries(prop).forEach(([k,v])=>{
            stage.push(`${k}:${v}`)
        })
        return stage.filter(line=> !line.includes("="));
    }).forEach(stage=>{
        stage.forEach(line=>console.log(line))
    });
}

function parser(arr){
    return arr.reduce((result,row)=>{
        const chars = row.split('');
        const line = chars.map(char=>{
            switch(char){
                case "#":
                    return 0;
                case 'O':
                    return 1;
                case 'o':
                    return 2;
                case 'P':
                    return 3;
                case '=':
                    return 4;
                default:
                    return;
            }
        })
        console.log(line);
        result.push(line);
        return result;
    }, []);
}
function props(arr){
    return arr.filter((row, index)=>row.some(el=>[0,1,2,3,4].includes(el))).reduce((result,row, index)=>{
        result['구멍의 수']+=row.reduce((cnt, num)=>cnt+(num===1),0)
        result['공의 수'] +=row.reduce((cnt, num)=>cnt+(num===2),0)
        if(result['가로크기']<row.length){
            result['가로크기'] = row.length;
        }
        if(row.includes(3)){
            result['플레이어 위치'] = [index+1, row.indexOf(3)+1]
        }
        if(row.some(el=>[0,1,2,3].includes(el))) {
            result['세로크기'] += 1;
        }
        return result;
    },{"구멍의 수":0, "공의 수":0, "가로크기":0, "플레이어 위치":[0,0], "세로크기":0});
}
const str =
    `Stage 1
#####
#OoP#
#####
=====
Stage 2
  #######
###  O  ###
#    o    #
# Oo P oO #
###  o  ###
 #   O  # 
 ########
`
MapReader(str);