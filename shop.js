let food_list=[
	{
		name:'raw potatoes',
		price:10,
		
	},
	{
		name:'carrots',
		price:2,
		
	},
	{
		name:'onions',
		price:3,
		
	},
	{
		name:'raw chicken',
		price:12,
		
	},
	{
		name:'eggs',
		price:5,
		
	},
	{
		name:'tomatoes',
		price:4,
		
	},
	{
		name:'cheese',
		price:8,
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
		    {name:'kitchen knife',price:90,quantity:1,tags:['gift']},
		    {name:'mystic truffle', price:80, quantity:1, tags:['rare','luxury','gift','cooking']},
		    {name:'z fighter',price:200,quantity:1,tags:['gift']},
		    {name:'ancient textbook', price:50, quantity:1, tags:['intellectual','gift']},
		    {name:'level up',price:1000,quantity:1},
		    {name:'health up',price:1000,quantity:1},
		    {name:'increase move cap',price:1000,quantity:1}
		]
		this.card_list = moveObjects
		this.switch_tab('item-shop')
	}
	init(){
		let data = JSON.parse(localStorage.getItem('zbattle academy data'));
		let player_money = document.getElementById('player-money')
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
	    player_money.innerHTML = 'money:'+data.money+'z'
	    shopgirl_div.innerHTML='welcome to the item shop'

	    this.set_card_data(this.card_list,buyable_cards,'buy')
	    let selling_cards = []
	    data.available_moves.forEach(move=>{
	    	this.card_list.forEach(card=>{
	    		if(card.name==move){
	    			selling_cards.push(card)
	    		}
	    	})
	    })
	    this.set_card_data(selling_cards,sellable_cards,'sell')
	    shopboy_div.innerHTML="welcome to the card shop"

	    this.set_shop_data(food_list,buyable_foods,'buy')
	    shopwoman_div.innerHTML="welcome to the food market"

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
	            	const actions = {
					    'level up': () => data.level += 1,
					    'health up': () => data.health_cap += 100,
					    'increase move cap': () => data.move_cap += 1
					};

					if (actions[item.name]) {
					    actions[item.name]();
					    this.event_handler.broadcast({ message: 'save data', data });
					    this.init();
					    return
					}
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
	        name.textContent = item.name;
	        let itemprice = item.weight*100+item.durability*25
	        const price = document.createElement('div');
	        price.textContent = itemprice + 'z';

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
	            if (data.money < itemprice && mode == 'buy') {
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
	            	data.money -= itemprice;
		            data.available_moves.push(item);

		            this.event_handler.broadcast({
		                message: 'save data',
		                data: data
		            });
	            }else{
	            	data.money += itemprice;
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
	            this.event_handler.broadcast({message:'time foward',hour:50})
	            result.textContent = 'Received: ' + rewards.join(', ');
	            let ok = document.createElement('button');ok.textContent='ok'
	            ok.onclick=()=>{this.init()}
	            result.append(ok)
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
	    return arr[Math.floor(Math.random() * (arr.length-3))];
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
	    data.available_moves.push(card.name);
	    return card.name;
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