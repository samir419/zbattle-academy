class Calendar{
	constructor(){
		this.event_handler
		this.time={day:0,hour:0}
		this.init()
	}
	init(){
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		this.time = data.time
		document.getElementById('date-time').textContent=`day: ${this.time.day} time: ${this.time.hour}`
	}
	time_foward(hour){
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		this.time.hour+=hour
		if(this.time.hour>2400){
			this.time.hour=0
			this.time.day+=1
		}
		data.time=this.time
		this.event_handler.broadcast({message:'save data', data:data})
		document.getElementById('date-time').textContent=`day: ${this.time.day} time: ${this.time.hour}`
	}
	handle_event(data){
		if(data.message=='tab switch'){
			this.time_foward(100)
		}
		if(data.message=='time foward'){
			this.time_foward(data.hour)
		}
	}
}