class Music_game{
	constructor(){
		this.event_handler
		this.canvas = document.getElementById('music-game-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 280
		this.canvas.height = 444
		this.state='pause'
		this.lastTime = 0;
		this.update = this.update.bind(this);
		this.objects=[]
		this.lines = []
		this.keys={}
		this.score=0
		this.energy=20
		document.addEventListener("keydown", e => this.keys[e.key] = true);
		document.addEventListener("keyup", e => this.keys[e.key] = false);

		document.getElementById('music-game-h')
		  .addEventListener("click", (e) => {
		    //e.preventDefault();
		    this.check_collision(this.lines[0])
		});

		document.getElementById('music-game-j')
		  .addEventListener("click", (e) => {
		    //e.preventDefault();
		   this.check_collision(this.lines[1])
		});

		document.getElementById('music-game-k')
		  .addEventListener("click", (e) => {
		    //e.preventDefault();
		    this.check_collision(this.lines[2])
		});

		document.getElementById('music-game-l')
		  .addEventListener("click", (e) => {
		    //e.preventDefault();
		    this.check_collision(this.lines[3])
		});
	  	
	}
	restart(){
		this.score=0
		this.event_handler.broadcast({message:'player loose music game',coins:this.energy})
		this.init()
	}
	init(){
		this.energy=20
		function draw(game,obj){
			game.ctx.fillStyle = obj.color;
        	game.ctx.fillRect(obj.x,obj.y,obj.w,obj.h)
		}
		function respawn(game,index,arg){
			if(this.memory.isclicked){
				game.energy+=1
				this.memory.isclicked=false
        		this.color="rgb(200,100,100)"
			}else{
				game.energy-=3
				if(game.energy<0){
					game.restart()
				}
			}
			this.y = -128
			document.getElementById('music-game-health').textContent=`energy:${game.energy}`
		}
		function generate_data(len, data){
		    for(let i = 0; i < len; i++){

		        let group = [0,0,0,0]

		        // decide if we place 1 or 2 ones
		        let ones = Math.random() < 0.1 ? 2 : 1

		        let used = []

		        while(used.length < ones){
		            let r = Math.floor(Math.random()*4)
		            if(!used.includes(r)){
		                used.push(r)
		                group[r] = 1
		            }
		        }

		        data.push(...group)
		    }

		    return data
		}
		let data = [
			0,1,0,0,
			0,0,1,0,
			0,0,0,0,
			1,0,0,0,
			0,0,0,0,
			0,1,1,0,
			0,0,0,1,
			0,0,0,0,
			0,0,1,0,
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1,
			0,0,0,1,
			1,0,0,0,
			0,0,1,0,

		]
		data = [
			0,1,0,0,
			0,0,1,0,
			0,0,1,0,
			1,0,0,0,
			0,1,0,0,
			0,1,1,0,
		]
		data=[]
		data = generate_data(12,data)
		this.objects=[]
		let col =0
		let row =0
		for(let i=0;i<data.length;i++){
			if(data[i]==1){
				let obj = {x:row,y:-col,w:64,h:64,color:"rgb(200,100,100)",draw:draw,respawn:respawn,memory:{position:{x:row,y:col-444}}}
				this.objects.push(obj)
			}
			row+=72
			if(row==72*4){
				row=0
				col+=72
			}
		}
		this.lines = [
			{x:0,y:400,w:280/4,h:16,color:"rgb(230,230,100)",draw:draw,memory:{}},
			{x:280/4,y:400,w:280/4,h:16,color:"rgb(230,100,230)",draw:draw,memory:{}},
			{x:(280/4)*2,y:400,w:280/4,h:16,color:"rgb(100,230,230)",draw:draw,memory:{}},
			{x:(280/4)*3,y:400,w:280/4,h:16,color:"rgb(230,230,100)",draw:draw,memory:{}}
		]
		this.render();
		this.state='running'
		requestAnimationFrame(this.update);
	}
	update(timeStamp){
		let dt = (timeStamp - this.lastTime) / 1000;
    	this.lastTime = timeStamp;

		if(this.state=='running'){
			if (this.keys["h"]) this.check_collision;
	  		if (this.keys["j"]) this.check_collision;
	  		if (this.keys["k"]) this.check_collision;
	  		if (this.keys["l"]) this.check_collision;
			for(let i=0; i<this.objects.length;i++){
	    		this.objects[i].y+=100*dt
	    		if(this.objects[i].y>=444){
	    			this.objects[i].respawn(this,i,{})
	    		}
	    	}
			this.render();
		}
		requestAnimationFrame(this.update);
	}
	render(){
		let ctx = this.ctx
		let canvas = this.canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(10, 10, 40)";
        ctx.fillRect(0,0,canvas.width,canvas.height)
        for(let i=0; i<this.objects.length;i++){
    		this.objects[i].draw(this,this.objects[i])
    	}
    	 for(let i=0; i<this.lines.length;i++){
    		this.lines[i].draw(this,this.lines[i])
    	}
	}
	pause(){
		if(this.state=='running'){
			this.state='pause'
		}else if(this.state=='pause'){
			this.state='running'
			requestAnimationFrame(this.update);
		}
	}
	check_collision(line){
	    for(let i = 0; i < this.objects.length; i++){
	        let obj = this.objects[i]

	        if(
	            obj.x < line.x + line.w &&
	            obj.x + obj.w > line.x &&
	            obj.y < line.y + line.h &&
	            obj.y + obj.h > line.y
	        ){
	            this.objects[i].memory.isclicked=true
	        	this.objects[i].color="rgb(100,230,100)"
	        	this.score++
	        	if(this.score%50==0){
	        		this.event_handler.broadcast({message:'time foward',hour:100})
	        		this.init()
	        	}
	        	document.getElementById('music-game-score').textContent=`score:${this.score}`
	        }
	    }
	}
	handle_event(data){}
}