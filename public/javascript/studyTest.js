
var seikai = (52,44);

var rand1 = Math.floor(Math.random() * 99) + 1;
var rand2 = Math.floor(Math.random() * 99) + 1;


function forword() {

    for(var i=0; i<200; i++) {
        
    }

}
















/*
const node1 = [];
const node2 = [];

var rand1 = Math.floor(Math.random() * 99) + 1 ;
var rand2 = Math.floor(Math.random() * 99) + 1 ;

for( var i=0; i<1000; i++) {
    
}
*/

/*
const node = [];

function create_roll() {
    var count = 0;
    
    if(node == undefined) {
        node[0] = {
          prev: null,
          main: null,
          next: null
        };
    }

    while(true) {
        var rand = Math.floor(Math.random() * 99) + 1;
        if(count == 0) {
            node[count] = { prev:0, main:rand, next:node[count+1] };
            count++;
        } else {
            if(rand == 85 || count == 100) {
                node[0].prev = node[count];
                node[count] = { prev: node[count-1], main:rand, next:node[0]};
                break;
            } else {
            node[count] = { prev: node[count-1], main:rand, next:node[count+1]};
            count++;
            }
        }
    }
}


function roll() {   
    var nodeStart = node;
    for(var i=0; i<100; i++) {
        console.log();
    }
}

create_roll();

roll();

*/