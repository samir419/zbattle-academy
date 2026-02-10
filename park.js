class Park{
	constructor(elem){
		this.elem = elem
		this.event_handler

		this.tabButtons = document.getElementById('park-tab-buttons').children

		this.sections = [
			document.getElementById('tennis-game'),
		]

		this.tabButtons[0].onclick =()=>{
			this.switch_tab('tennis-game')
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
			let data = JSON.parse(localStorage.getItem('zbattle academy data'))
			data.money+=100
        	this.event_handler.broadcast({message:'save data',data:data})
        	alert('you won')
	        this.event_handler.broadcast({message:'time foward',hour:200})
		}
		if(data.message=='player loose tennis'){
			alert('you lost')
			let data = JSON.parse(localStorage.getItem('zbattle academy data'))
			data.money-=50
        	this.event_handler.broadcast({message:'save data',data:data})
	        this.event_handler.broadcast({message:'time foward',hour:200})
		}
	}
}