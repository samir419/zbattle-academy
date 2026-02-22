
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
	    	{name:'peapsqueak',moves:['Repair','Strike','Attack Up'],level:1,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
	    	{name:'aisha',health:1000,moves:['Strike','Repair','Heal','Replenish' ],type:'cpu',level:3, img:'battle engine/assets/profiles/aisha.jpg'},
	    	{name:'blake',health:1300,moves:['Strike','Repair','Shield Strike','Force Field' ],type:'cpu',level:4, img:'battle engine/assets/profiles/blake.jpg'},
	    	{name:'pumkin',moves:['Replenish','Demon Charge','Baneful Binding', 'Repair','Attack Up','Malevonent Armor',],type:'cpu',level:10, img:'battle engine/assets/profiles/pumkin.jpg'},
	    	{name:'quetzie',health:1500,moves:['Strike','Blast Cannon','Baneful Binding','Power Up','Covenant of Carnage','fusion xyz', ],type:'cpu',level:1, img:'battle engine/assets/profiles/quetzie.jpg'},
	    	{name:'red',health:1500,moves:['Strike','Repair','Beast Mode','Power Up','Attack Up', 'Demon Charge',],type:'cpu',level:1, img:'battle engine/assets/profiles/red.jpg'},
	    ]

	    this.selected_opponents=[]
	    this.selected_allies=[]

	    this.temp_storage={}

	}
	init(game){
		this.game=game
		this.render_opponent_select()
		this.render_movesets()
	}
	render_movesets(){
		document.getElementById('arena-moveset-list').innerHTML=''
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		data.movesets.forEach(moveset=>{
			let div = document.createElement('div')
			for(let i=0;i<moveset.length;i++){
				let mv = document.createElement('span')
				mv.textContent=moveset[i]
				div.appendChild(mv)
			}
			let play = document.createElement('button');play.textContent='play';play.className="btn primary-bg"
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
			let btn = document.createElement('button');btn.className="btn primary-bg"
			let requit = document.createElement('button');requit.className="btn primary-bg"
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
		let match_data = {players:[]}
	    match_data.format='teams'
	    let data = JSON.parse(localStorage.getItem('zbattle academy data'))
	    match_data.players.push({name:data.name,moves:this.selected_set,type:'player',team:'player', img:img_list[Math.floor(Math.random() * img_list.length)]})

	    for(let i=0;i<this.selected_allies.length;i++){
	    	this.selected_allies[i].team='player'
	    	let cpu = this.selected_allies[i]
		    if(cpu.moves.length==0){
		    	let availableMoves = [...zbattle_moves];
			    for (let i = 0; i < 6 && availableMoves.length > 0; i++) {
			        const index = Math.floor(Math.random() * availableMoves.length);
			        const new_move = availableMoves.splice(index, 1)[0]; // remove it
			        cpu.moves.push(new_move);
			    }
		    }
		    match_data.players.push(cpu)
	    }
	    
	    for(let i=0;i<this.selected_opponents.length;i++){
		   	this.selected_opponents[i].team='opponent'
	    	let cpu = this.selected_opponents[i]
		    if(cpu.moves.length==0){
		    	let availableMoves = [...zbattle_moves];
			    for (let i = 0; i < 6 && availableMoves.length > 0; i++) {
			        const index = Math.floor(Math.random() * availableMoves.length);
			        const new_move = availableMoves.splice(index, 1)[0]; // remove it
			        cpu.moves.push(new_move);
			    }
		    }
		    match_data.players.push(cpu)
	    }

    	game.apply_data(match_data)
    	this.update_ui(game)
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
			let remove = document.createElement('button');remove.className="btn primary-bg"
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
			let remove = document.createElement('button');remove.className="btn primary-bg"
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
	update_ui(game) {
        let data = game.get_game_data()
        document.getElementById('game-ui').innerHTML=''
        let main_div=document.createElement('div');main_div.className='flex full column outline'
        let log_info = document.createElement('div');log_info.className='flex column scrollable-y neutral-bg outline';
        log_info.style.minHeight = '100px'
        log_info.style.maxHeight = '100px'
        log_info.style.marginLeft = '10%'
        log_info.style.marginRight = '10%'
        log_info.style.width = '80%'
        let start = this.temp_storage.list_length ? this.temp_storage.list_length : 0;
		for (let i = start; i < data.log_data.length; i++) {
		    setTimeout(() => {
		        let msg = document.createElement('p');
		        msg.textContent = data.log_data[i];
		        log_info.appendChild(msg);
		        log_info.scrollTop = log_info.scrollHeight;
		    }, 1000 * (i - start));
		}
        this.temp_storage.list_length = data.log_data.length
        let opp_div = document.createElement('div');opp_div.className='flex center row full-width'
        let player_div = document.createElement('div');player_div.className='flex center row full-width'
        data.players.forEach(player=>{
        	if(player.type=='cpu'&&player.team!='player'){
        		let p_div = document.createElement('div');p_div.className='flex row center outline scrollable-y';
        		p_div.style.maxHeight = '200px'
        		let info_div=document.createElement('div');info_div.className='flex column'
        		let image = document.createElement('img'); image.className = 'player-image'; image.src = player.img
        		let name = document.createElement('h3');name.textContent=player.name
	            let health = document.createElement('div'); health.className = 'player-health'
	            for (let i = 0; i < player.health; i += 100) {
	                let healthbar = document.createElement('div')
	                healthbar.className = 'health-bar'
	                health.appendChild(healthbar)
	            }
	            info_div.append(name,health)
	            p_div.append(image,info_div)
	            opp_div.append(p_div)
        	}
        	if(player.type=='player'||player.team=='player'){
        		let p_div = document.createElement('div');p_div.className='flex row center outline scrollable-y';
        		p_div.style.maxHeight = '200px'
        		p_div.style.alignItems = 'flex-start'
        		let info_div=document.createElement('div');info_div.className='flex column'
        		let image = document.createElement('img'); image.className = 'player-image'; image.src = player.img
        		let name = document.createElement('h3');name.textContent=player.name
	            let health = document.createElement('div'); health.className = 'player-health'
	            for (let i = 0; i < player.health; i += 100) {
	                let healthbar = document.createElement('div')
	                healthbar.className = 'health-bar'
	                health.appendChild(healthbar)
	            }
	            let move_prompt = document.createElement('div'); move_prompt.className = 'move-prompt'
	            let moves = document.createElement('div');moves.className='flex row wrappable'
	            let normal_moves = document.createElement('div')
            	for (let i = 0; i < player.moves.length; i++) {
                    let btn = document.createElement('button'); btn.className = 'move-btn'
                    let m = player.moves[i]
                    let image = document.createElement('img');image.className='move-img'
                    image.src = `battle engine/assets/moves/${m.img}`
                    btn.appendChild(image)
                    let txt = document.createElement('span')
                    txt.textContent=m.name
                    if(m.durability<=0){btn.enabled=false;btn.disabled=true}
                    btn.onclick = () => {
                        move_prompt.innerHTML = `${m.name}`
                        data.players.forEach(p => {
                            let btn = document.createElement('button');btn.className='secondary btn primary-bg'
                            if (p.team == player.team && p.team != 'none') {
                                btn.style.backgroundColor = 'blue'
                            }
                            btn.textContent = p.name
                            btn.onclick = () => {
                            	if(m.prompt_data.type=='player move select'){
                            		move_prompt.innerHTML = `${m.prompt_data.message}`
                            		for(let i=0;i<player.moves.length;i++){
                            			let prompt_btn = document.createElement('button');btn.className='secondary'
			                         
			                            prompt_btn.textContent = player.moves[i].name
			                            prompt_btn.onclick=()=>{
			                            	game.handle_request({type:'play',user:player.name,target:p.name,move:m.name,prompt_info:{selected_value:i}})
			                            	prompt.innerHTML=``;
                            				setTimeout(() => {this.update_ui(game)}, 1000);
			                            }
			                            move_prompt.appendChild(prompt_btn)
                            		}
                            	}if(m.prompt_data.type=='player move select multiple'){
                            		move_prompt.innerHTML = `${m.prompt_data.message}`
                            		let selected_values = []
                            		let amount = 0
                            		for(let i=0;i<player.moves.length;i++){
                            			let prompt_btn = document.createElement('button');btn.className='secondary btn primary-bg'
			                            prompt_btn.textContent = player.moves[i].name
			                            prompt_btn.onclick=()=>{
			                            	prompt_btn.enabled=false;prompt_btn.disabled=true
			                            	amount+=1
			                            	selected_values.push(i)
			                            	if(amount==m.prompt_data.amount){
			                            		game.handle_request({type:'play',user:player.name,target:p.name,move:m.name,prompt_info:{selected_values:selected_values}})
				                            	prompt.innerHTML=``;
			                    				setTimeout(() => {this.update_ui(game)}, 500);
			                            	}
			                            }
			                            move_prompt.appendChild(prompt_btn)
                            		}
                            		
                            	}else{
                            		game.handle_request({type:'play',user:player.name,target:p.name,move:m.name,prompt_info:{prompt:'none'}})
                            		prompt.innerHTML=``;
                            		setTimeout(() => {this.update_ui(game)}, 500);
                            	}
                            }
                            move_prompt.appendChild(btn)
                        })

                    }
                    btn.title  = `name:${m.name}`
                    if (i > 1) {
                        moves.appendChild(btn)
                    } else {
                        btn.className = 'normal-btn btn primary-bg'
                        btn.removeChild(btn.children[0])
                        btn.appendChild(txt)
                        normal_moves.appendChild(btn)
                    }

                }
	            info_div.append(name,health,move_prompt,moves,normal_moves)
	            p_div.append(image,info_div)
	            player_div.append(p_div)
        	}
        })
        main_div.append(opp_div,log_info,player_div)
        document.getElementById('game-ui').append(main_div)
        return
        data.players.forEach(play=>{
            let div = document.createElement('div'); div.className = 'player-div'; div.id = play.name
            let image = document.createElement('img'); image.className = 'player-image'; image.src = play.img
            let health = document.createElement('div'); health.className = 'player-health'
            for (let i = 0; i < play.health; i += 100) {
                let healthbar = document.createElement('div')
                healthbar.className = 'health-bar'
                health.appendChild(healthbar)
            }
            let status = document.createElement('div'); status.className = 'player-status'
            status.innerHTML = `<div>name:${play.name}</div>
                            <div>health:${play.health}</div> 
                            <div>status effects: ${play.status_effects.join(', ')}</div> 
                            <div>last move used: ${play.lastmoveused}</div> 
                            <div>last damage received: ${play.lastDamageReceived}</div> 
                            <div>team: ${play.team}</div>`
            let move_prompt = document.createElement('div'); move_prompt.className = 'move-prompt'
            let moves = document.createElement('div'); moves.className = 'move-div';
            let normals = document.createElement('div'); normals.className = 'normal-moves'
            if (play.type == 'player'||play.team=='boss') {
                for (let i = 0; i < play.moves.length; i++) {
                    let btn = document.createElement('button'); btn.className = 'move-btn btn'
                    let m = play.moves[i]
                    let image = document.createElement('img');image.className='move-img'
                    image.src = `battle engine/assets/moves/${m.img}`
                    btn.appendChild(image)
                    let txt = document.createElement('span')
                    txt.textContent=m.name
                    //btn.appendChild(txt)
                    btn.onclick = () => {
                        move_prompt.innerHTML = `${m.name}`
                        data.players.forEach(p => {
                            let btn = document.createElement('button');btn.className='secondary btn'
                            if (p.team == play.team && p.team != 'none') {
                                btn.style.backgroundColor = 'blue'
                            }
                            btn.textContent = p.name
                            btn.onclick = () => {
                            	console.log(game.handle_request({type:'play',user:play.name,target:p.name,move:m.name}));
                            	prompt.innerHTML=``;
                            	this.update_ui(game);
                            	setTimeout(() => {this.update_ui(game)}, 500);
                            }
                            move_prompt.appendChild(btn)
                        })

                    }
                    m.elem = btn
                    m.elem.title  = `name:${m.name}`
                    if (i > 1) {
                        moves.appendChild(btn)
                    } else {
                        btn.className = 'normal-btn btn'
                        btn.removeChild(btn.children[0])
                        btn.appendChild(txt)
                        normals.appendChild(btn)
                    }

                }
            }
            let profile_info = document.createElement('div'); profile_info.className = 'profile-info'
            profile_info.append(image, status)
            if(play.team=='boss'){div.className+=' boss-div'}
            div.append(profile_info, health, move_prompt, normals, moves)
            document.getElementById('game-ui').appendChild(div)
        })
        document.getElementById('game-log').innerHTML=''
        data.log_data.forEach(mesg=>{
            let msg = document.createElement('p')
            msg.textContent = mesg
            document.getElementById('game-log').appendChild(msg);
            document.getElementById('game-log').scrollTop = document.getElementById('game-log').scrollHeight;
        })
        let quit = document.createElement('button');quit.className="btn primary-bg"
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
        main_div.append(quit)
    }

	handle_event(data){
		if(data.message=='player victory'||data.message=='team victory'){
            let dt = JSON.parse(localStorage.getItem('zbattle academy data'))
            if(data.name==dt.name||data.name == 'player'){
            	for(let i=0;i<this.selected_opponents.length;i++){
            		dt.level+=Math.ceil(this.selected_opponents[i].level / 5)
            		dt.money+=this.selected_opponents[i].level*25
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
        this.render_movesets()
	}
}