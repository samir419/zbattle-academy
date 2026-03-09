class Character_Engine{
	constructor(){
		this.event_handler
		this.log=[]
		this.char_data
		this.char = {
			name:'char1',
			thumbnail:'',
			images:[
				'chars/rico/assistant1.png',
				'chars/rico/assistant2.png',
				'chars/rico/assistant3.png'
			],
			talks:[
				//friendly 1
				[
					//emotion 1
					[
						{
							text:'frnd 1 emo 1',
							img:'random',
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[{name:'char item',quantity:1,price:50}],
									influence:[0,0]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[{name:'number'}],
									influence:[1,0]
								}
							]
						},
						{
							text:'frnd 1 emo 1 2nd',
							img:'random',
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[1,1]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[0,1]
								}
							]
						}
					],
					//emotion 2
					[
						{
							text:'frnd 1 emo 2',
							img:'random',
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[0,0]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[1,0]
								}
							]
						},
						{
							text:'frnd 1 emo 2 2nd',
							img:1,
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[0,-1]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[1,-1]
								}
							]
						}
					]

				],
				//friendly 2
				[
					//emotion 1
					[
						{
							text:'frnd 2 emo 1',
							img:0,
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[0,0]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[0,1]
								}
							]
						},
						{
							text:'frnd 2 emo 1 2nd',
							img:0,
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[-1,1]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[-1,0]
								}
							]
						}
					],
					//emotion 2
					[
						{
							text:'frnd 2 emo 2',
							img:0,
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[0,0]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[-1,0]
								}
							]
						},
						{
							text:'frnd 2 emo 2 2nd',
							img:0,
							options:[
								{
									text:'option 1',
									response:'you picked option 1',
									rewards:[],
									influence:[-1,-1]
								},
								{
									text:'option 2',
									response:'you picked option 2',
									rewards:[],
									influence:[0,-1]
								}
							]
						}
					]

				]
			]
		}
	}
	handle_fetch(data){
		if(data.type=='give item'){
			this.char=this.char_data[data.char]
			for(let i=0;i<this.char.desired_items.length;i++){
				if(data.item==this.char.desired_items[i].name){
					if(i==0){
						return {text:this.char.desired_items[i].response,influence:[1,0]}
					}
					if(i==1){
						return {text:this.char.desired_items[i].response,influence:[0,1]}
					}
					if(i==2){
						return {text:this.char.desired_items[i].response,influence:[1,1]}
					}
				}
			}
			return {text:'thank you',influence:[0,0]}
			
		}
		if(data.type=='battle request'){
			this.char=this.char_data[data.char]
			return {battle_info:this.char.battle_info}
		}
		this.char=this.char_data[data.char]
		let talk = this.char.talks[data.f][data.e]
		let res = talk[Math.floor(Math.random() * talk.length)]
		if(res.img=='random'){
			res.image = this.char.images[Math.floor(Math.random() * this.char.images.length)]
		}else{
			res.image = this.char.images[res.img]
		}
		res.intro = this.char.intro
		res.char = this.char.name
		return res
	}
	get_data(){
		return this.log
	}
	handle_event(){}
}