

export function SplitStage(str){
    const arr = str.split('\n');
    let stack = []
    return arr.reduce((result, row, index, src) => { //스테이지 분리
        stack.push(row);
        if (row.includes("=") || index === src.length - 1) {
            result.push(stack);
            stack = []
        }
        return result;
    }, []);
}

export function MapReader(str) {

        const matrix = SplitStage(str);
        matrix.map(stage => {
            const parsed = parser(stage);
            const prop = props(parsed);

            Object.entries(prop).forEach(([k, v]) => { // 속성 추출 후 스테이지 끝부분에 푸쉬
                stage.push(`${k}:${v}`)
            })
            return stage.filter(line => !line.includes("=")); // 스테이지 구분선 제외
        }).forEach(stage => {
            stage.forEach(line => console.log(line))
        });
    };
export function parserReverse(arr){ //숫자에서 문자열로 파싱
    return arr.reduce((result, row)=>{
        const line = row.map(num=>{
            switch(num){
                case undefined:
                    return " ";
                case 0:
                    return '#';
                case 1:
                    return 'O';
                case 2:
                    return 'o';
                case 3:
                    return 'P';
                case 4:
                    return '='
                case '0':
                    return '0'
                default:
                    return;
            }
        })
        line.push('\n');
        result.push(line.join(''));
        return result;
    },[]).join('')
}
export function parser(arr) { //문자열에서 숫자로 파싱
    return arr.reduce((result, row) => {
        const chars = row.split('');
        const line = chars.map(char => {
            switch (char) {
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
                case '0':
                    return '0';
                default:
                    return;
            }
        })

        result.push(line);
        return result;
    }, []);
}
export function props(arr) { //속성 추출
    return arr.filter((row, index) => row.some(el => [0, 1, 2, 3, 4].includes(el))).reduce((result, row, index) => {
        result['구멍의 수'] += row.reduce((cnt, num) => cnt + (num === 1), 0)
        result['공의 수'] += row.reduce((cnt, num) => cnt + (num === 2), 0)
        if (result['가로크기'] < row.length) {
            result['가로크기'] = row.length;
        }
        if (row.includes(3)) {
            result['플레이어 위치'] = [index + 1, row.indexOf(3) + 1]
        }
        if (row.some(el => [0, 1, 2, 3].includes(el))) {
            result['세로크기'] += 1;
        }
        return result;
    }, {"구멍의 수": 0, "공의 수": 0, "가로크기": 0, "플레이어 위치": [0, 0], "세로크기": 0});
};
//
// const str =
//     `Stage 1
// #####
// #OoP#
// #####
// =====
// Stage 2
//   #######
// ###  O  ###
// #    o    #
// # Oo P oO #
// ###  o  ###
//  #   O  #
//  ########
// `
// MapReader(str);
