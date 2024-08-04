let unit;
let border;
let interval;
// let orient = 1;
let shape;
document.addEventListener("DOMContentLoaded",function(){
    const canvas = document.querySelector("canvas");
    unit = Math.floor(innerHeight/25) ;
    const width = canvas.width = 10*unit;
    const height = canvas.height = 20*unit;
    border = unit/20;

    // let x = 4*unit,y = -unit;
    // let shapeXLimit, shapeYLimit;
    //createBlock(unit*2,unit*2);
    function createBlock(x,y,erase){
        ctx = canvas.getContext("2d");
        if(erase){
            ctx.clearRect(x ,y ,unit,unit);
            //ctx.clearStroke(x,y,unit,unit);
            ctx1.clearRect((x)+border ,(y)+border ,unit-(2*border) ,unit-(2*border));
            return;
        }
        ctx.fillStyle = "black";
        ctx.fillRect(x ,y ,unit,unit);

        ctx1 = canvas.getContext("2d");
        ctx1.beginPath();
        ctx1.fillStyle = "blue";
        ctx1.fillRect((x)+border ,(y)+border ,unit-(2*border) ,unit-(2*border));

        // ctx.strokeStyle = "black";
        // ctx.strokeRect(x,y,unit,unit);
        
    }
    class Line{
        x = 4*unit;
        y = -unit;
        orient = 1;
        erase = false;
        xLimit;
        yLimit;
        stop = false;
        draw(){
            createBlock(this.x,this.y,this.erase);
            if(this.orient === 1){
                createBlock(this.x,this.y+unit,this.erase);
                createBlock(this.x,this.y+2*unit,this.erase);
                this.xLimit = this.x+unit;
                this.yLimit = this.y+3*unit;
            }
            else{
                createBlock(this.x+unit,this.y,this.erase);
                createBlock(this.x+2*unit,this.y,this.erase);
                this.xLimit = this.x+3*unit;
                this.yLimit = this.y+unit;
            }
        }
    }
    // function createLine(x,y,orient,erase){  
    // }
    // function createZ(x,y,orient){
    //     if(orient === 1){
    //         createBlock(x,y);
    //         createBlock(x+unit,y);
    //         createBlock(x+unit,y+unit);
    //         createBlock(x+2*unit,y+unit);
    //     }
    //     else if(orient === 2){
    //         createBlock(x+unit,y);
    //         createBlock(x+unit,y+unit);
    //         createBlock(x,y+unit);
    //         createBlock(x,y+2*unit);
    //     }
    // }
    
    // startMoving();
    // createLine(unit*2,unit*2,1);
    // createLine(unit*4,unit*2,2);
    // function startMoving(){
    //     interval = setInterval(()=>{
    //         if(y >= 0){
    //             createLine(x,y,orient,true);
    //         }
    //         y+=unit;
    //         createLine(x,y,orient,false);
    //         if(Math.floor(shapeYLimit) >= Math.floor(20*unit)){
    //             clearInterval(interval);
    //         }
            
    //     },1000); 
    // }
    let shape = new Line();
    const yFilled = [0,0,0,0,0,0,0,0,0,0]
    function startMoving(){
        const yAvail = (20*unit-shape.yLimit)/unit;
        const x = (shape.x)/unit;
        if(shape.orient === 1){
            if(yFilled[x] === yAvail){
                shape.stop = true;
            }
        }
        else{
            if(yFilled[x] === yAvail || yFilled[x+1] === yAvail || yFilled[x + 2] === yAvail){
                shape.stop = true;
            }
        }
        console.log(typeof(yFilled[0]));
        if(shape.stop || shape.yLimit === height){
            if(shape.orient === 1){
                yFilled[x] +=3;
            }
            else{
                yFilled[x] +=1;
                yFilled[x+1] +=1;
                yFilled[x+2] +=1;
            }
            shape = new Line();
        }
        
        if(shape.y >= 0){
            shape.erase = true;
            shape.draw();
        }
        shape.y += unit;
        shape.erase = false;
        shape.draw();
    }
    setInterval(startMoving,500);
    
    window.addEventListener("keydown",moveHorizontal);
    function moveHorizontal(e){
        
        if(shape.yLimit < height){
            if(e.key === "ArrowLeft"){
                if(shape.x>0){
                    // clearInterval(interval);
                    // interval = null;

                    // createLine(x,y,orient,true);
                    // x = x-unit;
                    // createLine(x,y,orient,false);

                    shape.erase = true;
                    shape.draw();
                    shape.x -= unit;
                    shape.erase = false;
                    shape.draw();

                    //startMoving();
                }
            }
            else{
                if(shape.xLimit<width){
                    // createLine(x,y,orient,true);
                    // x = x+unit;
                    // createLine(x,y,orient,false);
                    shape.erase = true;
                    shape.draw();
                    shape.x += unit;
                    shape.erase = false;
                    shape.draw();
                }
            }
        }
    }
    
    document.addEventListener("click",rotate);

    function rotate(){
        let isRotable = false;
        
        if(shape.orient === 1 && (shape.xLimit < width-unit)){
            isRotable = true;
        }
        if(shape.orient === 2 && (shape.yLimit < height-unit)){
            isRotable = true;
        }
        if(shape.yLimit < height && isRotable){
            // createLine(x,y,orient,true);
            // orient = (orient === 1)?2:1;
            // createLine(x,y,orient,false);
            shape.erase = true;
            shape.draw();
            shape.orient = (shape.orient === 1)?2:1;
            shape.erase = false;
            shape.draw();
        }
    }
});