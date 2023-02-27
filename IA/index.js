const slot = document.getElementsByClassName('slot-bg');
const token= document.getElementsByClassName('slot');

const table= document.getElementById('table');

let player= true;
let gameOver= false;

let prepos=0;

let center=true;

const redTokens= document.getElementsByClassName('player1');
const blueTokens= document.getElementsByClassName('player2');

let turnos=0;

let matrix= [["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",]]

let clonedMatrix=   [["-", "-", "-", "-", "-", "-", "-",],
                    ["-", "-", "-", "-", "-", "-", "-",],
                    ["-", "-", "-", "-", "-", "-", "-",],
                    ["-", "-", "-", "-", "-", "-", "-",],
                    ["-", "-", "-", "-", "-", "-", "-",],
                    ["-", "-", "-", "-", "-", "-", "-",]]


let points=[0, 0, 0, 0, 0, 0, 0];
let rivalPoints=[0, 0, 0, 0, 0, 0, 0];



for(let i=0; i < slot.length;i++){
    slot[i].addEventListener('click', () => {
            Turn(i)
    });
}

for(let i=0; i < slot.length;i++){
    slot[i].addEventListener('mouseenter', () => {
            hover(i);
    });
}
function hover(pos){
    if(!gameOver){
        slot[prepos].classList.remove('player1-pre');
        slot[prepos].classList.remove('player2-pre');

        while(pos>6)
            pos-=7;
        
        for(let i=5; i >= 0; i--){
            if(matrix[i][pos]=="-"){
                if(player){
                    prepos=(i*7)+pos;
                    slot[(i*7)+pos].classList.add('player1-pre');
                }
                else{
                    // Turno de la IA
                    prepos=(i*7)+pos;
                    slot[(i*7)+pos].classList.add('player2-pre');
                }
                break;
            }
        }
    }
}

function Turn(pos){

    if(!gameOver){
        turnos++;
        console.log(redTokens.length + blueTokens.length);
        if( redTokens.length + blueTokens.length > 40){
            //empate
            // reset();
            console.log("EMPATE");
            
            ViewWinner('empate');
        }

        while(pos>6)
            pos-=7;
        
        for(let i=5; i >= 0; i--){
            if(matrix[i][pos]=="-"){
                if(player){
                    matrix[i][pos]="x";
                    token[(i*7)+pos].classList.toggle('player1');

                        if(Corroborate()){
                            console.log("Ganaron las P1");
                            // banner("player1");
                            return false;
                        }


                    player= !player;
                    
                    let time= randomInterval(700, 1000);

                    // Turno de la IA
                    table.style.pointerEvents='none';
                    IAHoverAnimation(time);
                    setTimeout(() => {
                        table.style.pointerEvents='auto';
                        IAsTurn(pos, i);
                    }, time);
                    
                }
                else{
                    matrix[i][pos]="o";
                    token[(i*7)+pos].classList.toggle('player2');
                    
                    if(Corroborate()){
                        console.log("Ganaron las P2");
                        // banner("player2");
                        return false;
                    }

                    player= !player;
                }
                break;
            }
        }
    }
}

function IAHoverAnimation(time){
    if(!gameOver){
        let slots=[]
    
        for(let j=0; j<matrix.length; j++){
            for(let i=5; i >= 0; i--){
                if(matrix[i][j]=="-"){
                        slots.push((i*7)+j);
                        break;
                    }
                }
        }

        console.log(slots);
            
        slots = slots.sort((a, b) => 0.5 - Math.random());

        for(let i=0; i<slots.length; i++){
                        slot[slots[i]].classList.remove('player1-pre');
                        slot[slots[i]].classList.remove('player2-pre');
                        
                        setTimeout(() => {
                            slot[slots[i]].classList.add('player2-pre');
                        }, (time / (matrix.length + 1 ))*i);
                        
                        setTimeout(() => {
                            slot[slots[i]].classList.remove('player2-pre');
                        }, (time / (matrix.length + 1))*(i+1));
        }

    }

}

function Corroborate(){
    let check="";

    if(player)
        check="xxxx"
    else
        check="oooo"

    // Correccion en Horizontal
    for(let i=0; i<matrix.length; i++){
        let line=matrix[i].toString().replaceAll(',','');
        
        if(line.includes(check)){
            
            ViewWinner('horizontal', undefined, i, line, check)
            // reset();
            return true;
        }
    }

    // Correccion Vertical
    for(let i=0; i<matrix[0].length; i++){
        let array=[];

        for(let j=0; j<matrix.length; j++){
            array.push(matrix[j][i]);
        }
        
        let line=array.toString().replaceAll(',','');
        
        if(line.includes(check)){
            ViewWinner('vertical', i, undefined, line, check)
            // reset();
            return true;
        }
    }

    // Correcion diagonal (si la matriz fuese cudrada, esto seria mas facil)
        // 4 diagonales principales
        for(let i=0; i<4; i++){
            let array=[]
            for(let j=0, k=i; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            if(line.includes(check)){
                // reset();
                ViewWinner('diagonal-principal', i, undefined, line, check)
                return true;
            }
        }
        
        // 4 diagonales principales inversas
        for(let i=6; i>2; i--){
            let array=[]
            for(let j=0, k=i; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            if(line.includes(check)){
                // reset();
                ViewWinner('diagonal-principal-inversa', i, undefined, line, check)
                return true;
            }
        }

        // 2 diagonales secundarias
        for(let i=1; i<3; i++){
            let array=[]
            for(let j=i, k=0; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            if(line.includes(check)){
                // reset();
                ViewWinner('diagonal-secundaria', i, undefined, line, check)
                return true;
            }
        }

        // 2 diagonales secundarias inversas
        for(let i=1; i<3; i++){
            let array=[]
            for(let j=i, k=6; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            if(line.includes(check)){
                // reset();
                ViewWinner('diagonal-secundaria-inversa', i, undefined, line, check)
                return true;
            }
        }

    // Empate??

    return false;

}


function ViewWinner(motive, column, row, line, check){
    gameOver= true;
    let ext1=0, ext2=0;

    if(motive == 'empate'){
        banner('draw');
        return 0;
    }

    if(motive == 'vertical'){
        
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == check){
                    ext1=i; ext2=i+3;
                    console.log(ext1, ext2)
                }
            }
        }

        for(let i=5; i >= 0; i--){
            if(ext2 >= i && i>= ext1){
                setTimeout(()=>{
                    token[(i*7)+column].classList.add('player-winner');
                }, 200*i);
            }
            
        }

    }

    if(motive == 'horizontal'){
   
        for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == check){
                        ext1=i; ext2=i+3;
                    }
                }
        }
        
        console.log(ext1, ext2)
        
        for(let i=0; i < 7; i++){
                if(ext1 <= i && i <= ext2){
                    setTimeout(()=>{
                        token[(row*7)+i].classList.add('player-winner');
                    }, 200*i);
                }
        }

    }

    if(motive == 'diagonal-principal'){

        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == check){
                    ext1=i; ext2=i+3;
                }
            }
        }
        
            for(let j=0, k=column; j<6 && k<7; j++, k++){
                if(ext1 <= j && j <= ext2){
                    setTimeout(()=>{
                        token[(j*7)+k].classList.add('player-winner');
                    }, 200*j);
                }
            }

    }

    if(motive == 'diagonal-principal-inversa'){
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == check){
                        ext1=i; ext2=i+3;
                    }
                }
            }

            for(let j=0, k=column; j<6 && k>=0; j++, k--){
                if(ext1 <= j && j <= ext2){
                    setTimeout(()=>{
                        token[(j*7)+k].classList.add('player-winner');
                    }, 200*j);
                }
            }

    }

    if(motive == 'diagonal-secundaria'){
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == check){
                    ext1=i-1; ext2=i+3;
                }
            }
        }

        
        for(let j=column, k=0; j<6 && k<7; j++, k++){
            if(ext1 <= k && k <= ext2){
                setTimeout(()=>{
                    token[(j*7)+k].classList.add('player-winner');
                }, 200*k);
            }
        }

    }

    if(motive == 'diagonal-secundaria-inversa'){
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == check){
                    ext1=i-1; ext2=i+3;
                }
            }
        }

        for(let j=column, k=6; j<6 && k>=0; j++, k--){
            if(ext1 <= (6-k) && (6-k) <= ext2){
                setTimeout(()=>{
                    token[(j*7)+k].classList.add('player-winner');
                }, 200*k);
            }
        }

    }





    if(check=='oooo'){
        banner('player2');
    }
    else
        banner('player1');
}

function reset(){
    matrix= [["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",]];

    player= true;

    for(let i=0; i < slot.length;i++){
        token[i].classList.remove('player1');
        token[i].classList.remove('player2');
        token[i].classList.remove('player-winner')
    }

    turnos=0;

    table.removeEventListener('click', tableHandle);
    table.classList.remove('resetAlert');

    gameOver= false;
    points=[0, 0, 0, 0, 0, 0, 0];
    rivalPoints=[0, 0, 0, 0, 0, 0, 0];
}

// Banner Particles

const background= document.getElementsByClassName('element');

setInterval(() => {
    create();
}, 100);

function create(){
    const newDiv= document.createElement('div');
    const newDiv2= document.createElement('div');
    const newDiv3= document.createElement('div');

    newDiv.classList.add('box')
    newDiv2.classList.add('box')
    newDiv3.classList.add('box')

    const randomOffset= randomInterval(0, 100);
    const randomAnimationDuration= randomInterval(0.5, 1)
    const randomScale= randomInterval(0.75, 0.1);
    // const randomColorRed= Math.floor(randomInterval(0, 255));
    // const randomColorBlue= Math.floor(randomInterval(0, 255));
    // const randomColorGreen= Math.floor(randomInterval(0, 255));

    newDiv.style.scale= randomScale + '';
    newDiv2.style.scale= randomScale + '';
    newDiv3.style.scale= randomScale + '';

    newDiv.style.left=randomOffset + '%';
    newDiv2.style.left=randomOffset + '%';
    newDiv3.style.left=randomOffset + '%';

    newDiv.style.animation='fade ' + randomAnimationDuration + 's' + ' forwards linear';
    newDiv2.style.animation='fade ' + randomAnimationDuration + 's' + ' forwards linear';
    newDiv3.style.animation='fade ' + randomAnimationDuration + 's' + ' forwards linear' + ' , ' + 'glitch ' +  randomAnimationDuration + 's' + ' infinite';

    // newDiv.style.background='rgba(' + randomColorRed + ' , ' + randomColorGreen + ' , ' + randomColorBlue + ' , 0.25)';

    background[0].appendChild(newDiv);
    background[1].appendChild(newDiv2);
    background[2].appendChild(newDiv3);

    setTimeout(() => {
        background[0].removeChild(newDiv);
        background[1].removeChild(newDiv2)
        background[2].removeChild(newDiv3)
    }, randomAnimationDuration * 1000)
}

function randomInterval(min, max) {
    return (Math.random() * (max - min + 1) + min)
}


// Banners
const banner1= document.getElementById('banner-player1-wins');
const banner2= document.getElementById('banner-player2-wins');
const bannerDraw= document.getElementById('bannerDraw');

function banner( flag ){

    switch (flag){
        case "player1":
            setTimeout(() => {
                banner1.style.visibility='visible';
                banner1.style.opacity='1';
            }, 2000);
            
            break;
        case "player2":
            
            setTimeout(() => {
                banner2.style.visibility='visible';
                banner2.style.opacity='1';
            }, 2000);

            break;
        case "draw":
            setTimeout(() => {
                bannerDraw.style.visibility='visible';
                bannerDraw.style.opacity='1';
            }, 2000);
            break;
    }
    

    setTimeout(() => {
            table.addEventListener('click', tableHandle);
            table.classList.add('resetAlert');
    }, 2000);
}

function tableHandle(){
        reset();
}



banner1.addEventListener('click', () => {
    banner1.style.opacity= '0';
    
    setTimeout(() => {
    banner1.style.visibility= 'hidden'
    }, 1000);
})
banner2.addEventListener('click', () => {
    banner2.style.opacity= '0';
    
    setTimeout(() => {
    banner2.style.visibility= 'hidden'
    }, 1000);
})
bannerDraw.addEventListener('click', () => {
    bannerDraw.style.opacity= '0';
    
    setTimeout(() => {
    bannerDraw.style.visibility= 'hidden'
    }, 1000);
})

// IA

function IAsTurn(column, row) {
    let evaluation= WinnerColumn(true);


    // Evaluamos a favor de nuestra IA
    if(evaluation.state){
        console.log("PODEMOS GANAR")
        
        if(WinGame(evaluation.column, evaluation.row, evaluation.motive, evaluation.diagonal))
            return 0;
    }

    // Evitamos perder
    evaluation= WinnerColumn(false);
    if(evaluation.state){
        console.log("PODEMOS PERDER", evaluation.motive);

        if(AvoidLose(evaluation.column, evaluation.row, evaluation.motive, evaluation.diagonal))
            return 0;
    }

    //Si no hay una forma de ganar asegurada, 
    //Tampoco hay amenazas...

    // Tiramos en el mejor lujar posible
    
    BestColumn(row, column);
    return 0;
}
function WinnerColumn(flag){
    let check1="";
    let check2="";

    let check3="";
    let check4="";

    let ext1=0, ext2=0;
    let slot1=0, slot2=0;

    let checkAm='';

    if(flag){
        check1="-ooo";
        check2="ooo-";

        check3="o-oo";
        check4="oo-o";
        
        checkAm='ooo';
    }

    else{
        check1="-xxx";
        check2="xxx-";

        check3="x-xx";
        check4="xx-x";

        checkAm='xxx';
    }

    // Corrobora en Horizontal
    for(let i=0; i<matrix.length; i++){
        let line=matrix[i].toString().replaceAll(',','');
        
        if(line.includes(check1) || line.includes(check2)){
            ext1=0; ext2=0; slot1=0; slot2=0;
                // Buscamos las columnas donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == checkAm){
                            ext1=i-1; ext2=i+3;
                        }
                    }
                }

                // Buscamos los extremos para asegurarnos de que la amenaza es real

                for(let i=5; i>=0; i--){
                    if(matrix[i][ext1]=='-'){
                        slot1=i;
                        break;
                    }
                }

                for(let i=5; i>=0; i--){
                    if(matrix[i][ext2]=='-'){
                        slot2=i;
                        break;
                    }
                }

                if(slot1 == i || slot2 == i)
                return {state: true, motive: 'horizontal', column:undefined, row:i};
        }


        if(line.includes(check3) || line.includes(check4)){
            ext1=0; slot1=0;

                // Buscamos las columnas donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
                
                
                // Buscamos los extremos para asegurarnos de que la amenaza es real

                for(let j=5; j>=0; j--){
                    if(matrix[j][ext1]=='-'){
                        if(i==j){
                            slot1=j;
                            break;
                        }

                        else
                            break;
                    }
                }
                console.log(ext1, slot1, i)
                if(slot1 == i)
                    return {state: true, motive: 'horizontal-parcial', column:undefined, row:i};
        }
    }

    // Corrobora en Vertical
    for(let i=0; i<matrix[0].length; i++){
        let array=[];

        for(let j=0; j<matrix.length; j++){
            array.push(matrix[j][i]);
        }
        
        let line=array.toString().replaceAll(',','');
        
        if(line.includes(check1) || line.includes(check2)){
            return {state: true, motive: 'vertical', column:i, row:undefined};
        }
    }

    // Corrobora diagonal (si la matriz fuese cudrada, esto seria mas facil)
        // 4 diagonales principales
        for(let i=0; i<4; i++){
            let array=[]
            for(let j=0, k=i; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
            // Buscamos la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == checkAm){
                            ext1=i-1; ext2=i+3;
                        }
                    }
                }


                for(let j=5; j>=0; j--){
                    if(matrix[j][ext1+i]=='-'){
                        if(ext1 + i>-1){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                for(let j=5; j>=0; j--){
                    if(matrix[j][ext2+i]=='-'){
                        if(ext2 + i<7){
                            slot2=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                
            // Nos aseguramos de que sea evitable
                if((slot1 == (ext1) && ext1 + i>-1) || (slot2 == ext2 && ext2 + i<7))
                    return {state: true, motive: 'diagonal-principal', column:undefined, row:i, diagonal:i};
            }

            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                    for(let j=5; j>=0; j--){
                        if(matrix[j][ext1+i]=='-'){
                            if(ext1 == j){
                                slot1=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
    
                    
                // Nos aseguramos de que sea evitable
                    if(slot1 == (ext1))
                    return {state: true, motive: 'diagonal-principal-parcial', column:undefined, row:i, diagonal:i};
            }

        }
        
        // 4 diagonales principales inversas
        for(let i=6; i>2; i--){
            let array=[]
            for(let j=0, k=i; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
            
            // Buscamos la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == checkAm){
                            ext1=i-1; ext2=i+3;
                        }
                    }
                }


                for(let j=5; j>=0; j--){
                    if(matrix[j][i-ext1]=='-'){
                        if(i - ext1>-1){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                for(let j=5; j>=0; j--){
                    if(matrix[j][i - ext2]=='-'){
                        if(i - ext2<7){
                            slot2=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                
            // Nos aseguramos de que sea evitable
                if((slot1 == (ext1) && i - ext1>-1) || (slot2 == ext2 && i - ext2<7))
                return {state: true, motive: 'diagonal-principal-inversa', column:undefined, row:i, diagonal:i};
            }

            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                for(let j=5; j>=0; j--){
                    if(matrix[j][i - ext1]=='-'){
                        if(ext1 == j){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }
    
                    
                // Nos aseguramos de que sea evitable
                if(slot1 == (ext1))
                return {state: true, motive: 'diagonal-principal-inversa-parcial', column:undefined, row:i, diagonal:i};
            }
        }

        // 2 diagonales secundarias
        for(let i=1; i<3; i++){
            let array=[]
            for(let j=i, k=0; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
                // Buscamos la amenaza
                    for(let i=0; i < line.length; i++){
                        if(i<4){
                            let subline= line.slice(i, i+3);
                            if(subline == checkAm){
                                ext1=i-1; ext2=i+3;
                            }
                        }
                    }
    
    
                    for(let j=5; j>=0; j--){
                        if(matrix[j][ext1]=='-'){
                            if(j == (i + ext1) && ext1>-1){
                                slot1=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
    
                    for(let j=5; j>=0; j--){
                        if(matrix[j][ext2]=='-'){
                            if(j == (i + ext2) && ext2<7){
                                slot2=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }

                // Nos aseguramos de que sea evitable
                    if((slot1 == (i + ext1) && ext1>-1) || (slot2 == (i + ext2) && ext2<7))
                return {state: true, motive: 'diagonal-secundaria', column:undefined, row:i, diagonal:i};
            }


            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                for(let j=5; j>=0; j--){
                    if(matrix[j][ext1]=='-'){
                        if((i + ext1) == j){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }
    
                    
                // Nos aseguramos de que sea evitable
                    if(slot1 == (i + ext1))
                    return {state: true, motive: 'diagonal-secundaria-parcial', column:undefined, row:i, diagonal:i};
            }
        }

        // 2 diagonales secundarias inversas
        for(let i=1; i<3; i++){
            let array=[]
            for(let j=i, k=6; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
                // Buscamos la amenaza
                    for(let i=0; i < line.length; i++){
                        if(i<4){
                            let subline= line.slice(i, i+3);
                            if(subline == checkAm){
                                ext1=i-1; ext2=i+3;
                            }
                        }
                    }
    
    
                    for(let j=5; j>=0; j--){
                        if(matrix[j][6-ext1]=='-'){
                            if(j == (i + ext1) && 6-ext1>-1){
                                slot1=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
    
                    for(let j=5; j>=0; j--){
                        if(matrix[j][6 - ext2]=='-'){
                            if(j == (i + ext2) && 6-ext2<7){
                                slot2=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
                
                    
                // Nos aseguramos de que sea evitable
                if((slot1 == (i + ext1) && 6 - ext1>-1) || (slot2 == (i + ext2) && 6 - ext2<7))
                    return {state: true, motive: 'diagonal-secundaria-inversa', column:undefined, row:i, diagonal:i};
            }

            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                for(let j=5; j>=0; j--){
                    if(matrix[j][6-ext1]=='-'){
                        if((i + ext1) == j){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                // Nos aseguramos de que sea evitable
                    if(slot1 == (i + ext1))
                    return {state: true, motive: 'diagonal-secundaria-inversa-parcial', column:undefined, row:i, diagonal:i};
            }
        }

    // No hay alineamientos de 3

    return false;
}



function AvoidLose(column, row, motive, diagonal){
    //Evitamos en Vertical
    if(motive == 'vertical'){
        slot[column].click();
        return true;
    }

    //Evitamos en Horizontal
    if(motive == 'horizontal'){

        let line= matrix[row].toString().replaceAll(',','');

        let col1=0, col2=0;


        // Buscamos las columnas donde surge la amenaza
        for(let i=0; i < line.length; i++){
            if(i<4){
                let subline= line.slice(i, i+3);
                if(subline == "xxx"){
                    col1=i-1; col2=i+3;
                    console.log('horizontal amenaza', col1, col2)
                }
            }
        }

        // Neutralizamos
        for(let i=5; i >= 0; i--){
            console.log(row);
            if(matrix[i][col1]=="-"){
                if(row==i && col1>-1){
                slot[col1].click();
                return true;
                }

                else
                    break;
                
            }
        }
        for(let i=5; i >= 0; i--){
            console.log(row);
            if(matrix[i][col2]=="-"){
                if(row==i && col2<7){
                slot[col2].click();
                return true;
                }

                else
                    break;
                
            }
        }
        


    }

    //Evitamos en diagonal
        if(motive == 'diagonal-principal'){
            // 4 diagonales principales
                let array=[]
                for(let j=0, k=row; j<6 && k<7; j++, k++){
                    array.push(matrix[j][k])
                }
                
                let line=array.toString().replaceAll(',','');
                let ext1=0, ext2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == "xxx"){
                            ext1=i-1; ext2=i+3;
                            console.log('diagonal amenaza', ext1 + diagonal, ext2 + diagonal)
                        }
                    }
                }

                // Neutralizamos
                for(let i=5; i >= 0; i--){
                    if(matrix[i][ext1 + diagonal]=="-"){
                        if(i == (ext1) && ext1 + diagonal>-1){
                        slot[ext1 + diagonal].click();
                        return true;
                        }

                        else
                            break;
                        
                    }
                }

                for(let i=5; i >= 0; i--){
                    console.log(ext2 + diagonal);
                    if(matrix[i][ext2 + diagonal]=="-"){
                        if(i == ext2 && ext2 + diagonal<7){
                        slot[ext2 + diagonal].click();
                        return true;
                        }

                        else
                            break;
                        
                    }
                }

        }

        if(motive == 'diagonal-principal-inversa'){
            let array=[]
            for(let j=0, k=diagonal; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            console.log('aaaaaaaaaaaaaa', line)
            let ext1=0, ext2=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<4){
                    let subline= line.slice(i, i+3);
                    if(subline == "xxx"){
                        ext1=i-1; ext2=i+3;
                        console.log('diagonal amenaza inversa', diagonal - ext1, diagonal - ext2)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][diagonal - ext1]=="-"){
                    if(i == ext1 &&  diagonal - ext1>-1){
                    slot[diagonal - ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

            for(let i=5; i >= 0; i--){
                if(matrix[i][diagonal - ext2]=="-"){
                    if(i == ext2 &&  diagonal - ext2<7){
                    slot[diagonal - ext2].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }

        if(motive == 'diagonal-secundaria'){
            let array=[]
            for(let j=diagonal, k=0; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            let ext1=0; ext2=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<4){
                    let subline= line.slice(i, i+3);
                    if(subline == "xxx"){
                        ext1=i-1; ext2=i+3;
                        console.log('diagonal secundaria amenaza', ext1, ext2, diagonal)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][ext1]=="-"){
                    if(i == (diagonal + ext1) && ext1>-1){
                    slot[ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

            for(let i=5; i >= 0; i--){
                if(matrix[i][ext2]=="-"){
                    if(i == (diagonal + ext2) && ext2<7){
                    slot[ext2].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }

        if(motive == 'diagonal-secundaria-inversa'){
            let array=[]
            for(let j=diagonal, k=6; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');


            let ext1=0; ext2=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<4){
                    let subline= line.slice(i, i+3);
                    if(subline == "xxx"){
                        ext1=i-1; ext2=i+3;
                        console.log('diagonal secundaria inversa amenaza', 6-ext1, 6-ext2, diagonal)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][6-ext1]=="-"){
                    if(i == (diagonal + ext1) && 6-ext1>-1){
                    slot[6-ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

            for(let i=5; i >= 0; i--){
                if(matrix[i][6-ext2]=="-"){
                    if(i == (diagonal + ext2) && 6-ext2<7){
                    slot[6-ext2].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }


    //Las instrucciones anteriores no detectan las amenazas parciales
    //Es decir, aquellas que no son necesariamente 3 en linea (o - o o)
    //A continuacion las que si lo hacen:

    
    //Evitamos en Horizontal Parcial
    if(motive == 'horizontal-parcial'){

        let line= matrix[row].toString().replaceAll(',','');
        let col1=0;


        // Buscamos las columnas donde surge la amenaza
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == "x-xx"){
                    col1=i+1;
                    console.log('horizontal amenaza parcial', col1)
                }
            }
        }
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == "xx-x"){
                    col1=i+2;
                    console.log('horizontal amenaza parcial', col1)
                }
            }
        }

        // Neutralizamos
        for(let i=5; i >= 0; i--){

            if(matrix[i][col1]=="-"){
                if(row==i){
                slot[col1].click();
                return true;
                }

                else
                    break;
                
            }
        }

    }

    //Evitamos en Diagonal Principal Parcial
        if(motive == 'diagonal-principal-parcial'){
            console.log('aaaa')
            
            // 4 diagonales principales
            let array=[]
            for(let j=0, k=row; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            let ext1=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "x-xx"){
                        ext1=i+1;
                        console.log('diagonal amenaza parcial', ext1 + diagonal)
                    }
                }
            }
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "xx-x"){
                        ext1=i+2;
                        console.log('diagonal amenaza parcial', ext1 + diagonal)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][ext1 + diagonal]=="-"){
                    if(i == (ext1)){
                    slot[ext1 + diagonal].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }
        }

        if(motive == 'diagonal-principal-inversa-parcial'){
            let array=[]
            for(let j=0, k=diagonal; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            
            let ext1=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "x-xx"){
                        ext1=i+1;
                        console.log('diagonal amenaza parcial', diagonal - ext1)
                    }
                }
            }

            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "xx-x"){
                        ext1=i+2;
                        console.log('diagonal amenaza parcial', diagonal - ext1)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][diagonal - ext1]=="-"){
                    if(i == ext1){
                    slot[diagonal - ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }
        }

    //Evitamos en Diagonal Secundaria Parcial
        if(motive == 'diagonal-secundaria-parcial'){
            console.log('xd');
            let array=[]
            for(let j=diagonal, k=0; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            let ext1=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "x-xx"){
                        ext1=i+1;
                        console.log('diagonal secundaria amenaza parcial', ext1, diagonal)
                    }
                }
            }
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "xx-x"){
                        ext1=i+2;
                        console.log('diagonal secundaria amenaza parcial', ext1, diagonal)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][ext1]=="-"){
                    if(i == (diagonal + ext1)){
                    slot[ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }
        
        if(motive == 'diagonal-secundaria-inversa-parcial'){
            let array=[]
            for(let j=diagonal, k=6; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');


            let ext1=0;

            // Buscamos donde surge la amenaza
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "x-xx"){
                        ext1=i+1;
                        console.log('diagonal secundaria inversa amenaza parcial', 6-ext1, diagonal)
                    }
                }
            }

            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "xx-x"){
                        ext1=i+2;
                        console.log('diagonal secundaria inversa amenaza parcial', 6-ext1, diagonal)
                    }
                }
            }

            // Neutralizamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][6-ext1]=="-"){
                    if(i == (diagonal + ext1)){
                    slot[6-ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }

    // Si no hay forma de atender esa amenaza, seguimos de largo
    return false;

}
function WinGame(column, row, motive, diagonal){
    
    //Ganamos en Vertical
    if(motive == 'vertical'){
        slot[column].click();
        return true;
    }

    //Ganamos en Horizontal
    if(motive == 'horizontal'){

        let line= matrix[row].toString().replaceAll(',','');

        let col1=0, col2=0;


        // Buscamos las columnas donde surge la amenaza
        for(let i=0; i < line.length; i++){
            if(i<4){
                let subline= line.slice(i, i+3);
                if(subline == "ooo"){
                    col1=i-1; col2=i+3;
                    console.log('AAAA', col1, col2)
                }
            }
        }

        // Neutralizamos
        for(let i=5; i >= 0; i--){
            console.log(row);
            if(matrix[i][col1]=="-"){
                if(row==i && col1>-1){
                slot[col1].click();
                return true;
                }

                else
                    break;
                
            }
        }
        for(let i=5; i >= 0; i--){
            console.log(row);
            if(matrix[i][col2]=="-"){
                if(row==i && col2<7){
                slot[col2].click();
                return true;
                }

                else
                    break;
                
            }
        }
        


    }

    //Ganamos en Diagonal
    if(motive == 'diagonal-principal'){
        // 4 diagonales principales
            let array=[]
            for(let j=0, k=row; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            let ext1=0, ext2=0;

            // Buscamos donde surge la posibilidad
            for(let i=0; i < line.length; i++){
                if(i<4){
                    let subline= line.slice(i, i+3);
                    if(subline == "ooo"){
                        ext1=i-1; ext2=i+3;
                        console.log('diagonal amenaza', ext1 + diagonal, ext2 + diagonal)
                    }
                }
            }

            // Ganamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][ext1 + diagonal]=="-"){
                    if(i == (ext1) && ext1 + diagonal>-1){
                    slot[ext1 + diagonal].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

            for(let i=5; i >= 0; i--){
                console.log(ext2 + diagonal);
                if(matrix[i][ext2 + diagonal]=="-"){
                    if(i == ext2 && ext2 + diagonal<7){
                    slot[ext2 + diagonal].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

    }

    if(motive == 'diagonal-principal-inversa'){
        let array=[]
        for(let j=0, k=diagonal; j<6 && k>=0; j++, k--){
            array.push(matrix[j][k])
        }
        
        let line=array.toString().replaceAll(',','');
        
        let ext1=0, ext2=0;

        // Buscamos donde surge la posibilidad
        for(let i=0; i < line.length; i++){
            if(i<4){
                let subline= line.slice(i, i+3);
                if(subline == "ooo"){
                    ext1=i-1; ext2=i+3;
                    console.log('diagonal amenaza', diagonal - ext1, diagonal - ext2)
                }
            }
        }

        // Ganamos
        for(let i=5; i >= 0; i--){
            if(matrix[i][diagonal - ext1]=="-"){
                if(i == ext1 &&  diagonal - ext1>-1){
                slot[diagonal - ext1].click();
                return true;
                }

                else
                    break;
                
            }
        }

        for(let i=5; i >= 0; i--){
            if(matrix[i][diagonal - ext2]=="-"){
                if(i == ext2 &&  diagonal - ext2<7){
                slot[diagonal - ext2].click();
                return true;
                }

                else
                    break;
                
            }
        }


    }

    if(motive == 'diagonal-secundaria'){
        let array=[]
        for(let j=diagonal, k=0; j<6 && k<7; j++, k++){
            array.push(matrix[j][k])
        }

        let line=array.toString().replaceAll(',','');
        let ext1=0; ext2=0;

        // Buscamos donde surge la posibilidad
        for(let i=0; i < line.length; i++){
            if(i<4){
                let subline= line.slice(i, i+3);
                if(subline == "ooo"){
                    ext1=i-1; ext2=i+3;
                    console.log('diagonal secundaria amenaza', ext1, ext2, diagonal)
                }
            }
        }

        // Ganamos
        for(let i=5; i >= 0; i--){
            if(matrix[i][ext1]=="-"){
                if(i == (diagonal + ext1) && ext1>-1){
                slot[ext1].click();
                return true;
                }

                else
                    break;
                
            }
        }

        for(let i=5; i >= 0; i--){
            if(matrix[i][ext2]=="-"){
                if(i == (diagonal + ext2) && ext2<7){
                slot[ext2].click();
                return true;
                }

                else
                    break;
                
            }
        }

    }

    if(motive == 'diagonal-secundaria-inversa'){
        let array=[]
        for(let j=diagonal, k=6; j<6 && k>=0; j++, k--){
            array.push(matrix[j][k])
        }
        
        let line=array.toString().replaceAll(',','');


        let ext1=0; ext2=0;

        // Buscamos donde surge la posibilidad
        for(let i=0; i < line.length; i++){
            if(i<4){
                let subline= line.slice(i, i+3);
                if(subline == "ooo"){
                    ext1=i-1; ext2=i+3;
                    console.log('diagonal secundaria inversa amenaza', 6-ext1, 6-ext2, diagonal)
                }
            }
        }

        // Ganamos
        for(let i=5; i >= 0; i--){
            if(matrix[i][6-ext1]=="-"){
                if(i == (diagonal + ext1) && 6-ext1>-1){
                slot[6-ext1].click();
                return true;
                }

                else
                    break;
                
            }
        }

        for(let i=5; i >= 0; i--){
            if(matrix[i][6-ext2]=="-"){
                if(i == (diagonal + ext2) && 6-ext2<7){
                slot[6-ext2].click();
                return true;
                }

                else
                    break;
                
            }
        }

    }


    //Las instrucciones anteriores no detectan las posibilidades parciales
    //Es decir, aquellas que no son necesariamente 3 en linea (o - o o)
    //A continuacion las que si lo hacen:

    
    //Ganamos en Horizontal Parcial
    if(motive == 'horizontal-parcial'){

        let line= matrix[row].toString().replaceAll(',','');
        let col1=0;


        // Buscamos las columnas donde surge la posibilidad
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == "o-oo"){
                    col1=i+1;
                    console.log('horizontal posibilidad parcial', col1)
                }
            }
        }
        for(let i=0; i < line.length; i++){
            if(i<5){
                let subline= line.slice(i, i+4);
                if(subline == "oo-o"){
                    col1=i+2;
                    console.log('horizontal posibilidad parcial', col1)
                }
            }
        }

        // Ganamos
        for(let i=5; i >= 0; i--){

            if(matrix[i][col1]=="-"){
                if(row==i){
                slot[col1].click();
                return true;
                }

                else
                    break;
                
            }
        }

    }

    //Ganamos en Diagonal Principal Parcial
        if(motive == 'diagonal-principal-parcial'){
            console.log('aaaa')
            
            // 4 diagonales principales
            let array=[]
            for(let j=0, k=row; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            let ext1=0;

            // Buscamos donde surge la posibilidad
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "o-oo"){
                        ext1=i+1;
                        console.log('diagonal posibilidad parcial', ext1 + diagonal)
                    }
                }
            }
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "oo-o"){
                        ext1=i+2;
                        console.log('diagonal posibilidad parcial', ext1 + diagonal)
                    }
                }
            }

            // Ganamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][ext1 + diagonal]=="-"){
                    if(i == (ext1)){
                    slot[ext1 + diagonal].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }
        }

        if(motive == 'diagonal-principal-inversa-parcial'){
            let array=[]
            for(let j=0, k=diagonal; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            
            let ext1=0;

            // Buscamos donde surge la posibilidad
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "o-oo"){
                        ext1=i+1;
                        console.log('diagonal posibilidad parcial', diagonal - ext1)
                    }
                }
            }

            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "oo-o"){
                        ext1=i+2;
                        console.log('diagonal posibilidad parcial', diagonal - ext1)
                    }
                }
            }

            // Ganamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][diagonal - ext1]=="-"){
                    if(i == ext1){
                    slot[diagonal - ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }
        }

    //Ganamos en Diagonal Secundaria Parcial
        if(motive == 'diagonal-secundaria-parcial'){
            let array=[]
            for(let j=diagonal, k=0; j<6 && k<7; j++, k++){
                array.push(matrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            let ext1=0;

            // Buscamos donde surge la posibilidad
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "o-oo"){
                        ext1=i+1;
                        console.log('diagonal secundaria posibilidad parcial', ext1, diagonal)
                    }
                }
            }
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "oo-o"){
                        ext1=i+2;
                        console.log('diagonal secundaria posibilidad parcial', ext1, diagonal)
                    }
                }
            }

            // Ganamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][ext1]=="-"){
                    if(i == (diagonal + ext1)){
                    slot[ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }
        
        if(motive == 'diagonal-secundaria-inversa-parcial'){
            let array=[]
            for(let j=diagonal, k=6; j<6 && k>=0; j++, k--){
                array.push(matrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');


            let ext1=0;

            // Buscamos donde surge la posibilidad
            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "o-oo"){
                        ext1=i+1;
                        console.log('diagonal secundaria inversa posibilidad parcial', 6-ext1, diagonal)
                    }
                }
            }

            for(let i=0; i < line.length; i++){
                if(i<5){
                    let subline= line.slice(i, i+4);
                    if(subline == "oo-o"){
                        ext1=i+2;
                        console.log('diagonal secundaria inversa posibilidad parcial', 6-ext1, diagonal)
                    }
                }
            }

            // Ganamos
            for(let i=5; i >= 0; i--){
                if(matrix[i][6-ext1]=="-"){
                    if(i == (diagonal + ext1)){
                    slot[6-ext1].click();
                    return true;
                    }

                    else
                        break;
                    
                }
            }

        }

    return false;

}



function BestColumn(row, column){
    // // Primero nos centramos en las columnas vacias desde el centro
        for(let i=3, k=3; i<matrix[0].length-2 && k>1; i++, k--){
            let array1=[];
            let array2=[];

            for(let j=0; j<matrix.length; j++){
                array1.push(matrix[j][i]);
                array2.push(matrix[j][k]);
            }
            
            let line=array1.toString().replaceAll(',','');
            let line2=array2.toString().replaceAll(',','');
            
            if(line == '------'){
                slot[i].click();
                return 0;
            }

            if(line2 == '------'){
                slot[k].click();
                return 0;
            }
        }

    // Ya nos encargamos de asegurar que en el comienzo no tomen el centro, ahora recorremos de igual forma
    // Pero para evaluar la conveniencia de cada columna, en este caso, para el enemigo
    points=[0, 0, 0, 0, 0, 0, 0];
    rivalPoints=[0, 0, 0, 0, 0, 0, 0];

    // Evaluamos a su favor
    for(let i=0; i<matrix[0].length; i++){
        let array1=[];

        for(let j=0; j<matrix.length; j++){
            array1.push(matrix[j][i]);
        }
        
        let line=array1.toString().replaceAll(',','');
        
        evalRivalColumn(line, i, 'x');
    }

    //Evaluamos al nuestro
    for(let i=0; i<matrix[0].length; i++){
        let array1=[];

        for(let j=0; j<matrix.length; j++){
            array1.push(matrix[j][i]);
        }
        
        let line=array1.toString().replaceAll(',','');
        
        evalIAColumn(line, i, 'o');
    }

    //Evaluamos el riesgo de perdida en ambos casos

    console.log(rivalPoints.toString().replaceAll(',',' '), '\n', points.toString().replaceAll(',',' '))

    for(let i=0; i<7; i++){
        evalRisk(true);
        evalRisk(false);
    }

    let bestRival = Math.max(...rivalPoints);
    let bestIA = Math.max(...points);

    console.log(rivalPoints.toString().replaceAll(',',' '), '\n', points.toString().replaceAll(',',' '))
    console.log(bestIA, bestRival)
    
    if(bestRival>=bestIA){
        for(let i=3, k=3; i<matrix[0].length && k>=0; i++, k--){
                if(i==3 && k==3){
                    if(bestRival==rivalPoints[i]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][i]=='-'){
                                slot[i].click();
                                return 0;
                            }
                        }
                    }
                }

                else{
                    if(bestRival==rivalPoints[k]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][k]=='-'){
                                slot[k].click();
                                return 0;
                            }
                        }
                    }

                    
                    if(bestRival==rivalPoints[i]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][i]=='-'){
                                slot[i].click();
                                return 0;
                            }
                        }
                    }
                }
        }
    }

    else{
        for(let i=3, k=3; i<matrix[0].length && k>=0; i++, k--){
            if(i==3 && k==3){
                if(bestIA==points[i]){
                    for(let j=5; j>=0; j--){
                        if(matrix[j][i]=='-'){
                            slot[i].click();
                            return 0;
                        }
                    }
                }
            }

            else{
                if(bestIA==points[k]){
                    for(let j=5; j>=0; j--){
                        if(matrix[j][k]=='-'){
                            slot[k].click();
                            return 0;
                        }
                    }
                }

                
                if(bestIA==points[i]){
                    for(let j=5; j>=0; j--){
                        if(matrix[j][i]=='-'){
                            slot[i].click();
                            return 0;
                        }
                    }
                }
            }
        }
    }
}
function evalRivalColumn(line, column, comp){
    for(let i=5; i>=0; i--){
        rivalPoints[column]=-1; //Eliminamos columnas llenas

        if(line[i]=='-'){
            // Obtenemos la ultima pieza
            rivalPoints[column]=0; //Si se puede tirar, la ponemos a 0 de nuevo y evaluamos

            // console.log(i, column);

            //Evaluacion Horizontal
                let line= matrix[i].toString().replaceAll(',','');
                // console.log(line, 'h')

                    for(let j=column+1; j<line.length; j++){
                        // console.log(line[j], comp)
                        if(line[j]==comp)
                            rivalPoints[column]++;

                        else{
                            break;
                        }
                    }

                    for(let j=column-1; j>0; j--){
                        // console.log(line[j], 'aca', column)
                        if(line[j]==comp)
                            rivalPoints[column]++;

                        else{
                            break;
                        }
                    }

            //Evaluacion Vertical
                let array=[];
        
                for(let k=0; k<matrix.length; k++){
                    array.push(matrix[k][column]);
                }
                
                line=array.toString().replaceAll(',','');
                // console.log(line, 'v')
                
                for(let j=i+1; j<line.length; j++){
                    // console.log(line[j], comp)
                    if(line[j]==comp){
                        rivalPoints[column]++;
                    }

                    else{
                        break;
                    }
                }

            // Evaluacion Diagonal
                // Evaluacion Diagonal Principal
                    array=[]
                    for(let j=0, k=column-i; (j<6 && k<7) && (k>=0) && (j>=0); j++, k++){
                        array.push(matrix[j][k])
                    }
                    
                    line=array.toString().replaceAll(',','');

                    // console.log(line, 'dp');

                    for(let j=i+1; j<line.length; j++){
                    if(line[j]==comp){
                        rivalPoints[column]++;
                    }

                    else{
                        break;
                    }
                    }
                    
                    for(let j=i-1; j>=0; j--){
                    if(line[j]==comp){
                        rivalPoints[column]++;
                    }

                    else{
                        break;
                    }
                    }
                
                // Evaluacion Diagonal Principal Inversa
                    array=[]
                    for(let j=0, k=i+column; (j<6 && k>=0) && (j>=0) && (k<7); j++, k--){
                        array.push(matrix[j][k])
                    }
                    
                    line= array.toString().replaceAll(',','');
                    // console.log(line, 'dpi')

                    for(let j=i+1; j<line.length; j++){
                        if(line[j]==comp){
                            rivalPoints[column]++;
                        }
    
                        else{
                            break;
                        }
                    }
                    
                    for(let j=i-1; j>=0; j--){
                        if(line[j]==comp){
                            rivalPoints[column]++;
                        }

                        else{
                            break;
                        }
                    }
                
                // Evaluacion Diagonal Secundaria
                    array=[]
                    if(i-column < 3){
                        for(let j=i-column, k=0; (j<6 && k<7) && (j>0); j++, k++){
                            array.push(matrix[j][k])
                        }
                    }
        
                    line=array.toString().replaceAll(',','');
                    // console.log(line, 'ds')

                    for(let j=column+1; j<line.length; j++){
                        if(line[j]==comp){
                            rivalPoints[column]++;
                        }
    
                        else{
                            break;
                        }
                    }
                    
                    for(let j=column-1; j>=0; j--){
                        if(line[j]==comp){
                            rivalPoints[column]++;
                        }

                        else{
                            break;
                        }
                    }

                // Evaluacion Diagonal Secundaria Inversa
                    array=[]
                    if(( i-(6-column) )< 3){
                        for(let j=i-(6-column), k=6; (j<6 && k>=0) && (j>0); j++, k--){
                            array.push(matrix[j][k])
                        }
                    }
                    
                    line=array.toString().replaceAll(',','');
                    // console.log(line, 'dsi');

                    for(let j=i-1; j<line.length; j++){
                        if(line[j]==comp){
                            rivalPoints[column]++;
                        }
    
                        else{
                            break;
                        }
                    }
                    
                    for(let j=i-3; j>=0; j--){
                        if(line[j]==comp){
                            rivalPoints[column]++;
                        }

                        else{
                            break;
                        }
                    }

                // if(rivalPoints[column] > 3)
                //     rivalPoints[column]=0;

                return 0;
        }
    }
    
    console.log('-', column)
}
function evalIAColumn(line, column, comp){
    for(let i=5; i>=0; i--){
        points[column]=-1; //Eliminamos columnas llenas

        if(line[i]=='-'){
            // Obtenemos la ultima pieza
            points[column]=0; //Si se puede tirar, la ponemos a 0 de nuevo y evaluamos

            // console.log(i, column);

            //Evaluacion Horizontal
                let line= matrix[i].toString().replaceAll(',','');
                // console.log(line, 'h')

                    for(let j=column+1; j<line.length; j++){
                        // console.log(line[j], comp)
                        if(line[j]==comp)
                            points[column]++;

                        else{
                            break;
                        }
                    }

                    for(let j=column-1; j>0; j--){
                        // console.log(line[j], 'aca', column)
                        if(line[j]==comp)
                            points[column]++;

                        else{
                            break;
                        }
                    }

            //Evaluacion Vertical
                let array=[];
        
                for(let k=0; k<matrix.length; k++){
                    array.push(matrix[k][column]);
                }
                
                line=array.toString().replaceAll(',','');
                // console.log(line, 'v')
                
                for(let j=i+1; j<line.length; j++){
                    // console.log(line[j], comp)
                    if(line[j]==comp){
                        points[column]++;
                    }

                    else{
                        break;
                    }
                }

            // Evaluacion Diagonal
                // Evaluacion Diagonal Principal
                    array=[]
                    for(let j=0, k=column-i; (j<6 && k<7) && (k>=0) && (j>=0); j++, k++){
                        array.push(matrix[j][k])
                    }
                    
                    line=array.toString().replaceAll(',','');

                    // console.log(line, 'dp');

                    for(let j=i+1; j<line.length; j++){
                    if(line[j]==comp){
                        points[column]++;
                    }

                    else{
                        break;
                    }
                    }
                    
                    for(let j=i-1; j>=0; j--){
                    if(line[j]==comp){
                        points[column]++;
                    }

                    else{
                        break;
                    }
                    }
                
                // Evaluacion Diagonal Principal Inversa
                    array=[]
                    for(let j=0, k=i+column; (j<6 && k>=0) && (j>=0) && (k<7); j++, k--){
                        array.push(matrix[j][k])
                    }
                    
                    line= array.toString().replaceAll(',','');
                    // console.log(line, 'dpi')

                    for(let j=i+1; j<line.length; j++){
                        if(line[j]==comp){
                            points[column]++;
                        }
    
                        else{
                            break;
                        }
                    }
                    
                    for(let j=i-1; j>=0; j--){
                        if(line[j]==comp){
                            points[column]++;
                        }

                        else{
                            break;
                        }
                    }
                
                // Evaluacion Diagonal Secundaria
                    array=[]
                    if(i-column < 3){
                        for(let j=i-column, k=0; (j<6 && k<7) && (j>0); j++, k++){
                            array.push(matrix[j][k])
                        }
                    }
        
                    line=array.toString().replaceAll(',','');
                    // console.log(line, 'ds')

                    for(let j=column+1; j<line.length; j++){
                        if(line[j]==comp){
                            points[column]++;
                        }
    
                        else{
                            break;
                        }
                    }
                    
                    for(let j=column-1; j>=0; j--){
                        if(line[j]==comp){
                            points[column]++;
                        }

                        else{
                            break;
                        }
                    }

                // Evaluacion Diagonal Secundaria Inversa
                    array=[]
                    if(( i-(6-column) )< 3){
                        for(let j=i-(6-column), k=6; (j<6 && k>=0) && (j>0); j++, k--){
                            array.push(matrix[j][k])
                        }
                    }
                    
                    line=array.toString().replaceAll(',','');
                    // console.log(line, 'dsi');

                    for(let j=i-1; j<line.length; j++){
                        if(line[j]==comp){
                            points[column]++;
                        }
    
                        else{
                            break;
                        }
                    }
                    
                    for(let j=i-3; j>=0; j--){
                        if(line[j]==comp){
                            points[column]++;
                        }

                        else{
                            break;
                        }
                    }
                
                // if(rivalPoints[column] > 3)
                //     rivalPoints[column]=0;

                return 0;
        }
    }
    
    // console.log('-', column)
}

function evalRisk(flag){
    if(flag){
        //IA
        let bestIA = Math.max(...points);
        
    // Clonamos la matrix
    for(let i=0; i<clonedMatrix.length; i++){
        for(let j=0; j<clonedMatrix[i].length; j++){
            clonedMatrix[i][j]=matrix[i][j];
        }
    }
    
    // Evaluamos si el mejor tiro amigo nos pone en peligro
            for(let i=3, k=3; i<matrix[0].length && k>=0; i++, k--){
                if(i==3 && k==3){
                    if(bestIA==points[i]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][i]=='-'){
                            clonedMatrix[j][i]='o';
                            break;
                            }
                        }
                        if(RiskOfLose(false).state){
                            points[i]=-1;
                            bestIA = Math.max(...points)
                            break;
                        }
                        
                    break;
                    }
                }

                else{
                    if(bestIA==points[k]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][k]=='-'){
                            clonedMatrix[j][k]='o';
                            break;
                            }
                        }
                        if(RiskOfLose(false).state){
                            points[k]=-1;
                            bestIA = Math.max(...points)
                            break;
                        }
                        
                    break;
                    }

                    
                    if(bestIA==points[i]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][i]=='-'){
                            clonedMatrix[j][i]='o';
                            break;
                            }
                        }
                        if(RiskOfLose(false).state){
                            points[i]=-1;
                            bestIA = Math.max(...points)
                            break;
                        }
                        
                    break;
                    }
                }
            }
            
            return 0;
    }
    
    else{
        //Player
        let bestRival = Math.max(...rivalPoints);

    // Clonamos la matrix
    for(let i=0; i<clonedMatrix.length; i++){
        for(let j=0; j<clonedMatrix[i].length; j++){
            clonedMatrix[i][j]=matrix[i][j];
        }
    }

    // Evaluamos si el mejor tiro enemigo nos pone en peligro
            for(let i=3, k=3; i<matrix[0].length && k>=0; i++, k--){
                if(i==3 && k==3){
                    if(bestRival==rivalPoints[i]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][i]=='-'){
                                clonedMatrix[j][i]='o';
                                break;
                            }
                        }
                        if(RiskOfLose(false).state){
                            rivalPoints[i]=-1;
                            bestRival = Math.max(...rivalPoints)
                            break;
                        }

                        break;
                    }
                }

                else{
                    if(bestRival==rivalPoints[k]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][k]=='-'){
                                clonedMatrix[j][k]='o';
                                break
                            }
                        }
                        if(RiskOfLose(false).state){
                            rivalPoints[k]=-1;
                            bestRival = Math.max(...rivalPoints)
                            break;
                        }
                        
                        break;
                    }

                    
                    if(bestRival==rivalPoints[i]){
                        for(let j=5; j>=0; j--){
                            if(matrix[j][i]=='-'){
                                clonedMatrix[j][i]='o';
                                break
                            }
                        }
                        if(RiskOfLose(false).state){
                            rivalPoints[i]=-1;
                            bestRival = Math.max(...rivalPoints)
                            break;
                        }
                        
                        break;
                    }
                }
            }
            
            return 0;
    }

}

function RiskOfLose(flag){
    let check1="";
    let check2="";

    let check3="";
    let check4="";

    let ext1=0, ext2=0;
    let slot1=0, slot2=0;

    let checkAm='';

    if(flag){
        check1="-ooo";
        check2="ooo-";

        check3="o-oo";
        check4="oo-o";
        
        checkAm='ooo';
    }

    else{
        check1="-xxx";
        check2="xxx-";

        check3="x-xx";
        check4="xx-x";

        checkAm='xxx';
    }

    // Corrobora en Horizontal
    for(let i=0; i<clonedMatrix.length; i++){
        let line=clonedMatrix[i].toString().replaceAll(',','');
        
        if(line.includes(check1) || line.includes(check2)){
            ext1=0; ext2=0; slot1=0; slot2=0;
                // Buscamos las columnas donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == checkAm){
                            ext1=i-1; ext2=i+3;
                        }
                    }
                }

                // Buscamos los extremos para asegurarnos de que la amenaza es real

                for(let i=5; i>=0; i--){
                    if(clonedMatrix[i][ext1]=='-'){
                        slot1=i;
                        break;
                    }
                }

                for(let i=5; i>=0; i--){
                    if(clonedMatrix[i][ext2]=='-'){
                        slot2=i;
                        break;
                    }
                }

                if(slot1 == i || slot2 == i)
                return {state: true, motive: 'horizontal', column:undefined, row:i};
        }


        if(line.includes(check3) || line.includes(check4)){
            ext1=0; slot1=0;

                // Buscamos las columnas donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
                
                
                // Buscamos los extremos para asegurarnos de que la amenaza es real

                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][ext1]=='-'){
                        if(i==j){
                            slot1=j;
                            break;
                        }

                        else
                            break;
                    }
                }
                console.log(ext1, slot1, i)
                if(slot1 == i)
                    return {state: true, motive: 'horizontal-parcial', column:undefined, row:i};
        }
    }

    // Corrobora en Vertical
    for(let i=0; i<clonedMatrix[0].length; i++){
        let array=[];

        for(let j=0; j<clonedMatrix.length; j++){
            array.push(clonedMatrix[j][i]);
        }
        
        let line=array.toString().replaceAll(',','');
        
        if(line.includes(check1) || line.includes(check2)){
            return {state: true, motive: 'vertical', column:i, row:undefined};
        }
    }

    // Corrobora diagonal (si la matriz fuese cudrada, esto seria mas facil)
        // 4 diagonales principales
        for(let i=0; i<4; i++){
            let array=[]
            for(let j=0, k=i; j<6 && k<7; j++, k++){
                array.push(clonedMatrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
            // Buscamos la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == checkAm){
                            ext1=i-1; ext2=i+3;
                        }
                    }
                }


                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][ext1+i]=='-'){
                        if(ext1 + i>-1){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][ext2+i]=='-'){
                        if(ext2 + i<7){
                            slot2=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                
            // Nos aseguramos de que sea evitable
                if((slot1 == (ext1) && ext1 + i>-1) || (slot2 == ext2 && ext2 + i<7))
                    return {state: true, motive: 'diagonal-principal', column:undefined, row:i, diagonal:i};
            }

            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                    for(let j=5; j>=0; j--){
                        if(clonedMatrix[j][ext1+i]=='-'){
                            if(ext1 == j){
                                slot1=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
    
                    
                // Nos aseguramos de que sea evitable
                    if(slot1 == (ext1))
                    return {state: true, motive: 'diagonal-principal-parcial', column:undefined, row:i, diagonal:i};
            }

        }
        
        // 4 diagonales principales inversas
        for(let i=6; i>2; i--){
            let array=[]
            for(let j=0, k=i; j<6 && k>=0; j++, k--){
                array.push(clonedMatrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
            
            // Buscamos la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<4){
                        let subline= line.slice(i, i+3);
                        if(subline == checkAm){
                            ext1=i-1; ext2=i+3;
                        }
                    }
                }


                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][i-ext1]=='-'){
                        if(i - ext1>-1){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][i - ext2]=='-'){
                        if(i - ext2<7){
                            slot2=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                
            // Nos aseguramos de que sea evitable
                if((slot1 == (ext1) && i - ext1>-1) || (slot2 == ext2 && i - ext2<7))
                return {state: true, motive: 'diagonal-principal-inversa', column:undefined, row:i, diagonal:i};
            }

            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][i - ext1]=='-'){
                        if(ext1 == j){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }
    
                    
                // Nos aseguramos de que sea evitable
                if(slot1 == (ext1))
                return {state: true, motive: 'diagonal-principal-inversa-parcial', column:undefined, row:i, diagonal:i};
            }
        }

        // 2 diagonales secundarias
        for(let i=1; i<3; i++){
            let array=[]
            for(let j=i, k=0; j<6 && k<7; j++, k++){
                array.push(clonedMatrix[j][k])
            }

            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
                // Buscamos la amenaza
                    for(let i=0; i < line.length; i++){
                        if(i<4){
                            let subline= line.slice(i, i+3);
                            if(subline == checkAm){
                                ext1=i-1; ext2=i+3;
                            }
                        }
                    }
    
    
                    for(let j=5; j>=0; j--){
                        if(clonedMatrix[j][ext1]=='-'){
                            if(j == (i + ext1) && ext1>-1){
                                slot1=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
    
                    for(let j=5; j>=0; j--){
                        if(clonedMatrix[j][ext2]=='-'){
                            if(j == (i + ext2) && ext2<7){
                                slot2=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }

                // Nos aseguramos de que sea evitable
                    if((slot1 == (i + ext1) && ext1>-1) || (slot2 == (i + ext2) && ext2<7))
                return {state: true, motive: 'diagonal-secundaria', column:undefined, row:i, diagonal:i};
            }


            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][ext1]=='-'){
                        if((i + ext1) == j){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }
    
                    
                // Nos aseguramos de que sea evitable
                    if(slot1 == (i + ext1))
                    return {state: true, motive: 'diagonal-secundaria-parcial', column:undefined, row:i, diagonal:i};
            }
        }

        // 2 diagonales secundarias inversas
        for(let i=1; i<3; i++){
            let array=[]
            for(let j=i, k=6; j<6 && k>=0; j++, k--){
                array.push(clonedMatrix[j][k])
            }
            
            let line=array.toString().replaceAll(',','');
            if(line.includes(check1) || line.includes(check2)){
                ext1=0; ext2=0; slot1=0; slot2=0;
                // Buscamos la amenaza
                    for(let i=0; i < line.length; i++){
                        if(i<4){
                            let subline= line.slice(i, i+3);
                            if(subline == checkAm){
                                ext1=i-1; ext2=i+3;
                            }
                        }
                    }
    
    
                    for(let j=5; j>=0; j--){
                        if(clonedMatrix[j][6-ext1]=='-'){
                            if(j == (i + ext1) && 6-ext1>-1){
                                slot1=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
    
                    for(let j=5; j>=0; j--){
                        if(clonedMatrix[j][6 - ext2]=='-'){
                            if(j == (i + ext2) && 6-ext2<7){
                                slot2=j;
                                break;
                            }
    
                            else{
                                break;
                            }
                        }
                    }
                
                    
                // Nos aseguramos de que sea evitable
                if((slot1 == (i + ext1) && 6 - ext1>-1) || (slot2 == (i + ext2) && 6 - ext2<7))
                    return {state: true, motive: 'diagonal-secundaria-inversa', column:undefined, row:i, diagonal:i};
            }

            if(line.includes(check3) || line.includes(check4)){
                ext1=0; ext2=0; slot1=0; slot2=0;

                // Buscamos donde surge la amenaza
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check3){
                            ext1=i+1;
                        }
                    }
                }
                for(let i=0; i < line.length; i++){
                    if(i<5){
                        let subline= line.slice(i, i+4);
                        if(subline == check4){
                            ext1=i+2;
                        }
                    }
                }
    
                for(let j=5; j>=0; j--){
                    if(clonedMatrix[j][6-ext1]=='-'){
                        if((i + ext1) == j){
                            slot1=j;
                            break;
                        }

                        else{
                            break;
                        }
                    }
                }

                // Nos aseguramos de que sea evitable
                    if(slot1 == (i + ext1))
                    return {state: true, motive: 'diagonal-secundaria-inversa-parcial', column:undefined, row:i, diagonal:i};
            }
        }

    // No hay alineamientos de 3

    return {state: false, motive: '', column:0, row:0, diagonal:0};
}
