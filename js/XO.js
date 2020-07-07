
    var turn=true //x turn
    var squares=[];

    function reset(A,B,C){
   document.getElementById('s'+A).style.color="#000";
   document.getElementById('s'+B).style.color="#000";
   document.getElementById('s'+C).style.color="#000";
   
   console.log('reset')

   setTimeout(function(){location.reload()},2000);
  }


  function checkWinner(){
   for (var i=1; i<=9; i++) {
    squares[i] = document.getElementById('s'+i).innerHTML;
   }

   var winnerStr=""
   // check horizontal
   if (squares[1]==squares[2] && squares[2]==squares[3] && squares[1]!=""){
    // document.write('player ' + squares[1] +' Wins the game');
    winnerStr='player ' + squares[1] +' Wins the game'
   console.log('chechwinner')
   reset(1,2,3);
    
   }
   if (squares[4]==squares[5] && squares[5]==squares[6] && squares[4]!=""){
    winnerStr ='player ' + squares[4] +' Wins the game'
    reset(4,5,6);
   }
   if (squares[7]==squares[8] && squares[8]==squares[9] && squares[7]!=""){
    winnerStr ='player ' + squares[7] +' Wins the game'
    reset(7,8,9);
   }

   //check vertical
   if (squares[1]==squares[4] && squares[4]==squares[7] && squares[1]!=""){
    winnerStr ='player ' + squares[1] +' Wins the game'
   reset(1,4,7);
   }
   if (squares[2]==squares[5] && squares[5]==squares[8] && squares[2]!=""){
     
    winnerStr ='player ' + squares[2] +' Wins the game'
    reset(2,5,8);
   }
   if (squares[3]==squares[6] && squares[6]==squares[9] && squares[3]!=""){
    winnerStr ='player ' + squares[3] +' Wins the game'
    reset(3,6,9);
   }

   //check diagonal
   if (squares[1]==squares[5] && squares[5]==squares[9] && squares[1]!=""){
     winnerStr ='player ' + squares[1] +' Wins the game';
    reset(1,5,9);
   }
   if (squares[3]==squares[5] && squares[5]==squares[7] && squares[3]!=""){
    winnerStr ='player ' + squares[3] +' Wins the game';
    reset(3,5,7);
   }
   if(winnerStr){
     var mainDiv=document.querySelector('.main')
    var winnerport=document.querySelector('.winnerPort')
    winnerport.innerHTML=winnerStr
    winnerport.style.background='rgb(135, 16, 233)'
    console.log(winnerport,winnerStr)

   }
   


  }
// debugger
  function insert(id){
   var S = document.getElementById(id);
  

   if(turn && S.innerHTML==""){
    S.setAttribute('style', 'color:orange');
    S.innerHTML="X";
    turn = !turn;
   }else if(!turn && S.innerHTML==""){
    S.setAttribute('style', 'color:yellow');
    S.innerHTML="O";
    turn = !turn;
   }
   console.log('insert')
   checkWinner();
  }


  