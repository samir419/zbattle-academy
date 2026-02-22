class Map{
	constructor(elem){
		this.elem = elem
		this.event_handler
		this.locations = document.getElementById('locations')
		//this.locations.children[0].onclick=()=>{this.event_handler.broadcast({message:'switch',tab:'dorm'})}
	}
	display(){
		let fullscreen = document.createElement('button')
		fullscreen.textContent='fullscreen'
		fullscreen.onclick=()=>{document.getElementById('main').requestFullscreen()}
		this.elem.appendChild(fullscreen)
		let switch_ = document.createElement('button')
		switch_.textContent='switch'
		switch_.onclick=()=>{switch_tab('tab2')}
		this.elem.appendChild(switch_)
	}
	handle_event(){}
}
