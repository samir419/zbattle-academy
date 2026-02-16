let pot={
	name:'pot',
	items:[],
	available_actions:['boil']
}
let plate={
	name:'plate',
	items:[],
	available_actions:[],
	on_add: function () {

		let stats = '';
		let total = {
			sweet: 0,
			salty: 0,
			sour: 0,
			tender: 0,
			oily: 0,
			wet_to_dry: 0
		};

		for (let i = 0; i < this.items.length; i++) {

			let item = this.items[i];

			stats += `<div>${item.name}</div>`;

			total.sweet += item.sweet;
			total.salty += item.salty;
			total.sour += item.sour;
			total.tender += item.tender;
			total.oily += item.oily;
			total.wet_to_dry += item.wet_to_dry;
		}

		stats += `
			<hr>
			<div><strong>Combined Flavours</strong></div>
			<div>Sweet: ${total.sweet}</div>
			<div>Salty: ${total.salty}</div>
			<div>Sour: ${total.sour}</div>
			<div>Tender: ${total.tender}</div>
			<div>Oily: ${total.oily}</div>
			<div>Wet → Dry: ${total.wet_to_dry}</div>
		`;

		document.getElementById("food-stats").innerHTML = stats;
	}

}
plate.on_remove=plate.on_add
let chopping_board={
	name:'chopping board',
	items:[],
	available_actions:['chop']
}
raws={
	name:'storage',
	items:[],
	available_actions:[]
}

function init_cooking_game(data){
	for(let i=0;i<data.length;i++){
		raws.items.push(data[i])
	}
	document.getElementById('food-info').style.display='none'
	document.getElementById("quick-time-button").style.display='none'
	display()
	document.getElementById('boil-button').onclick = () => {
		document.getElementById('boil-button').disabled=true
		document.getElementById("quick-time-button").style.display='block'
		let bar = document.getElementById("boiling-bar");
		bar.style.display='flex'
		bar.style.height = "20px";
		bar.style.backgroundColor = "white";
		bar.style.width = "0%";
		//let perfectStart = 45;
		//let perfectEnd = 55;
		let perfectStart = Math.floor(Math.random() * 70) + 10; 
		let perfectEnd = perfectStart + 10;

		let target = document.getElementById("boiling-target");

		target.style.left = perfectStart + "%";
		target.style.width = (perfectEnd - perfectStart) + "%";


		let progress = 0;
		document.getElementById("quick-time-button").onclick=()=>{
			document.getElementById("quick-time-button").disabled=true
			if(progress>perfectStart&&perfectEnd<55){
				progress=100
			}
		}
		let interval = setInterval(() => {

			progress += 1;
			bar.style.width = progress + "%";

			if (progress >= 100) {
				clearInterval(interval);

				// Boiling finished
				for (let i = 0; i < pot.items.length; i++) {
					pot.items[i].boil();
				}
				bar.style.display='none'
				document.getElementById('boil-button').disabled=false
				document.getElementById("quick-time-button").disabled=false
				document.getElementById("quick-time-button").style.display='none'
				display();
			}

		}, 30); // 30ms per step (~3 seconds total)
	};
	
	document.getElementById("serve-food").onclick = () => {

		let total = {
			sweet: 0,
			salty: 0,
			sour: 0,
			tender: 0,
			oily: 0,
			wet_to_dry: 0
		};

		let portions = [];

		for (let i = 0; i < plate.items.length; i++) {

			let item = plate.items[i];

			total.sweet += item.sweet;
			total.salty += item.salty;
			total.sour += item.sour;
			total.tender += item.tender;
			total.oily += item.oily;
			total.wet_to_dry += item.wet_to_dry;

			portions.push(item.name);
		}

		let flavorSpread =
			Math.max(total.sweet, total.salty, total.sour) -
			Math.min(total.sweet, total.salty, total.sour);

		let balanceScore = Math.max(0, 10 - flavorSpread);

		let textureScore =
			total.tender * 2 -
			Math.abs(total.wet_to_dry - 5) -
			total.oily;

		let quality = Math.max(0, balanceScore + textureScore);

		let basePrice = 5 * plate.items.length;
		let price = basePrice + (quality * 2);

		let dish = {name:'dish',price:price,portions:portions,quality:quality,quantity:1}
		document.getElementById("food-stats").innerHTML = '';
		let data = JSON.parse(localStorage.getItem('zbattle academy data'))
		data.items.push(dish)
		localStorage.setItem('zbattle academy data', JSON.stringify(data))
		console.log("Dish:", portions.join(", "));
		console.log("Quality:", quality);
		console.log("Price:", price);

		plate.items=[]
		display()
	};


}
function display(){
	render_location(raws,document.getElementById('food-raws'))
	render_location(pot,document.getElementById('pot'))
	render_location(chopping_board,document.getElementById('chopping-board'))
	render_location(plate,document.getElementById('plate'))
}
function set_pot(){
	let pot_elem = document.getElementById('pot')
	pot_elem.innerHTML='<h3>pot</h3>'
	for(let i =0;i<pot.length;i++){
		let item_elem = document.createElement('div')
		let name = document.createElement('span');name.textContent=pot[i].name
		let put_back = document.createElement('button');put_back.textContent='put back'
		put_back.onclick=()=>{
			raws.push(pot[i])
			pot.splice(i,1)
			display()
		}
		let msg = document.createElement('span')
		item_elem.append(name,put_back,msg)
		pot_elem.append(item_elem)
	}
	let boil = document.createElement('button');boil.textContent='boil'
	boil.onclick=()=>{
		for(let i=0;i<pot.length;i++){
			pot[i].on_boil()
		}
		display()
	}
	pot_elem.append(boil)
}
function set_raws(){
	let raws_elem = document.getElementById('food-raws')
	raws_elem.innerHTML='<h3>food storage</h3>'
	for(let i=0;i<raws.items.length;i++){
		let raw_elem = document.createElement('div')
		let name = document.createElement('span');name.textContent=raws.items[i].name
		let select = document.createElement('button');select.textContent='select'
		select.onclick=()=>{
			render_info(raws,i)
		}
		raw_elem.append(name,select)
		raws_elem.append(raw_elem)
	}
}
function render_location(location,elem){
	elem.innerHTML=``
	for(let i=0;i<location.items.length;i++){
		let item = document.createElement('div')
		let name = document.createElement('span');name.textContent=location.items[i].name
		let select = document.createElement('button');select.textContent='select'
		select.onclick=()=>{
			render_info(location,i)
		}
		item.append(name,select)
		elem.append(item)
	}
}
function set_board(){
	let board_elem = document.getElementById('chopping-board')
	board_elem.innerHTML='<h3>chopping board</h3>'
	for(let i=0;i<chopping_board.length;i++){
		let raw_elem = document.createElement('div')
		let name = document.createElement('span');name.textContent=chopping_board[i].name
		let put_back = document.createElement('button');put_back.textContent='put back'
		let msg = document.createElement('span')
		put_back.onclick=()=>{
			raws.push(chopping_board[i])
			chopping_board.splice(i,1)
			display()
		}
		let chop = document.createElement('button');chop.textContent='chop'
		chop.onclick=()=>{
			let new_ing = chopping_board[i].on_chop()
			if(new_ing=='no effect'){
				msg.textContent='no effect'
			}else{
				name.textContent=chopping_board[i].name
				msg.textContent=''
			}
		}
		let peel = document.createElement('button');peel.textContent='peel'
		peel.onclick =()=>{
			let new_ing = chopping_board[i].on_peel()
			if(new_ing=='no effect'){
				msg.textContent='no effect'
			}else{
				name.textContent=chopping_board[i].name
				msg.textContent=''
			}
		}
		raw_elem.append(name,put_back,chop,peel,msg)
		board_elem.append(raw_elem)
	}
}

function render_info(location,index){
	if(!location.items[index].conditions)return
	document.getElementById('food-info').style.display='flex'

	let data = document.getElementById('food-data');data.innerHTML=''
	let actions = document.getElementById('food-actions');actions.innerHTML=''
	let locations = document.getElementById('food-locations');locations.innerHTML=''
	function set_data() {
		let item = location.items[index];
		let html = `
			<div><strong>Name:</strong> ${item.name}</div>
			<div>Sweet: ${item.sweet}</div>
			<div>Salty: ${item.salty}</div>
			<div>Sour: ${item.sour}</div>
			<div>Tender: ${item.tender}</div>
			<div>Oily: ${item.oily}</div>
			<div>Wet → Dry: ${item.wet_to_dry}</div>
			<div>Conditions: ${item.conditions.length ? item.conditions.join(", ") : "None"}</div>
			<div>Available Actions: ${item.available_actions.length ? item.available_actions.join(", ") : "None"}</div>
		`;
		data.innerHTML = html;
	}

	set_data()

	for(let i=0;i<location.available_actions.length;i++){
		let action = document.createElement('button');action.textContent=location.available_actions[i]
		action.onclick=()=>{
			location.items[index][location.available_actions[i]]()
			set_data()
			document.getElementById('food-info').style.display='none'
			display()
		}
		actions.append(action)
	}

	function create_location(obj){
		let elem = document.createElement('button');elem.textContent=obj.name
		elem.onclick=()=>{
			obj.items.push(location.items[index])
			if(obj.on_add){
				obj.on_add()
			}
			location.items.splice(index,1)
			if(location.on_remove){
				location.on_remove()
			}
			document.getElementById('food-info').style.display='none'
			display()
		}
		locations.append(elem)
	}
	create_location(raws)
	create_location(chopping_board)
	create_location(pot)
	create_location(plate)
	
}