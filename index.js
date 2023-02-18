const slot = document.getElementsByClassName('slot-bg');
const token= document.getElementsByClassName('slot');

let player= true;

let prepos=0;

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
                prepos=(i*7)+pos;
                slot[(i*7)+pos].classList.add('player2-pre');
            }
            break;
        }
    }
}

function Turn(pos){
    turnos++;
    if(turnos==42){
        //empate
        reset();
        console.log("EMPATE")
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
                        return false;
                    }
                
                player= !player;
            }
            else{
                matrix[i][pos]="o";
                token[(i*7)+pos].classList.toggle('player2');
                
                if(Corroborate()){
                    console.log("Ganaron las P2");
                    return false;
                }

                player= !player;
            }
            break;
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
            reset();
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
            reset();
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
                reset();
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
                reset();
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
                reset();
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
                reset();
                return true;
            }
        }

    // Empate??

    return false;

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
    }

    turnos=0;
}