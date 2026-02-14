
zbattle_moves = [
    'Strike',
    'Replenish',
    'Blast Cannon',
    'Heal',
    'Force Field',
    'Holy Blade',
    'Shield Strike',
    'Demon Charge',
    'Covenant of Carnage',
    'Mirror Match',
    'Power Up',
    'Baneful Binding', 
    'Repair',
    'Attack Up',
    'fusion xyz',
    'Beast Mode',
    'Malevonent Armor',
    'Angel Guard',
]
let img_list = [
    'battle engine/assets/profiles/aisha.jpg',
    'battle engine/assets/profiles/blake.jpg',
    'battle engine/assets/profiles/quetzie.jpg',
    'battle engine/assets/profiles/pumkin.jpg',
    'battle engine/assets/profiles/red.jpg',
    'battle engine/assets/ZBATTLELOGO.png'
]
class Arena{
	constructor(elem){
		this.elem = elem
		this.event_handler

		this.game

		this.opponent_select_screen = document.getElementById('opponent-select')
		this.move_select_screen = document.getElementById('moveset-select')
		this.engine_elem = document.getElementById('engine')

		this.opponent_select_screen.style.display = 'flex'
	    this.move_select_screen.style.display = 'none'
	    this.engine_elem.style.display = 'none'

	    this.selected_set = []

	    this.opponents =[
	    	{name:'cpu',moves:[],level:5,type:'cpu', img:'battle engine/assets/ZBATTLELOGO.png'},
	    	{name:'aisha',health:1000,moves:['Strike','Repair','Heal','Replenish' ],type:'cpu',level:3, img:'battle engine/assets/profiles/aisha.jpg'},
	    	{name:'blake',health:1300,moves:['Strike','Repair','Shield Strike','Force Field' ],type:'cpu',level:4, img:'battle engine/assets/profiles/blake.jpg'},
	    	{name:'pumkin',moves:['Replenish','Demon Charge','Baneful Binding', 'Repair','Attack Up','Malevonent Armor',],type:'cpu',level:10, img:'battle engine/assets/profiles/pumkin.jpg'},
	    	{name:'quetzie',health:1500,moves:['Strike','Blast Cannon','Baneful Binding','Power Up','Covenant of Carnage','fusion xyz', ],type:'cpu',level:1, img:'battle engine/assets/profiles/quetzie.jpg'},
	    	{name:'red',health:1500,moves:['Strike','Repair','Beast Mode','Power Up','Attack Up', 'Demon Charge',],type:'cpu',level:1, img:'battle engine/assets/profiles/red.jpg'},
	    ]

	    this.selected_opponents=[]
	    this.selected_allies=[]

	}
	init(game){
		this.game=game
		this.render_opponent_select()
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		data.movesets.forEach(moveset=>{
			let div = document.createElement('div')
			for(let i=0;i<moveset.length;i++){
				let mv = document.createElement('span')
				mv.textContent=moveset[i]
				div.appendChild(mv)
			}
			let play = document.createElement('button');play.textContent='play'
			play.onclick=()=>{
				this.selected_set = moveset
				this.single_1v1(this.game)
			}
			div.appendChild(play)
			document.getElementById('arena-moveset-list').append(div)
		})
	}
	render_opponent_select(){
		document.getElementById('opponent-list').innerHTML=''
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		for(let i=0;i<this.opponents.length;i++){
			let div = document.createElement('div');div.className='flex column outline'
			let img = document.createElement('img');img.style.width='100px';img.style.height='100px'
			let name = document.createElement('p');name.textContent=this.opponents[i].name
			let btn = document.createElement('button')
			let requit = document.createElement('button')
			img.src = this.opponents[i].img
			if(data.level+5>this.opponents[i].level){
				btn.textContent='challenge '
				btn.onclick=()=>{
					this.selected_opponents.push(this.opponents[i])
					btn.disabled =true
					requit.disabled=true
					this.render_selected_opponent(this.selected_opponents)
				}
			}else{
				btn.textContent=`level ${this.opponents[i].level-4} required`
			}
			if(data.level>=this.opponents[i].level){
				requit.textContent='requit'
				requit.onclick=()=>{
					this.selected_allies.push(this.opponents[i])
					btn.disabled =true
					requit.disabled=true
					this.render_selected_allies(this.selected_opponents)
				}
			}else{
				requit.textContent=`level ${this.opponents[i].level} required`
			}
			div.append(img,name,btn,requit)
			document.getElementById('opponent-list').append(div)
		}
		document.getElementById("commence-battle").onclick=()=>{
			this.opponent_select_screen.style.display = 'none'
		    this.move_select_screen.style.display = 'flex'
		    this.engine_elem.style.display = 'none'
		}
	}
	display(){
		let txt = document.createElement('p')
		txt.textContent='lorem ipsum'
		this.elem.appendChild(txt)
	}
	single_1v1(game){
	    game.format='teams'
	    let data = JSON.parse(localStorage.getItem('zbattle academy data'))
	    let player = game.set_player({name:data.name,moves:this.selected_set,type:'player',team:'player', img:img_list[Math.floor(Math.random() * img_list.length)]})
	    game.players.push(player)

	    for(let i=0;i<this.selected_allies.length;i++){
	    	this.selected_allies[i].team='player'
	    	let cpu = game.set_player(this.selected_allies[i])
		    if(cpu.moves.length==0){
		    	let availableMoves = [...moves];
			    for (let i = 0; i < 6 && availableMoves.length > 0; i++) {
			        const index = Math.floor(Math.random() * availableMoves.length);
			        const new_move = availableMoves.splice(index, 1)[0]; // remove it
			        cpu.add_move(new_move);
			    }
		    }
		    game.players.push(cpu)
	    }
	    
	    for(let i=0;i<this.selected_opponents.length;i++){
	    	this.selected_opponents[i].team='opponent'
	    	let cpu = game.set_player(this.selected_opponents[i])
		    if(cpu.moves.length==0){
		    	let availableMoves = [...moves];
			    for (let i = 0; i < 6 && availableMoves.length > 0; i++) {
			        const index = Math.floor(Math.random() * availableMoves.length);
			        const new_move = availableMoves.splice(index, 1)[0]; // remove it
			        cpu.add_move(new_move);
			    }
		    }
		    game.players.push(cpu)
	    }

	    
	    

	    
	    
	    
    	game.start()
        let quit = document.createElement('button');
        quit.textContent='quit'
        quit.onclick=()=>{
            game.log_data.innerHTML = ''
            game.current_turn = 0
            game.players = []
            game.player_queue = []
            game.set_format() 
            this.selected_opponents=[]
            this.opponent_select_screen.style.display = 'flex'
		    this.move_select_screen.style.display = 'none'
		    this.engine_elem.style.display = 'none'
		    this.reset()
        }
        game.ui.append(quit)
	    this.opponent_select_screen.style.display = 'none'
	    this.move_select_screen.style.display = 'none'
	    this.engine_elem.style.display = 'flex'
	}
	render_selected_opponent(){
		let parent = document.getElementById("selected-opponents")
		parent.innerHTML=''
		console.log(this.selected_opponents)
		for(let i = 0;i<this.selected_opponents.length;i++){
			let div = document.createElement('div');div.className='flex column outline'
			let img = document.createElement('img');img.style.width='100px';img.style.height='100px'
			let remove = document.createElement('button')
			img.src = this.selected_opponents[i].img
			remove.textContent='remove'
			remove.onclick=()=>{
				this.selected_opponents.splice(i,1)
				this.render_selected_opponent()
			}
			div.append(img,remove)
			parent.append(div)
		}
	}
	render_selected_allies(){
		let parent = document.getElementById("selected-allies")
		parent.innerHTML=''
		for(let i = 0;i<this.selected_allies.length;i++){
			let div = document.createElement('div');div.className='flex column outline'
			let img = document.createElement('img');img.style.width='100px';img.style.height='100px'
			let remove = document.createElement('button')
			img.src = this.selected_allies[i].img
			remove.textContent='remove'
			remove.onclick=()=>{
				this.selected_allies.splice(i,1)
				this.render_selected_allies()
			}
			div.append(img,remove)
			parent.append(div)
		}
	}
	reset(){
		this.opponent_select_screen.style.display = 'flex'
	    this.move_select_screen.style.display = 'none'
	    this.engine_elem.style.display = 'none'

		this.selected_opponents=[]
	    this.selected_allies=[]

	    this.render_opponent_select()
	    this.render_selected_allies()
	    this.render_selected_opponent()

	    this.event_handler.broadcast({message:'reset battle'})

	}
	handle_event(data){
		if(data.message=='player victory'||data.message=='team victory'){
            let dt = JSON.parse(localStorage.getItem('zbattle academy data'))
            if(data.name==dt.name||data.name == 'player'){
            	for(let i=0;i<this.selected_opponents.length;i++){
            		dt.money+=100
            	}
            	this.event_handler.broadcast({message:'save data',data:dt})
            	alert('you won')
            	game.log_data.innerHTML = ''
	            game.current_turn = 0
	            game.players = []
	            game.player_queue = []
	            game.set_format() 
	            this.selected_opponents=[]
	            this.opponent_select_screen.style.display = 'flex'
			    this.move_select_screen.style.display = 'none'
			    this.engine_elem.style.display = 'none'
            }else{
	        	alert('you lost')
	        }
	        this.reset()
	        this.event_handler.broadcast({message:'time foward',hour:200})
        }
	}
}