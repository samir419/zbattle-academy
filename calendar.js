class Calendar{
	constructor(){
		this.event_handler
		this.time={day:0,hour:0}
		this.event_list=[
			{name:'1000z prize junior tournament',location:'arena',start_day:4,end_day:4,start_time:1200,end_time:1700,
				event_data:{
					type:'tournament',
					reward:1000,
					item_rewards:[{name:'junior trophy',quantity:1,price:300}],
					opponents:[
						{name:'level 1',health:500,moves:['Force Field','Repair',],level:1,type:'cpu',img:'battle engine/assets/profiles/aisha.jpg'},
				    	{name:'level 2',health:600,moves:['Force Field','Attack Up'],level:2,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 3',health:700,moves:['Repair','Attack Up',],level:3,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 4',health:800,moves:['Force Field','Repair','Speed Bullet',],level:4,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
			    	]
				}
			},
			{name:'2000z prize senior tournament',location:'arena',start_day:10,end_day:10,start_time:1200,end_time:1700,
				event_data:{
					type:'tournament',
					reward:1000,
					item_rewards:[{name:'senior trophy',quantity:1,price:700}],
					opponents:[
						{name:'level 5',health:900,moves:['Mirror Match','Speed Bullet','Blaze'],level:5,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 6',health:1000,moves:['Heal','Force Field','Attack Up','Speed Bullet',],level:6,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 7',health:1100,moves:['Heal','Power Up','Repair','Speed Bullet',],level:7,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 8',health:1200,moves:['Strike','Force Field','Repair','Gallant Bastion',],level:8,type:'cpu',img:'battle engine/assets/profiles/blake.jpg'},
				    	{name:'level 9',health:1300,moves:['Strike','Heal','Force Field','Power Up','Repair',],level:9,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
					]
				}
			},
			{name:'1000z prize junior tournament',location:'arena',start_day:15,end_day:15,start_time:1200,end_time:1700,
				event_data:{
					type:'tournament',
					reward:1000,
					item_rewards:[{name:'junior trophy',quantity:1,price:300}],
					opponents:[
						{name:'level 1',health:500,moves:['Force Field','Repair',],level:1,type:'cpu',img:'battle engine/assets/profiles/aisha.jpg'},
				    	{name:'level 2',health:600,moves:['Force Field','Attack Up'],level:2,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 3',health:700,moves:['Repair','Attack Up',],level:3,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 4',health:800,moves:['Force Field','Repair','Speed Bullet',],level:4,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'level 5',health:900,moves:['Mirror Match','Speed Bullet','Blaze'],level:5,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
					]
				}
			},
			{name:'grand tourney',location:'arena',start_day:20,end_day:20,start_time:1200,end_time:1700,
				event_data:{
					type:'tournament',
					reward:10000,
					item_rewards:[{name:'grand trophy',quantity:1,price:1000}],
					opponents:[
						{name:'random'},
						{name:'random'},
						{name:'random'},
						{name:'random'},
						{name:'random'},
						{name:'random'},
						{name:'random'},
						{name:'random'},
						{name:'random'},
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
		document.getElementById('date-time').innerHTML=`day: ${this.time.day} \n time: ${this.time.hour}`
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