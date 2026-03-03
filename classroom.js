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
		this.set_character(this.resident)
	}
	
	handle_event(data){
		if(data.message=='tab switch'&&data.tab==this.elem.id){
			this.handleOnSwitch()
		}
	}
	set_character(char_name){
		document.getElementById("class-controls").innerHTML=''
		let influence_stats = {friendly:0,emotion:0}
		let dt = JSON.parse(localStorage.getItem('zbattle academy data'))
		for(let i=0;i<dt.contacts.length;i++){
			if(dt.contacts[i].name==char_name){
				influence_stats.friendly=dt.contacts[i].friendly
				influence_stats.emotion=dt.contacts[i].emotion
			}
		}
		let talk = document.createElement('button')
		talk.textContent='talk';talk.className='btn primary-bg'
		talk.onclick=()=>{
			document.getElementById("class-char-dialogue").innerHTML=''
			let data = this.event_handler.fetch_api({name:'character engine',char:char_name,f:influence_stats.friendly,e:influence_stats.emotion})
			let dialogue = document.createElement('p')
			let buttons_div = document.createElement('div')
			dialogue.textContent=data.text
			for(let i = 0;i<data.options.length;i++){
				let btn = document.createElement('button')
				btn.textContent=data.options[i].text 
				btn.onclick=()=>{
					let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
					for(let j=0;j<data.options[i].rewards.length;j++){
						if(!player_data.items.includes(player_data.items.some(item => item.name === data.options[i].rewards[i].name))){
							if(data.options[i].rewards[j].name=='number'){
								if(!player_data.contacts.includes(player_data.contacts.some(item => item.name === data.char))){
									player_data.contacts.push({name:data.char,friendly:influence_stats.friendly,emotion:influence_stats.emotion})
									this.event_handler.set_message({text:`added ${data.char} to your contacts`,canClose:true,options:[]})
								}
							}else{
								player_data.items.push(data.options[i].rewards[j])
								this.event_handler.set_message({text:`you received ${data.options[i].rewards[j].name}`,canClose:true,options:[]})
						
							}
							
						}
						
					}
					dialogue.textContent=data.options[i].response
					influence_stats.friendly+=data.options[i].influence[0]
					influence_stats.emotion+=data.options[i].influence[1]
					for(let i=0;i<player_data.contacts.length;i++){
						if(player_data.contacts[i].name==data.char){
							player_data.contacts[i].friendly=influence_stats.friendly
							player_data.contacts[i].emotion=influence_stats.emotion
						}
					}
					buttons_div.innerHTML=''
					this.event_handler.broadcast({message:'save data',data:player_data})
        			this.event_handler.broadcast({message:'time foward',hour:10})
				}
				buttons_div.append(btn)
			}
			document.getElementById("class-char-dialogue").append(dialogue,buttons_div)
			document.getElementById("class-char-img").src = data.image
			
		}
		let item = document.createElement('button')
		item.textContent='gift item';item.className='btn primary-bg'
		item.onclick=()=>{
			let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
			let options = []
			let self = this
			for(let i=0; i<player_data.items.length;i++){
				options.push({
		    		text:player_data.items[i].name,
		    		func:function(){
		    			let data = self.event_handler.fetch_api({name:'character engine',type:'give item',item:player_data.items[i].name})
		    			player_data.items.splice(i,1)
		    			document.getElementById("class-char-dialogue").innerHTML=data.text
		    			if(influence_stats.friendly<2){
		    				influence_stats.friendly+=data.influence[0]
		    			}
		    			if(influence_stats.emotion<2){
		    				influence_stats.emotion+=data.influence[1]
		    			}
		    			document.getElementById('message_log').style.display='none';
						document.getElementById('message_log').innerHTML=''
						self.event_handler.broadcast({message:'save data',data:player_data})
		    		}
	    		})
			}
			this.event_handler.set_message({text:`select item`,canClose:true,options:options})
			
		}
		let battle = document.createElement('button')
		battle.textContent='battle';battle.className='btn primary-bg'
		battle.onclick=()=>{
			let data = this.event_handler.fetch_api({name:'character engine',char:char_name,type:'battle request'})
			this.event_handler.broadcast({message:'switch',tab:'arena',event_data:{type:'battle request',opponent:data.battle_info}})
		}
		document.getElementById("class-controls").append(talk)
		document.getElementById("class-controls").append(item)
		document.getElementById("class-controls").append(battle)
		let data = this.event_handler.fetch_api({name:'character engine',char:char_name,f:influence_stats.friendly,e:influence_stats.emotion})
		document.getElementById("class-char-dialogue").innerHTML=data.intro
		document.getElementById("class-char-img").src = data.image
	}
}