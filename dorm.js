class Dorm{
	constructor(elem){
		this.elem = elem
		this.event_handler
		this.event_data = {}
		this.tabButtons = document.getElementById('dorm-tab-buttons').children

		this.sections = [
			document.getElementById('dorm-save'),
			document.getElementById('dorm-movesets'),
			document.getElementById('create-moveset-form'),
			document.getElementById('dorm-calendar'),
			document.getElementById('kitchen'),
			document.getElementById('player-achievements')
		]

		this.tabButtons[0].onclick =()=>{
			this.switch_tab('dorm-save')
		}
		this.tabButtons[1].onclick =()=>{
			this.switch_tab('dorm-movesets')
		}
		this.tabButtons[2].onclick =()=>{
			this.switch_tab('dorm-calendar')
			document.getElementById("dorm-event-list").innerHTML=''
			this.event_handler.broadcast({message:'get event list'})
			let list = this.event_data.event_list
			console.log(list)
			let data = JSON.parse(localStorage.getItem('zbattle academy data'));
			for(let i=0;i<list.length;i++){
				let div = document.createElement('div');div.className='flex row'
				div.innerHTML=`${list[i].name} start- day:${list[i].start_day} time:${list[i].start_time} end- day:${list[i].end_day} time:${list[i].end_time}`
				if(data.time.day>=list[i].start_day&&data.time.day<=list[i].end_day&&data.time.hour>=list[i].start_time&&data.time.hour<=list[i].end_time){
					div.style.color = 'red'
					div.onclick=()=>{
						let data = JSON.parse(localStorage.getItem('zbattle academy data'));
						if(data.time.day>=list[i].start_day&&data.time.day<=list[i].end_day&&data.time.hour>=list[i].start_time&&data.time.hour<=list[i].end_time){
							this.event_handler.broadcast({message:'switch',tab:list[i].location,event_data:list[i].event_data})
						}else{
							this.event_handler.set_message({text:'event is unavailable',canClose:true,options:[]})
						}
						
					}
				}
				document.getElementById("dorm-event-list").append(div)
			}
			
		}
		this.tabButtons[3].onclick =()=>{
			this.switch_tab('kitchen')

			let foods=[]
			let data = JSON.parse(localStorage.getItem('zbattle academy data'));
			for(let i=0;i<data.items.length;i++){
		 		foods.push(data.items[i])
			}
			init_cooking_game(foods)
		}
		this.tabButtons[4].onclick = () => {

			this.switch_tab('player-achievements')

			let missionContainer = document.getElementById('player-missions')
			let statsContainer = document.getElementById('dorm-player-stats')

			let data = JSON.parse(localStorage.getItem('zbattle academy data'))
			if(!data) return

			let stats = data.stats

			// -------- CHECK MISSIONS USING IDS --------
			data.missions.forEach(m => {

				switch(m.id){
					case 'buy_1':
						if(data.items.length >= 1)
							m.completed = true
						break

					case 'defeat_1':
						if(stats.defeated_opponents.length >= 1)
							m.completed = true
						break

					case 'defeat_3':
						if(stats.defeated_opponents.length >= 3)
							m.completed = true
						break

					case 'defeat_10':
						if(stats.defeated_opponents.length >= 10)
							m.completed = true
						break

					case 'reach_lvl_10':
						if(data.level >= 10)
							m.completed = true
						break

					case 'own_10_moves':
						if(data.available_moves.length >= 10)
							m.completed = true
						break

					case 'own_2_sets':
						if(data.movesets.length >= 2)
							m.completed = true
						break

					case 'earn_500':
						if(data.money >= 500)
							m.completed = true
						break

					case 'own_10_items':
						if(data.items.length >= 10)
							m.completed = true
						break

					case 'defeat_zabel':
						if(stats.defeated_opponents.includes('Zabel'))
							m.completed = true
						break
				}
			})

			// -------- RENDER MISSIONS --------
			missionContainer.innerHTML = ''
			data.missions.forEach(m => {

				let div = document.createElement('div')
				div.className = m.completed ? 'mission completed' : 'mission'

				div.textContent = m.goal
				if(m.completed){
					let check = document.createElement('span')
					check.textContent = ' ✔'
					check.style.color = 'lime'
					div.appendChild(check)
				}

				missionContainer.appendChild(div)
			})

			// -------- RENDER STATS --------
			statsContainer.innerHTML = ''

			let level = document.createElement('p')
			level.textContent = `Level: ${data.level}`

			let money = document.createElement('p')
			money.textContent = `Money: ${data.money}`

			let wins = document.createElement('p')
			wins.textContent = `Wins: ${stats.wins}`

			let losses = document.createElement('p')
			losses.textContent = `Losses: ${stats.losses}`

			let defeatedTitle = document.createElement('h4')
			defeatedTitle.textContent = 'Defeated Opponents:'

			let defeatedList = document.createElement('div')

			if(stats.defeated_opponents.length === 0){
				defeatedList.textContent = 'None'
			}else{
				stats.defeated_opponents.forEach(name => {
					let opponent = document.createElement('div')
					opponent.className = 'defeated-name'
					opponent.textContent = name
					defeatedList.appendChild(opponent)
				})
			}

			statsContainer.appendChild(level)
			statsContainer.appendChild(money)
			statsContainer.appendChild(wins)
			statsContainer.appendChild(losses)
			statsContainer.appendChild(defeatedTitle)
			statsContainer.appendChild(defeatedList)

			// -------- SAVE --------
			localStorage.setItem('zbattle academy data', JSON.stringify(data))
			this.event_handler.broadcast({message:'save data', data:data})
		}
		this.switch_tab('dorm-save')

		document.getElementById('create-moveset-btn').onclick=()=>{
			this.switch_tab('create-moveset-form')
			this.setupMoveCreation()
		}

		document.getElementById('sleep-btn').onclick=()=>{
			this.event_handler.broadcast({message:'time foward',hour:2400})
			this.event_handler.broadcast({message:'time foward',hour:700})
		}
		document.getElementById('delete-player-data').onclick=()=>{
			//localStorage.clear();
			this.event_handler.set_message({text:'delete data?',canClose:true,options:[
        		{
        			text:'ok',
        			func:function(){
        				localStorage.removeItem('zbattle academy data');
						location.reload();
        			}
        		}
        	]})
			
		}
	}
	displayUserData() {
	    let data = JSON.parse(localStorage.getItem('zbattle academy data'));
	    let display = document.getElementById("dorm-player-data");
	    let save_btn = document.getElementById("dorm-save-btn");
	    let load_btn = document.getElementById("dorm-load-btn");
	    let file_input = document.getElementById("save-file-input");

	    if (!data) return;

	    // ---- DISPLAY PLAYER DATA ----
	    display.innerHTML = `
	        <p><strong>Name:</strong> ${data.name}</p>
	        <p><strong>Level:</strong> ${data.level}</p>
	        <p><strong>Money:</strong> ${data.money}</p>
	    `;

	    // ---- SAVE DATA AS JSON FILE ----
	    save_btn.onclick = () => {
	        const json = JSON.stringify(data, null, 2);
	        const blob = new Blob([json], { type: "application/json" });
	        const url = URL.createObjectURL(blob);

	        const a = document.createElement("a");
	        a.href = url;
	        const date = new Date().toISOString().split("T")[0];
			a.download = `zbattle_academy_save_${date}.json`;
	        a.click();

	        URL.revokeObjectURL(url);
	        this.event_handler.set_message({
		    	text:'save successful',
		    	canClose:true,
		    	options:[]
		    })
	    };

	    // ---- LOAD DATA FROM JSON FILE ----
	    load_btn.onclick = () => {
	        file_input.click();
	    };

	    file_input.onchange = () => {
	        const file = file_input.files[0];
	        if (!file) return;

	        const reader = new FileReader();
	        reader.onload = () => {
	            try {
	                const loadedData = JSON.parse(reader.result);

	                // Save to localStorage
	                localStorage.setItem(
	                    'zbattle academy data',
	                    JSON.stringify(loadedData)
	                );

	                // Re-render UI
	                this.displayUserData();
	            } catch (e) {
	                alert("Invalid save file");
	            }
	        };

	        reader.readAsText(file);
	    };
	}

	display_movesets(){
		document.getElementById('player-movesets').innerHTML=''
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		let index = 0
		data.movesets.forEach(moveset=>{
			let div = document.createElement('div')
			for(let i=0;i<moveset.length;i++){
				let m = document.createElement('span')
				m.textContent=moveset[i]+' '
				div.appendChild(m)
			}
			let delete_btn = document.createElement('button');delete_btn.textContent='delete';
			let num = index
			delete_btn.onclick=()=>{this.delete_moveset(num)}
			div.appendChild(delete_btn)
			document.getElementById('player-movesets').append(div)
			index++
		})
	}
	render_items(){
		document.getElementById('dorm-items').innerHTML='<h2>items:</h2>'
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		for(let i=0;i<data.items.length;i++){
			document.getElementById('dorm-items').innerHTML+=data.items[i].name+', '
		}
		
	}
	switch_tab(tab){
		this.sections.forEach(section=>{
			section.style.display='none'
			if(section.id==tab){
				section.style.display='flex'
			}
		})
		this.displayUserData()
		this.display_movesets()
		this.render_items()
	}
	delete_moveset(index) {
	    let data = JSON.parse(localStorage.getItem('zbattle academy data'));
	    if (
	        !data ||
	        !Array.isArray(data.movesets) ||
	        index < 0 ||
	        index >= data.movesets.length
	    ) {
	        return;
	    }
	    data.movesets.splice(index, 1);
	    this.event_handler.broadcast({message:'save data',data:data})
	    this.display_movesets()
	}
	handleOnSwitch(){
		this.display_movesets()
		this.displayUserData()

		
	}
	setupMoveCreation(){
		let available_list = document.getElementById("available-move-list")
		let selected_list = document.getElementById("selected-move-list")
		let finish_btn = document.getElementById("finish-moveset-creation")
		let data = JSON.parse(localStorage.getItem('zbattle academy data'));
		available_list.innerHTML='';selected_list.innerHTML=''
		let selected_moves = []
		function render_selected_moves(){
			selected_list.innerHTML=''
			for(let i=0;i<selected_moves.length;i++){
				let selectedDiv = document.createElement('div');selectedDiv.className='flex center column outline'
				let selectedMoveName = document.createElement('div');selectedMoveName.textContent=selected_moves[i]
				let remove_btn = document.createElement('button');remove_btn.textContent='remove'
				remove_btn.onclick=()=>{selected_moves.splice(i, 1);render_selected_moves()}
				selectedDiv.append(selectedMoveName,remove_btn)
				selected_list.appendChild(selectedDiv)
			}
		}
		for(let i=0;i<data.available_moves.length;i++){
			let div = document.createElement('div');div.className='flex center column'
			let move_name = document.createElement('div');move_name.textContent=data.available_moves[i]
			let add_btn = document.createElement('button');add_btn.textContent='add'
			add_btn.onclick=()=>{
				if(add_btn.textContent=='added')return
				selected_moves.push(data.available_moves[i])
				render_selected_moves()
				add_btn.textContent='added'
			}
			div.append(move_name,add_btn)
			available_list.appendChild(div)
		}
		finish_btn.onclick=()=>{
			data.movesets.push(selected_moves)
			this.event_handler.broadcast({message:'save data',data:data})
			this.switch_tab('dorm-movesets')
			this.display_movesets()
			this.setupMoveCreation()
		}
	}
	handle_event(data){
		if(data.message=='tab switch'&&data.tab==this.elem.id){
			this.handleOnSwitch()
		}
		if(data.message=='event list'){
			this.event_data.event_list = data.data
		}
	}
}