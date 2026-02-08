class Event_handler{
	constructor(){
		this.subscribers = []
	}
	add_subscriber(ent){
		ent.event_handler=this
		this.subscribers.push(ent)
	}
	emit_event(data){
		this.subscribers.forEach(sub=>{
			sub.handle_event(data)
		})
	}
}