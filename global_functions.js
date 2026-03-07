function set_character(char_name,event_handler,control_elem,dialogue_elem,image_elem){
	document.getElementById("park-controls").innerHTML=''
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
		dialogue_elem.innerHTML=''
		let data = event_handler.fetch_api({name:'character engine',char:char_name,f:influence_stats.friendly,e:influence_stats.emotion})
		let dialogue = document.createElement('p')
		let buttons_div = document.createElement('div')
		dialogue.textContent=data.text
		for(let i = 0;i<data.options.length;i++){
			let btn = document.createElement('button')
			btn.textContent=data.options[i].text 
			btn.onclick=()=>{
				let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
				for(let j=0;j<data.options[i].rewards.length;j++){
					if(!player_data.items.includes(player_data.items.some(item => item.name === data.options[i].rewards[j].name))){
						if(data.options[i].rewards[j].name=='number'){
							if(!player_data.contacts.includes(player_data.contacts.some(item => item.name === data.char))){
								player_data.contacts.push({name:data.char,friendly:influence_stats.friendly,emotion:influence_stats.emotion})
								event_handler.set_message({text:`added ${data.char} to your contacts`,canClose:true,options:[]})
							}
						}else{
							player_data.items.push(data.options[i].rewards[j])
							event_handler.set_message({text:`you received ${data.options[i].rewards[j].name}`,canClose:true,options:[]})
					
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
				event_handler.broadcast({message:'save data',data:player_data})
    			event_handler.broadcast({message:'time foward',hour:10})
			}
			buttons_div.append(btn)
		}
		dialogue_elem.append(dialogue,buttons_div)
		image_elem.src = data.image
		
	}
	let item = document.createElement('button')
	item.textContent='gift item';item.className='btn primary-bg'
	item.onclick=()=>{
		let player_data = JSON.parse(localStorage.getItem('zbattle academy data'))
		let options = []
		for(let i=0; i<player_data.items.length;i++){
			options.push({
	    		text:player_data.items[i].name,
	    		func:function(){
	    			let data = event_handler.fetch_api({name:'character engine',char:char_name,type:'give item',item:player_data.items[i].name})
	    			player_data.items.splice(i,1)
	    			dialogue_elem.innerHTML=data.text
	    			if(influence_stats.friendly<2){
	    				influence_stats.friendly+=data.influence[0]
	    			}
	    			if(influence_stats.emotion<2){
	    				influence_stats.emotion+=data.influence[1]
	    			}
	    			document.getElementById('message_log').style.display='none';
					document.getElementById('message_log').innerHTML=''
					event_handler.broadcast({message:'save data',data:player_data})
	    		}
    		})
		}
		event_handler.set_message({text:`select item`,canClose:true,options:options})
		
	}
	let battle = document.createElement('button')
	battle.textContent='battle';battle.className='btn primary-bg'
	battle.onclick=()=>{
		let data = event_handler.fetch_api({name:'character engine',char:char_name,type:'battle request'})
		event_handler.broadcast({message:'switch',tab:'arena',event_data:{type:'battle request',opponent:data.battle_info}})
	}
	control_elem.append(talk)
	control_elem.append(item)
	control_elem.append(battle)
	let data = event_handler.fetch_api({name:'character engine',char:char_name,f:influence_stats.friendly,e:influence_stats.emotion})
	dialogue_elem.innerHTML=data.intro
	image_elem.src = data.image
}
let max_health=1500