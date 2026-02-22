let foods=[
	{
		name:'raw potatoes',
		price:10,
		sweet:0,
		salty:0,
		sour:0,
		tender:0,
		oily:0,
		wet_to_dry:5,//<5 is wet, >5 is dry
		conditions:[],
		available_actions:['chop','boil','roast'],
		'boil':function(){
			if(this.available_actions.includes('boil')){
				this.conditions.push('boiled')
				this.available_actions=['fry']
				this.tender += 5;
				this.wet_to_dry -= 5;   // becomes wetter
				this.sweet -= 1;       // starch dilution

			}else{
				return 'no effect'
			}
		},
		'fry':function(){
			if(this.available_actions.includes('fry')){
				this.name = 'fries'
				this.conditions.push('fried')
				this.available_actions=[]
				if(this.conditions.includes('boiled')){
					this.oily += 6;
					this.sweet += 3;
					this.tender += 3;
				}else{
					this.oily += 3;
					this.tender += 1;
				}
			}else{
				return 'no effect'
			}
		},
		'roast':function(){
			if(this.available_actions.includes('roast')){
				this.conditions.push('roasted')
				this.available_actions=[]
				this.wet_to_dry+=5
				this.tender+=1
			}else{
				return 'no effect'
			}
		},
		'chop':function(){
			if(this.available_actions.includes('chop')){
				this.name = 'chopped potatoes'
				this.conditions.push('chopped')
				this.available_actions=['fry','boil','roast']
			}else{
				return 'no effect'
			}
		},
		'blend':function(){
			if(this.available_actions.includes('blend')){
				this.conditions.push('blended')
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
	},
	{
		name:'carrots',
		price:2,
		sweet:0,
		salty:0,
		sour:0,
		tender:0,
		oily:0,
		wet_to_dry:7,
		conditions:[],
		available_actions:['chop','boil'],
		'boil':function(){
			if(this.available_actions.includes('boil')){
				this.conditions.push('boiled')
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
		'roast':function(){
			if(this.available_actions.includes('roast')){
				this.conditions.push('roasted')
				this.available_actions=[]
				this.wet_to_dry-=5
			}else{
				return 'no effect'
			}
		},
		'fry':function(){
			if(this.available_actions.includes('fry')){
				this.conditions.push('fried')
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
		'chop':function(){
			if(this.available_actions.includes('chop')){
				this.conditions.push('chopped')
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
		'blend':function(){
			if(this.available_actions.includes('blend')){
				this.conditions.push('blended')
				this.wet_to_dry-=3
				this.sweet+=2
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
	},
	{
		name:'onions',
		price:3,
		sweet:1,
		salty:0,
		sour:0,
		tender:0,
		oily:0,
		wet_to_dry:6,
		conditions:[],
		available_actions:['chop','fry','boil'],
		'boil':function(){
			if(this.available_actions.includes('boil')){
				this.conditions.push('boiled')
				this.tender+=3
				this.sweet+=1
				this.wet_to_dry-=3
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'fry':function(){
			if(this.available_actions.includes('fry')){
				this.conditions.push('fried')
				this.sweet+=4 // caramelization
				this.oily+=3
				this.tender+=2
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'chop':function(){
			if(this.available_actions.includes('chop')){
				this.conditions.push('chopped')
				this.available_actions=['fry','boil']
			}else{return 'no effect'}
		},
		'blend':function(){
			if(this.available_actions.includes('blend')){
				this.conditions.push('blended')
				this.wet_to_dry-=2
				this.available_actions=[]
			}else{return 'no effect'}
		}
	},
	{
		name:'raw chicken',
		price:12,
		sweet:0,
		salty:1,
		sour:0,
		tender:1,
		oily:1,
		wet_to_dry:4,
		conditions:[],
		available_actions:['chop','boil','fry','roast'],
		'boil':function(){
			if(this.available_actions.includes('boil')){
				this.name='boiled chicken'
				this.conditions.push('boiled')
				this.tender+=4
				this.wet_to_dry-=2
				this.available_actions=['chop']
			}else{return 'no effect'}
		},
		'fry':function(){
			if(this.available_actions.includes('fry')){
				this.name='fried chicken'
				this.conditions.push('fried')
				this.oily+=5
				this.tender+=2
				this.wet_to_dry+=3
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'roast':function(){
			if(this.available_actions.includes('roast')){
				this.name='roasted chicken'
				this.conditions.push('roasted')
				this.tender+=3
				this.wet_to_dry+=4
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'chop':function(){
			if(this.available_actions.includes('chop')){
				this.conditions.push('chopped')
				this.available_actions=['fry']
			}else{return 'no effect'}
		}
	},
	{
		name:'eggs',
		price:5,
		sweet:0,
		salty:0,
		sour:0,
		tender:2,
		oily:0,
		wet_to_dry:3,
		conditions:[],
		available_actions:['boil','fry','blend'],
		'boil':function(){
			if(this.available_actions.includes('boil')){
				this.name='boiled eggs'
				this.conditions.push('boiled')
				this.tender+=2
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'fry':function(){
			if(this.available_actions.includes('fry')){
				this.name='fried eggs'
				this.conditions.push('fried')
				this.oily+=3
				this.tender+=1
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'roast':function(){
			if(this.available_actions.includes('roast')){
				this.conditions.push('roasted')
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
		'blend':function(){
			if(this.available_actions.includes('blend')){
				this.name='beaten eggs'
				this.conditions.push('blended')
				this.wet_to_dry-=2
				this.available_actions=['fry']
			}else{return 'no effect'}
		}
	},
	{
		name:'tomatoes',
		price:4,
		sweet:2,
		salty:0,
		sour:2,
		tender:1,
		oily:0,
		wet_to_dry:2,
		conditions:[],
		available_actions:['chop','boil','blend'],
		'boil':function(){
			if(this.available_actions.includes('boil')){
				this.name='tomato sauce'
				this.conditions.push('boiled')
				this.sour+=1
				this.wet_to_dry-=3
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'chop':function(){
			if(this.available_actions.includes('chop')){
				this.conditions.push('chopped')
				this.available_actions=['boil','blend']
			}else{return 'no effect'}
		},
		'blend':function(){
			if(this.available_actions.includes('blend')){
				this.name='tomato puree'
				this.conditions.push('blended')
				this.wet_to_dry-=4
				this.available_actions=[]
			}else{return 'no effect'}
		},
		'roast':function(){
			if(this.available_actions.includes('roast')){
				this.conditions.push('roasted')
				this.available_actions=[]
			}else{
				return 'no effect'
			}
		},
	},
	{
	name:'cheese',
	price:8,
	sweet:0,
	salty:4,
	sour:1,
	tender:2,
	oily:2,
	wet_to_dry:6,
	conditions:[],
	available_actions:['chop','fry'],
	'fry':function(){
		if(this.available_actions.includes('fry')){
			this.name='melted cheese'
			this.conditions.push('melted')
			this.oily+=3
			this.tender+=3
			this.wet_to_dry-=3
			this.available_actions=[]
		}else{return 'no effect'}
	},
	'chop':function(){
		if(this.available_actions.includes('chop')){
			this.conditions.push('chopped')
			this.available_actions=['fry']
		}else{return 'no effect'}
	},
	'boil':function(){
		if(this.available_actions.includes('boil')){
			this.conditions.push('boiled')
		}else{
			return 'no effect'
		}
	},
}





]

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
	available_actions:[],
	on_add:function(){
		let data = JSON.parse(localStorage.getItem('zbattle academy data'));

		for (let i = 0; i < this.items.length; i++) {
		    let exists = false;

		    for (let j = 0; j < data.items.length; j++) {
		        if (data.items[j].name === this.items[i].name) {
		            exists = true;
		            break;
		        }
		    }

		    if (!exists) {
		        data.items.push(this.items[i]);
		        console.log('added ' + this.items[i].name);
		    }
		}

		localStorage.setItem('zbattle academy data', JSON.stringify(data));
	}
}

function init_cooking_game(data){
	raws.items=[]
	for(let i=0;i<foods.length;i++){
		for(let j = 0;j<data.length;j++){
			if(foods[i].name==data[j].name){
				raws.items.push(foods[i])
			}
			
		}
		
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
			if(progress>perfectStart&&progress<perfectEnd){
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
					let data = JSON.parse(localStorage.getItem('zbattle academy data'));
					for(let j=0;j<data.items.length;j++){
						if(data.items[j].name==pot.items[i].name){
							data.items.splice(j,1)
							console.log('removed'+data.items[j])
						}
					}
					localStorage.setItem('zbattle academy data', JSON.stringify(data))
					console.log(pot.items[i])
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
			let data = JSON.parse(localStorage.getItem('zbattle academy data'));
			for(let j=0;j<data.items.length;j++){
				if(data.items[j].name==plate.items[i].name){
					data.items.splice(j,1)
					console.log('removed'+data.items[j])
				}
			}
			localStorage.setItem('zbattle academy data', JSON.stringify(data))
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
			if (!location.items[index][location.available_actions[i]])return
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