class Calendar{
	constructor(){
		this.event_handler
		this.time={day:0,hour:0}
		this.event_list=[
			{name:'500z prize tournament',location:'arena',start_day:0,end_day:4,start_time:500,end_time:1700,
				event_data:{
					type:'tournament',
					reward:500,
					item_rewards:[{name:'trophy',quantity:1,price:1000}],
					opponents:[
						{name:'peapsqueak',health:500,moves:['Repair','Strike','Attack Up'],level:1,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
						{name:'random'}
					]
				}
			},
			
		]
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
			let data = JSON.parse(localStorage.getItem('zbattle academy data'))
			let list = this.event_list
			for(let i=0;i<list.length;i++){
				if(data.time.day==list[i].start_day&&data.time.hour==list[i].start_time){
					event_handler.broadcast({
						message:'set notif',
						elem:`<p class='center'>${list[i].name} event at ${list[i].location} (check calendar)</P>`
					})
				}
			}
		}
		if(data.message=='time foward'){
			this.time_foward(data.hour)
		}
		if(data.message=='get event list'){
			this.event_handler.broadcast({message:'event list', data:this.event_list})
		}
	}
}