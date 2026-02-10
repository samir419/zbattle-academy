


const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 720
canvas.height = 480
score_point = new Audio()
score_point.src = 'game assets/game-start-317318.mp3'
music = new Audio()
music.loop=true
music.src = 'game assets/game-music-loop-6-144641.mp3'
class Pong_Game{
    constructor(){
        this.players =[
            new Pong_Player(1),
            new Pong_Player(2)
        ]
        //this.players[1].img.src = current_char.ent.pong_sprite
        this.ball = new Ball()
        this.state = 'wait'
        this.input_buffer=0
        this.input_buffer2=0
        this.freezetimer=0
        this.processes = []

        this.background = new Image()
        this.background.src = 'game assets/arena.png'
        this.meterbar = new Image()
        this.meterbar.src = 'game assets/meter bar.png'
        ctx.drawImage(this.background,0,0, canvas.width, canvas.height);
        
        this.event_handler
    }
    start(){
        this.reset()
        this.ball.dx=5
        this.ball.dy=5
        this.state='running'
        //music.play()
        this.update()
    }
    reset(){
        this.players[0].x = 0
        this.players[0].y = 240
        this.players[0].meter = 0
        this.players[0].health = 100
        this.players[1].x = 670
        this.players[1].y = 240
        this.players[1].meter = 0
        this.players[1].health = 100
        this.ball.x = canvas.width/2
        this.ball.y = canvas.height/2
        this.players[0].special_moves=[]
        this.players[1].special_moves=[]
        all_moves.forEach((m,index)=>{
            this.players[1].special_moves.push(m)
            this.players[0].special_moves.push(m)
        })
    }
    handle_freeze_frame(){
        this.freezetimer--
        if(this.freezetimer==0){
            if(this.players[0].health<=0||this.players[1].health<=0){
                this.reset()
            }
            this.state='running'
        }
    }
    get_collision(a,b){
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        )
    }
    handle_input(key){
        if(this.input_buffer>0){
            return
        }
        if(key=='p'){
            if(this.state=='pause'){
                this.state = 'running'
                music.play()
            }else{
                this.state = 'pause'
                music.pause()
            }
        }
        if(key=='f'){
            this.state = 'freezeframe'
            this.freezetimer=20
        }
        if(key=='d'){
            this.players[0].direction=0
            //this.players[0].parry()
        }
        if(key=='q'){
            this.players[0].dash(-1)
        }
        if(key=='e'){
            this.players[0].dash(1)
        }
        if(key=='j'){
            this.players[0].special_moves[0].dp-=1
            let move = this.players[0].special_moves[0] 
            if(move.dp<0){
                console.log('out of dp')
                return
            }
            move.onstart(this.players[0],this.players[1],this)
        }
        if(key=='k'){
            this.players[0].special_moves[1].dp -=1
            let move = this.players[0].special_moves[1] 
            if(move.dp<0){
                console.log('out of dp')
                return
            }
            move.onstart(this.players[0],this.players[1],this)
        }
        if(key=='l'){
            this.players[0].special_moves[2].dp -=1
            let move = this.players[0].special_moves[2] 
            if(move.dp<0){
                console.log('out of dp')
                return
            }
            move.onstart(this.players[0],this.players[1],this)
        }
        if(key=='u'){
            this.players[0].special_moves[3].dp-=1
            let move = this.players[0].special_moves[3] 
            if(move.dp<0){
                console.log('out of dp')
                return
            }
            move.onstart(this.players[0],this.players[1],this)
        }
        this.input_buffer=10
    }
    render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle='black'
        ctx.drawImage(this.background,0,0, canvas.width, canvas.height);
        
        this.processes.forEach(p=>{
            ctx.fillStyle=p.color
            ctx.fillRect(p.x,p.y,p.w,p.h)
        })
        ctx.fillStyle='white'
        if(this.ball.state=='power'){ctx.fillStyle='red'}
        ctx.fillRect(this.ball.x,this.ball.y,this.ball.width,this.ball.height)
        this.players.forEach(function(player,index){
            if(player.isultimate==true){
                ctx.fillStyle='orange'
                ctx.fillRect(player.x-25,player.y-25,player.width+50,player.height+50)
            }
            if(player.state=='parry'){
                    ctx.fillStyle='green'
                ctx.fillRect(player.x-25,player.y-25,player.width+50,player.height+50)
                
            }
            
            ctx.strokeRect(player.x,player.y,player.width,player.height)

            ctx.drawImage(player.get_image(),player.x-35,player.y-35)
        })
        
        
        
        ctx.fillStyle='yellow'
        ctx.fillRect(0,0,this.players[0].health,20)
        ctx.fillRect(720-100,0,this.players[1].health,20)
        ctx.drawImage(this.meterbar,0,0)
        ctx.drawImage(this.meterbar,620,0)
    }
    update(){
        if(this.state=='running'){
            this.players[0].update()
            
            this.players[1].update()
            this.ball.update()
            this.players[1].cpu(this.players[1],this.players[0],this)

            this.processes.forEach((process,index)=>{
                process.update(this)
                if(process.state=='dead'){
                    this.processes.pop(index)
                }
            })
                
            this.players.forEach((player,index)=>{
                if(this.get_collision(this.ball,player)){
                    if(player.isultimate==true){
                        let ultimove = player.ultimatemove
                        if(player==this.players[0]){
                                ultimove.onstart(this.players[0],this.players[1],this)
                        }else{
                            ultimove.onstart(this.players[1],this.players[0],this)
                        }
                        
                    }
                    if(this.ball.state=='normal'||this.ball.state=='power'){
                        this.ball.dx*=-1
                        player.meter+=10
                    
                        if(this.get_collision(this.ball,player.upper_hitbox)){
                            if(this.ball.dy>0){
                                this.ball.dy*=-1
                                this.ball.dy-=player.dy*0.2
                            }
                            if(this.ball.dy==0){
                                this.ball.dy = -5
                            }
                        }
                        if(this.get_collision(this.ball,player.lower_hitbox)){
                            if(this.ball.dy<0){
                                this.ball.dy*=-1
                                this.ball.dy+=player.dy*0.2
                            }
                                if(this.ball.dy==0){
                                this.ball.dy = 5
                            }
                        }
                    }
                    
                    if(player.state=='parry'){
                        if(this.ball.state!='normal'){
                            this.ball.dx*=-1
                        }
                        player.state='idle'
                        this.ball.dx*=2
                        player.meter+=10
                        this.state = 'freezeframe'
                        this.freezetimer=20

                    }
                }
                
            })
            
            
            if(this.ball.x<=0||this.ball.x>=canvas.width){
                let damage = 10
                if(this.ball.state=='power'){
                    damage = 30
                }
                if(this.ball.x<=0){
                    this.players[0].meter+=5
                    this.players[0].health-=damage
                    score_point.play()
                }
                if(this.ball.x>=canvas.width){
                    this.players[1].meter+=5
                    this.players[1].health-=damage
                    score_point.play()
                }
                if(this.ball.state!='normal'){
                    this.ball.state='normal'
                    this.ball.width=25
                    this.ball.height=25
                }
                this.ball.x = canvas.width/2
                this.ball.y = canvas.height/2
                this.ball.dx*=-1
                if(this.ball.dx<0){
                    this.ball.dx=-5
                }else{
                    this.ball.dx=5
                }
                if(this.ball.dy>5){
                    this.ball.dy=5
                }
                if(this.ball.dy<-5){
                    this.ball.dy=-5
                }
            }
            if(this.ball.y<=0||this.ball.y>=canvas.height){
                this.ball.dy*=-1
            }
            this.render()
            if(this.players[0].health<=0||this.players[1].health<=0){
                if(this.players[0].health>0){
                    this.event_handler.broadcast({message:'player win tennis'})
                }else{
                    this.event_handler.broadcast({message:'player loose tennis'})
                }
                this.reset()
                this.state='wait'
            }
             document.getElementById('special1').textContent=`${this.players[0].special_moves[0].name} ${this.players[0].special_moves[0].dp}`
             document.getElementById('special2').textContent=`${this.players[0].special_moves[1].name} ${this.players[0].special_moves[1].dp}`
             document.getElementById('special3').textContent=`${this.players[0].special_moves[2].name} ${this.players[0].special_moves[2].dp}`
             document.getElementById('special4').textContent=`${this.players[0].special_moves[3].name} ${this.players[0].special_moves[3].dp}`
        }
        if(this.state=='freezeframe'){
            this.handle_freeze_frame()
        }
        if(this.state=='wait'){
            
        }
        if(this.input_buffer>0){
            this.input_buffer--
        }
            if(this.input_buffer2>0){
            this.input_buffer2--
        }
        requestAnimationFrame(this.update.bind(this))
    }
    handle_event(data){

    }
}
let ponggame = new Pong_Game()



