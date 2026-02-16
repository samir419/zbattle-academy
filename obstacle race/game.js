

class Obstacle_race{
	constructor(){
		this.canvas = document.getElementById('obstacle-game-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 480
		this.canvas.height = 320
		this.event_handler
		this.players=[]
		this.obstacles=[]
		this.powerups=[]
		this.state = 'wait'
		this.keys={}
		this.spawnTimer = 0;
		this.spawnInterval = 60; // frames
		this.coins=0;
		this.scoreDisplay = document.getElementById("obstacle-game-score");
		this.score = 0;

		this.lastTime = 0;
		this.update = this.update.bind(this);
		document.addEventListener("keydown", e => this.keys[e.key] = true);
		document.addEventListener("keyup", e => this.keys[e.key] = false);

		document.getElementById('obstacle-game-left')
		  .addEventListener("touchstart", (e) => {
		    e.preventDefault();
		    this.keys["a"] = true;
		});

		document.getElementById('obstacle-game-left')
		  .addEventListener("touchend", (e) => {
		    e.preventDefault();
		    this.keys["a"] = false;
		});

		document.getElementById('obstacle-game-right')
		  .addEventListener("touchstart", (e) => {
		    e.preventDefault();
		    this.keys["d"] = true;
		});

		document.getElementById('obstacle-game-right')
		  .addEventListener("touchend", (e) => {
		    e.preventDefault();
		    this.keys["d"] = false;
		});



	}
	init(data){
		data.players.forEach(player=>{
			this.players.push({x:480/2,y:320-32,width:32,height:32,color:'yellow',dx:0,dy:0,state:'normal',speed:200})
		})
		this.state='running'
		requestAnimationFrame(this.update);
	}
	spawnObstacle() {
		let chance = Math.floor(Math.random() * 10)//0to9
		let speed = 200 + this.score * 0.2
	  	if(chance<2){
	  		let chance2 = Math.floor(Math.random() * 10)
	  		if(chance2==9){
	  			this.obstacles.push({
		  			color:'orange',
				    width: 24,
				    height: 24,
				    x: Math.random() * (this.canvas.width - 16),
				    y: -30,
				    speed: speed,
				    onhit:function(game,index){
				    	game.obstacles.splice(index, 1);
				    	game.coins+=10
				    	document.getElementById("obstacle-game-coin-count").textContent='coins: '+game.coins
				    }
				  })
	  		}if(chance2==8){
		  		this.obstacles.push({
			  			color:'green',
					    width: 24,
					    height: 24,
					    x: Math.random() * (this.canvas.width - 16),
					    y: -30,
					    speed: speed,
					    onhit:function(game,index){
					    	game.obstacles.splice(index, 1);
					    	game.powerups.push({frame:1000,bar_color:'green',
					    		update:function(game,index){
					    			if(this.frame==1000){
					    				game.players[0].speed*=2
					    			}
					    			if(game.players[0].speed==200){game.players[0].speed*=2}
					    			this.frame--
					    			if(this.frame<=0){
					    				game.players[0].speed=200
					    				game.powerups.splice(index, 1);
					    			}
					    		}
					    	})
					    }
					  })
		  	}else{
	  			
	  			this.obstacles.push({
		  			color:'yellow',
				    width: 16,
				    height: 16,
				    x: Math.random() * (this.canvas.width - 16),
				    y: -30,
				    speed: speed,
				    onhit:function(game,index){
				    	game.obstacles.splice(index, 1);
				    	game.coins+=1
				    	document.getElementById("obstacle-game-coin-count").textContent='coins: '+game.coins
				    }
				  })
	  		}
	  		
	  	}else{
	  		let width = 16 + Math.random() * 40;
			  this.obstacles.push({
			  	color:'red',
			    width: width,
			    height: 30,
			    x: Math.random() * (this.canvas.width - width),
			    y: -30,
			    speed: speed,
			    onhit:function(game,index){
			    	game.state='pause'
			    	game.event_handler.broadcast({message:'player loose obstacle race',coins:game.coins})
			    	game.coins=0
			    	game.score=0
			    	document.getElementById("obstacle-game-ui").style.display='flex'
			    	document.getElementById("obstacle-game-ui").innerHTML=''
			    	let restart = document.createElement('button');restart.textContent='restart'
			    	restart.onclick=()=>{game.pause();document.getElementById("obstacle-game-ui").style.display='none'}
			    	document.getElementById("obstacle-game-ui").append(restart)
			    }
			  });
	  	}
	  
	}
	
	update(timeStamp){
		if(this.state=='pause'){
			return
		}
		let dt = (timeStamp - this.lastTime) / 1000;
    	this.lastTime = timeStamp;
		
		if (this.keys["a"]) this.players[0].x -= this.players[0].speed*dt;
  		if (this.keys["d"]) this.players[0].x += this.players[0].speed*dt;

  		if (this.players[0].x < 0) this.players[0].x = 0;
		if (this.players[0].x + this.players[0].width > this.canvas.width)
		   this.players[0].x = this.canvas.width - this.players[0].width;

  		// Spawn obstacles
		  this.spawnTimer++;
		  if (this.spawnTimer > this.spawnInterval) {
		  	this.spawnObstacle();
		    this.spawnTimer = 0;
		    if (this.spawnInterval > 30) this.spawnInterval -= 1; // difficulty increase
		  }

		  // Update obstacles
		 
		  for (let i = this.obstacles.length - 1; i >= 0; i--) {
		    let o = this.obstacles[i];
		    o.y += o.speed*dt;
		    if (
			      this.players[0].x+4 < o.x + o.width &&
			      this.players[0].x+4 + this.players[0].width-4 > o.x &&
			      this.players[0].y+4 < o.y + o.height &&
			      this.players[0].y+4 + this.players[0].height-4 > o.y
			    ) {
			      o.onhit(this,i)
			}
		    // Remove off-screen
		    if (o.y > canvas.height) {
		      this.obstacles.splice(i, 1);
		      this.score++;
  			  this.scoreDisplay.textContent = "Score: " + this.score;
		    }
		  }
	  	for(let i=0;i<this.powerups.length;i++){
	  		this.powerups[i].update(this,i)
	  	}
		this.render();
		requestAnimationFrame(this.update);
	}
	render(){
		let ctx = this.ctx
		let canvas = this.canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle='blue'
        ctx.fillRect(0,0,canvas.width,canvas.height)
        for(let i = 0; i<this.players.length; i++){
        	ctx.fillStyle='yellow'
        	ctx.fillRect(this.players[i].x,this.players[i].y,32,32)
        }
        
		 for (let i = this.obstacles.length - 1; i >= 0; i--) {
		    let o = this.obstacles[i];
		    ctx.fillStyle = o.color;
		    ctx.fillRect(o.x, o.y, o.width, o.height);
		 }
		 for (let i = 0; i < this.powerups.length; i++) {
		 	ctx.fillStyle=this.powerups[i].bar_color
		    ctx.fillRect(i*10,10, this.powerups[i].frame/10, 10);
		 }

	}
	pause(){
		if(this.state=='running'){
			this.state='pause'
		}else if(this.state=='pause'){
			this.state='running'
			this.update()
		}

	}
	handle_event(data){

    }

}
let obstacle_game = new Obstacle_race()