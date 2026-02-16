class Dorm{
	constructor(elem){
		this.elem = elem
		this.event_handler

		this.tabButtons = document.getElementById('dorm-tab-buttons').children

		this.sections = [
			document.getElementById('dorm-save'),
			document.getElementById('dorm-movesets'),
			document.getElementById('create-moveset-form'),
			document.getElementById('dorm-calendar'),
			document.getElementById('kitchen')
		]

		this.tabButtons[0].onclick =()=>{
			this.switch_tab('dorm-save')
		}
		this.tabButtons[1].onclick =()=>{
			this.switch_tab('dorm-movesets')
		}
		this.tabButtons[2].onclick =()=>{
			this.switch_tab('dorm-calendar')
		}
		this.tabButtons[3].onclick =()=>{
			this.switch_tab('kitchen')
			init_cooking_game()
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
	switch_tab(tab){
		this.sections.forEach(section=>{
			section.style.display='none'
			if(section.id==tab){
				section.style.display='flex'
			}
		})
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
			let div = document.createElement('div');div.className='flex center column outline'
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
	}
}