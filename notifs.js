class Notif{
	constructor(){
		this.event_handler
		this.elem = document.getElementById('notifs')
	}
	
	handle_event(data){
		if(data.message=='open notifs'){
        	document.getElementById('notifs').style.display='flex'
        }
	}
}