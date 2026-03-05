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
						{name:'peapsqueak',health:500,moves:['Repair','Strike','Attack Up'],level:1,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
						{name:'monkey man',health:700,moves:['Eternal Echo','Speed Bullet','Power Up','Guard Breaker'],level:2,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'nero',health:800,level:2,moves:['Strike','Blast Cannon','Heal','Power Up'],type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'rico',health:1000,level:2,moves:['Strike','Repair','Heal','Force Field'],type:'cpu',img:'chars/rico/thumbnail.png'},
				    	{name:'zawa rudo',health:1200,moves:['Repair','Strike','Speed Bullet','Blast Cannon'],level:3,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
					]
				}
			},
			{name:'2000z prize senior tournament',location:'arena',start_day:10,end_day:10,start_time:1200,end_time:1700,
				event_data:{
					type:'tournament',
					reward:1000,
					item_rewards:[{name:'senior trophy',quantity:1,price:700}],
					opponents:[
						{name:'chazz princeton',health:1400,level:5,moves:['Shadow Ball','Repair','Crimson Overdrive','Eternal Echo','Angel Guard'],type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
						{name:'random'},
				    	{name:'pumkin',moves:['Replenish','Devils Imprecation','Baneful Binding', 'Repair','Phantom Domain','Malevonent Armor',],type:'cpu',level:6, img:'battle engine/assets/profiles/pumkin.jpg'},
				    	{name:'quetzie',health:1500,moves:['Strike','Blast Cannon','Mirror Match','Power Up','Covenant of Carnage','fusion xyz', ],type:'cpu',level:8, img:'battle engine/assets/profiles/quetzie.jpg'},
				    	{name:'random'},
				    	{name:'red',health:1500,moves:['Strike','Repair','Beast Mode','Power Up','Attack Up', 'Demon Charge',],type:'cpu',level:10, img:'battle engine/assets/profiles/red.jpg'},
					]
				}
			},
			{name:'1000z prize junior tournament',location:'arena',start_day:15,end_day:15,start_time:1200,end_time:1700,
				event_data:{
					type:'tournament',
					reward:1000,
					item_rewards:[{name:'junior trophy',quantity:1,price:300}],
					opponents:[
						{name:'peapsqueak',health:500,moves:['Repair','Strike','Attack Up'],level:1,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
						{name:'monkey man',health:700,moves:['Eternal Echo','Speed Bullet','Power Up','Guard Breaker'],level:2,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'nero',health:800,level:2,moves:['Strike','Blast Cannon','Heal','Power Up'],type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
				    	{name:'rico',health:1000,level:2,moves:['Strike','Repair','Heal','Force Field'],type:'cpu',img:'chars/rico/thumbnail.png'},
				    	{name:'zawa rudo',health:1200,moves:['Repair','Strike','Speed Bullet','Blast Cannon'],level:3,type:'cpu',img:'battle engine/assets/ZBATTLELOGO.png'},
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