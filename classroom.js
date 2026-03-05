class Classroom{
	constructor(elem){
		this.elem = elem
		this.event_handler
		this.resident
		this.tabButtons = document.getElementById('class-tab-buttons').children
		this.sections = [
			document.getElementById("classroom-hangout"),
			document.getElementById("classroom"),
		]
		this.tabButtons[0].onclick =()=>{
			this.switch_tab("classroom-hangout")
			this.set_character('rico')
		}
		this.tabButtons[1].onclick =()=>{
			this.switch_tab("classroom")
		}
		this.switch_tab("classroom-hangout")
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
		set_character(this.resident,this.event_handler,
			document.getElementById("class-controls"),
			document.getElementById("class-char-dialogue"),
			document.getElementById("class-char-img")
		)
	}
	
	handle_event(data){
		if(data.message=='tab switch'&&data.tab==this.elem.id){
			this.handleOnSwitch()
		}
	}
	
}