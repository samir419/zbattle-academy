let food_list=[
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
				tthis.available_actions=[]
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

class Shop{
	constructor(elem){
		this.elem = elem
		this.event_handler
		this.tabButtons = document.getElementById('shop-tab-buttons').children
		this.sections = [
			document.getElementById('item-shop'),
			document.getElementById('card-shop'),
			document.getElementById('food-market'),
			document.getElementById('shop-gacha-roullete')
		]
		this.tabButtons[0].onclick =()=>{
			this.switch_tab('item-shop')
		}
		this.tabButtons[1].onclick =()=>{
			this.switch_tab('card-shop')
		}
		this.tabButtons[2].onclick =()=>{
			this.switch_tab('food-market')
		}
		this.tabButtons[3].onclick =()=>{
			this.switch_tab('shop-gacha-roullete')
		}
		

		this.item_list=[
			{name:'candy',price:10,quantity:1,tags:['gift']},
			{name:'cheese cake',price:40,quantity:1,tags:['basic','cooking']},
			{name:'flour', price:5, quantity:1, tags:['basic','cooking']},
		    {name:'premium chocolate', price:30, quantity:1, tags:['sweet','luxury','gift','cooking']},
		    {name:'energy drink', price:25, quantity:1, tags:['boost','athletic','combat']},
		    {name:'mystic truffle', price:80, quantity:1, tags:['rare','luxury','gift','cooking']},
		    {name:'ancient textbook', price:50, quantity:1, tags:['intellectual','gift']},
		]
		this.card_list = [
			    'Strike',
			    'Replenish',
			    'Blast Cannon',
			    'Heal',
			    'Force Field',
			    'Holy Blade',
			    'Shield Strike',
			    'Demon Charge',
			    'Covenant of Carnage',
			    'Mirror Match',
			    'Power Up',
			    'Baneful Binding', 
			    'Repair',
			    'Attack Up',
			    'fusion xyz',
			    'Beast Mode',
			    'Malevonent Armor',
			    'Angel Guard',
			]
		this.switch_tab('item-shop')
	}
	init(){
		let data = JSON.parse(localStorage.getItem('zbattle academy data'));
		let buyable_items = document.getElementById("buyable-items");buyable_items.innerHTML=''
		let sellable_items = document.getElementById("sellable-items");sellable_items.innerHTML=''
		let shopgirl_div = document.getElementById("shop girl");shopgirl_div.innerHTML=''
		
		let buyable_cards = document.getElementById('buyable-cards');buyable_cards.innerHTML=''
		let sellable_cards = document.getElementById('sellable-cards');sellable_cards.innerHTML=''
		let shopboy_div = document.getElementById('shop boy');shopboy_div.innerHTML=''

		let buyable_foods = document.getElementById('buyable-foods');buyable_foods.innerHTML=''
		let shopwoman_div = document.getElementById('shop woman');shopwoman_div.innerHTML=''

	    this.set_shop_data(this.item_list,buyable_items,'buy')
	    this.set_shop_data(data.items,sellable_items,'sell')
	    let div = document.createElement('div')
	    div.textContent = 'money:'+data.money+'z'
	    shopgirl_div.appendChild(div)

	    this.set_card_data(this.card_list,buyable_cards,'buy')
	    this.set_card_data(data.available_moves,sellable_cards,'sell')
	    let div2 = document.createElement('div')
	    div2.textContent = 'money:'+data.money+'z'
	    shopboy_div.appendChild(div2)

	    this.set_shop_data(food_list,buyable_foods,'buy')
	    let div3 = document.createElement('div')
	    div3.textContent = 'money:'+data.money+'z'
	    shopwoman_div.appendChild(div3)

	    this.setup_gacha()
	}
	set_shop_data(items,elem,mode){
		for (let i = 0; i < items.length; i++) {
	        const item = items[i];

	        // main item row
	        const div = document.createElement('div');
	        div.className = 'flex row padding gap align-center';

	        const name = document.createElement('div');
	        name.textContent = item.name;

	        const price = document.createElement('div');
	        price.textContent = item.price + 'z';

	        // action container (this is where everything happens)
	        const action = document.createElement('div');
	        action.className = 'flex row gap';

	        const buyBtn = document.createElement('button');
	        buyBtn.textContent = 'Buy';
	        if(mode == 'sell'){
	        	buyBtn.textContent = 'sell';
	        }

	        // confirmation container (hidden by default)
	        const confirm = document.createElement('div');
	        confirm.className = 'flex row gap hidden';

	        const yesBtn = document.createElement('button');
	        yesBtn.textContent = 'Yes';

	        const noBtn = document.createElement('button');
	        noBtn.textContent = 'No';

	        // message area
	        const message = document.createElement('div');
	        message.className = 'hidden';

	        // BUY CLICK
	        buyBtn.onclick = () => {
	            const data = JSON.parse(localStorage.getItem('zbattle academy data'));

	            // Not enough money
	            if (data.money < item.price && mode == 'buy') {
	                message.textContent = "Not enough money";
	                message.classList.remove('hidden');
	                setTimeout(() => message.classList.add('hidden'), 1500);
	                return;
	            }

	            // show confirm buttons
	            buyBtn.classList.add('hidden');
	            confirm.classList.remove('hidden');
	        };

	        // YES CLICK
	        yesBtn.onclick = () => {
	            const data = JSON.parse(localStorage.getItem('zbattle academy data'));
	            if(mode=='buy'){
	            	data.money -= item.price;
		            data.items.push(item);

		            this.event_handler.broadcast({
		                message: 'save data',
		                data: data
		            });
	            }else{
	            	data.money += item.price;
	            	data.items.splice(i,1)
	            	 this.event_handler.broadcast({
		                message: 'save data',
		                data: data
		            });
	            }
	            

	            // reset UI
	            this.init()
	        };

	        // NO CLICK
	        noBtn.onclick = () => {
	            confirm.classList.add('hidden');
	            buyBtn.classList.remove('hidden');
	        };

	        confirm.append(yesBtn, noBtn);
	        action.append(buyBtn, confirm, message);

	        div.append(name, price, action);
	        elem.append(div);
	    }
	}
	set_card_data(items,elem,mode){
		for (let i = 0; i < items.length; i++) {
	        const item = items[i];

	        // main item row
	        const div = document.createElement('div');
	        div.className = 'flex row padding gap align-center';

	        const name = document.createElement('div');
	        name.textContent = item;

	        const price = document.createElement('div');
	        price.textContent = 100 + 'z';

	        // action container (this is where everything happens)
	        const action = document.createElement('div');
	        action.className = 'flex row gap';

	        const buyBtn = document.createElement('button');
	        buyBtn.textContent = 'Buy';
	        if(mode == 'sell'){
	        	buyBtn.textContent = 'sell';
	        }

	        // confirmation container (hidden by default)
	        const confirm = document.createElement('div');
	        confirm.className = 'flex row gap hidden';

	        const yesBtn = document.createElement('button');
	        yesBtn.textContent = 'Yes';

	        const noBtn = document.createElement('button');
	        noBtn.textContent = 'No';

	        // message area
	        const message = document.createElement('div');
	        message.className = 'hidden';

	        // BUY CLICK
	        buyBtn.onclick = () => {
	            const data = JSON.parse(localStorage.getItem('zbattle academy data'));

	            // Not enough money
	            if (data.money < 100 && mode == 'buy') {
	                message.textContent = "Not enough money";
	                message.classList.remove('hidden');
	                setTimeout(() => message.classList.add('hidden'), 1500);
	                return;
	            }

	            // show confirm buttons
	            buyBtn.classList.add('hidden');
	            confirm.classList.remove('hidden');
	        };

	        // YES CLICK
	        yesBtn.onclick = () => {
	            const data = JSON.parse(localStorage.getItem('zbattle academy data'));
	            if(mode=='buy'){
	            	data.money -= 100;
		            data.availablemoves.push(item);

		            this.event_handler.broadcast({
		                message: 'save data',
		                data: data
		            });
	            }else{
	            	data.money += 100;
	            	data.available_moves.splice(i,1)
	            	 this.event_handler.broadcast({
		                message: 'save data',
		                data: data
		            });
	            }
	            

	            // reset UI
	            this.init()
	        };

	        // NO CLICK
	        noBtn.onclick = () => {
	            confirm.classList.add('hidden');
	            buyBtn.classList.remove('hidden');
	        };

	        confirm.append(yesBtn, noBtn);
	        action.append(buyBtn, confirm, message);

	        div.append(name, price, action);
	        elem.append(div);
	    }
	}
	setup_gacha(){
	    const gacha_div = document.getElementById('shop-gacha-roullete');
	    gacha_div.innerHTML = '';
	    gacha_div.className = 'flex column gap padding';

	    const result = document.createElement('div');
	    result.className = 'gacha-result';

	    const createPack = (title, cost, onOpen) => {
	        const pack = document.createElement('div');
	        pack.className = 'flex row gap align-center';

	        const name = document.createElement('div');
	        name.textContent = title;

	        const price = document.createElement('div');
	        price.textContent = cost + 'z';

	        const btn = document.createElement('button');
	        btn.textContent = 'Open';

	        btn.onclick = () => {
	            const data = JSON.parse(localStorage.getItem('zbattle academy data'));

	            if (data.money < cost) {
	                result.textContent = 'Not enough money';
	                return;
	            }

	            data.money -= cost;
	            const rewards = onOpen(data);

	            this.event_handler.broadcast({
	                message: 'save data',
	                data
	            });

	            result.textContent = 'Received: ' + rewards.join(', ');
	        };

	        pack.append(name, price, btn);
	        return pack;
	    };

	    // 🎲 PACK 1 — Mixed gacha
	    const pack1 = createPack('Basic Gacha', 50, (data) => {
	        const roll = Math.random();
	        const rewards = [];

	        if (roll < 0.4) {
	            rewards.push(this.giveRandomItem(data));
	        } else if (roll < 0.7) {
	            rewards.push(this.giveRandomCard(data));
	        } else {
	            const coinRewards = [10, 50, 100, 200, 500, 1000];
	            const coins = this.randomFrom(coinRewards);
	            this.addCoins(data, coins);
	            rewards.push(coins + 'z');
	        }

	        return rewards;
	    });

	    // 🎲 PACK 2 — 2 items
	    const pack2 = createPack('Item Gacha x2', 100, (data) => {
	        const rewards = [];
	        for (let i = 0; i < 2; i++) {
	        	const roll = Math.random();
	             if (roll < 0.4) {
		            rewards.push(this.giveRandomItem(data));
		        } else if (roll < 0.7) {
		            rewards.push(this.giveRandomCard(data));
		        } else {
		            const coinRewards = [10, 50, 100, 200, 500, 1000];
		            const coins = this.randomFrom(coinRewards);
		            this.addCoins(data, coins);
		            rewards.push(coins + 'z');
		        }
	        }
	        return rewards;
	    });

	    // 🎲 PACK 3 — 3 items
	    const pack3 = createPack('Item Gacha x3', 150, (data) => {
	        const rewards = [];
	        for (let i = 0; i < 3; i++) {
	            const roll = Math.random();
	             if (roll < 0.4) {
		            rewards.push(this.giveRandomItem(data));
		        } else if (roll < 0.7) {
		            rewards.push(this.giveRandomCard(data));
		        } else {
		            const coinRewards = [10, 50, 100, 200, 500, 1000];
		            const coins = this.randomFrom(coinRewards);
		            this.addCoins(data, coins);
		            rewards.push(coins + 'z');
		        }
	        }
	        return rewards;
	    });

	    gacha_div.append(pack1, pack2, pack3, result);
	}

	randomFrom(arr) {
	    return arr[Math.floor(Math.random() * arr.length)];
	}

	addCoins(data, amount) {
	    data.money += amount;
	}

	giveRandomItem(data) {
	    const item = this.randomFrom(this.item_list);
	    data.items.push(item);
	    return item.name;
	}

	giveRandomCard(data) {
	    const card = this.randomFrom(this.card_list);
	    data.available_moves.push(card);
	    return card;
	}

	switch_tab(tab){
		this.sections.forEach(section=>{
			section.style.display='none'
			if(section.id==tab){
				section.style.display='flex'
			}
		})
		this.init()
	}
	handleOnSwitch(){
		this.init()
	}
	
	handle_event(data){
		if(data.message=='tab switch'&&data.tab==this.elem.id){
			this.handleOnSwitch()
		}
	}
}