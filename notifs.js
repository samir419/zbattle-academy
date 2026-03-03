class Notif{
	constructor(){
		this.event_handler
		this.elem = document.getElementById('notifs')
		this.btn = document.getElementById('notif-button')
		this.notifs = []
	}
	set_notifs(){
		let num =0
		for(let i=0;i<this.notifs.length;i++){
			if(this.notifs[i].read==false){
				num++
			}
		}
		if(num>0){
			this.btn.textContent=`notifs (${num})`
		}else{
			this.btn.textContent=`notifs`
		}
	}
	
	handle_event(data){
		if(data.message=='open notifs'){
        	this.elem.style.display='flex'
        	for(let i=0;i<this.notifs.length;i++){
				this.notifs[i].read=true
			}
			this.set_notifs()
        }
        if(data.message=='set notif'){
        	this.elem.innerHTML+=data.elem
        	this.notifs.push({
        		msg:data.elem,
        		read:false
        	})
        	this.set_notifs()
        }
	}
}