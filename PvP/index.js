const slot = document.getElementsByClassName('slot-bg');
const token= document.getElementsByClassName('slot');

const table= document.getElementById('table');

let player= true;
let gameOver= false;

let prepos=0;

const redTokens= document.getElementsByClassName('player1');
const blueTokens= document.getElementsByClassName('player2');

let turnos=0;

let matrix= [["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",],
             ["-", "-", "-", "-", "-", "-", "-",]]



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

function Turn(pos){

    if(!gameOver){
        turnos++;
        console.log(redTokens.length + blueTokens.length);
        if( redTokens.length + blueTokens.length > 40){
            //empate
            // reset();
            console.log("EMPATE");
            ViewWinner('empate');

            return false;
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