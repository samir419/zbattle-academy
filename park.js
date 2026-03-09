class Park{
	constructor(elem){
		this.elem = elem
		this.event_handler
		this.resident
		this.tabButtons = document.getElementById('park-tab-buttons').children
		
		this.sections = [
			document.getElementById('tennis-game'),
			document.getElementById('obstacle-race'),
			document.getElementById('bench'),
			document.getElementById('music-game')
		]

		this.tabButtons[0].onclick =()=>{
			this.switch_tab('tennis-game')
		}
		this.tabButtons[1].onclick =()=>{
			this.switch_tab('obstacle-race')
		}
		this.tabButtons[2].onclick =()=>{
			this.switch_tab('bench')
			set_character(this.resident,this.event_handler,
				document.getElementById("park-controls"),
				document.getElementById("park-char-dialogue"),
				document.getElementById("park-char-img")
			)
		}
		this.tabButtons[3].onclick =()=>{
			this.switch_tab('music-game')
		}
		this.switch_tab('tennis-game')
	}
	
	switch_tab(tab){
		this.sections.forEach(section=>{
			section.style.display='none'
			if(section.id==tab){
				section.style.display='flex'
			}
		})
	}
	handleOnSwitch(){
	}
	
	handle_event(data){
		if(data.message=='tab switch'&&data.tab==this.elem.id){
			this.handleOnSwitch()
		}
		if(data.message=='player win tennis'){
			let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
			player_data.money+=100
        	this.event_handler.broadcast({message:'save data',data:player_data})
        	this.event_handler.set_message({
        		text:'you won',canClose:true,options:[]
        	})
	        this.event_handler.broadcast({message:'time foward',hour:200})
		}
		if(data.message=='player loose tennis'){
			this.event_handler.set_message({text:'you lost',canClose:true,options:[]})
			let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
			player_data.money-=50
        	this.event_handler.broadcast({message:'save data',data:player_data})
	        this.event_handler.broadcast({message:'time foward',hour:200})
		}
		if(data.message=='player loose obstacle race'){
			let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
			player_data.money+=data.coins
        	this.event_handler.broadcast({message:'save data',data:player_data})
	        this.event_handler.broadcast({message:'time foward',hour:200})
		}
		if(data.message=='player loose music game'){
			let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
			player_data.money+=data.coins
        	this.event_handler.broadcast({message:'save data',data:player_data})
		}
		
		if(data.tab=='park'){
        	if(data.event_data){}
        }
	}
	
}

