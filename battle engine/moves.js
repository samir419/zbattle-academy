class move {
    constructor(data){
        this.name = data.name;
        this.type = data.type;
        this.damage = data.damage;
        this.turns = data.turns; // number of turns the move lasts
        this.turn_count = 0;
        this.durability = data.durability;
        this.durability_ref = data.durability;
        this.weight = data.weight;
        this.effects = data.effects; // e.g., ['stun', 'poison']
        this.img = data.image;
        this.onhit = data.onhit;
        this.onupdate = data.update;
        this.isactive = false;
        this.isenabled = true;
        this.user = null;
        this.target = null;
        this.target_moves = [];
        this.prompt_data=data.prompt_data;
        this.prompt_info;
        this.temp_data={}
        this.elem = null;
        this.data
    }
    use(data){
        this.data=data
        this.data.self = this
        let user = data.user
        let target = data.target
        let game_instance = data.game
        if(!this.isenabled){
            game_instance.log('move is disabled')
            return
        }
        if(this.durability<=0){
            game_instance.log(`${this.name} has no durability left!`);
            return;
        }
        this.durability-=1;
        this.isactive = true;
        this.turn_count = this.turns;
        this.user = user;
        this.target = target;
        //this.target_moves = [...user.moves, ...target.moves];
        this.prompt_info=data.prompt_info
        game_instance.log(`${user.name} used ${this.name}`);
        if(this.type=='attack'){
            let dmg = get_damage(this.damage,user,target);
            target.health -= dmg
            target.lastDamageReceived = dmg
            game_instance.log(`${target.name} took ${dmg} damage`);
        }
        for(let i=0;i<this.effects.length;i++){
            let name = this.effects[i].split('-')[0]
            let value = Number(this.effects[i].split('-')[1])
            effect_list[name].init(data,value)
        }
        this.onhit(data);
    }
    update(){
        if(this.isactive && this.turn_count>0){
            this.turn_count -= 1;
            if(this.onupdate){
                this.onupdate(this.data)
            }
            for(let i=0;i<this.effects.length;i++){
                let name = this.effects[i].split('-')[0]
                let value = Number(this.effects[i].split('-')[1])
                effect_list[name].update(this.data)
            }
            if(this.turn_count==0){
                this.isactive = false;
                this.data.game.log(`${this.name} has ended`);
            }
        }
        if(this.durability==0){
            this.isenabled = false;
        }
    }
}
const effect_list={
    "heal":{
        init:function(data,value){data.target.health+=value;data.game.log(`${data.target.name} healed ${value} hp`)},
        update:function(data){}
    },
    "guard":{
        init:function(data,value){data.target.status_effects.push('guard');data.game.log(`${data.target.name} is guarded`)},
        update:function(data){
            if(data.self.turn_count==0){
                let index = data.user.status_effects.indexOf('guard');
                if (index > -1) {
                    data.user.status_effects.splice(index, 1);
                    data.game.log(`${data.target.name} is no longer guarded`);
                }
            }
        }
    },
    "attack_buff":{
        init:function(data,value){data.target.status_effects.push(`attack_buff-${value}`);data.game.log(`${data.target.name} attack increased`)},
        update:function(data){if (data.self.turn_count == 0) {
                let index = data.target.status_effects.findIndex(
                    effect => effect.startsWith('attack_buff-')
                );
                if (index > -1) {
                    data.target.status_effects.splice(index, 1);
                    log(`${data.target.name} is no longer empowered`);
                }
            }
        }
    },
    "healSelf":{
        init:function(data,value){data.user.health+=value;data.game.log(`${data.user.name} healed ${value} hp`)},
        update:function(data){}
    },
    "guardSelf":{
        init:function(data,value){data.user.status_effects.push('guard');data.game.log(`${data.user.name} is guarded`)},
        update:function(data){
            if(data.self.turn_count==0){
                let index = data.user.status_effects.indexOf('guard');
                if (index > -1) {
                    data.user.status_effects.splice(index, 1);
                    data.game.log(`${data.user.name} is no longer guarded`);
                }
            }
        }
    },
    "thorns":{
        init:function(data,value){data.user.status_effects.push('thorns');data.game.log(`${data.user.name} has thorn effect`)},
        update:function(data){
            if(data.self.turn_count==0){
                let index = data.user.status_effects.indexOf('thorns');
                if (index > -1) {
                    data.user.status_effects.splice(index, 1);
                    data.game.log(`${data.user.name}'s' thorn effect has worn off`);
                }
            }
        }
    },
    "attack_buffSelf":{
        init:function(data,value){data.user.status_effects.push(`attack_buff-${value}`);data.game.log(`${data.user.name} attack increased`)},
        update:function(data){if (data.self.turn_count == 0) {
                let index = data.user.status_effects.findIndex(
                    effect => effect.startsWith('attack_buff-')
                );
                if (index > -1) {
                    data.user.status_effects.splice(index, 1);
                    log(`${data.user.name} is no longer empowered`);
                }
            }
        }
    }

}
function get_damage(dmg, user, target) {
    let damage = dmg;
    if(target.status_effects.includes('invulnerable')){
        return  0;
    }
    if(user.status_effects.find(effect => effect.startsWith('attack_buff'))){
        let [keyword, value] = user.status_effects.find(effect => effect.startsWith('attack_buff')).split('-');
        value = Number(value);
        damage = Math.floor(damage+value);
    }
    if(target.status_effects.includes('guard')){
        damage = Math.floor(damage/2);
    }
    if(target.status_effects.includes('thorns')){
        user.health-=damage;
    }
    return Math.floor(damage);
}
function get_prompt_info(player,target,game,move){
    let selected_values=[]
    if(move.prompt_data.type){
        let arr = []
        if(move.prompt_data.type=='select target moves'){
            arr =  target.moves.map((_, i) => i)
        }else if(move.prompt_data.type=='select moves'){
            arr = player.moves.map((_, i) => i)
        }
        for(let i=0;i<move.prompt_data.amount;i++){
            let m = Math.floor(Math.random() * arr.length)
            selected_values.push(m)
            arr.splice(m,1)
        }
       
    }else{
    }
    let p_data ={
        user:player,target:target,game:game,self:move,
        prompt_info:{
            selected_values:selected_values
        },
    }
    return p_data
}
let moveTemplate = {
    name:'Null',
    type:'spell',
    damage:0,
    turns:0,
    durability:1,
    weight:0,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let attack = {
    name:'Attack',
    type:'attack',
    damage:100,
    turns:0,
    durability:100,
    weight:0,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let defend = {
    name:'Defend',
    type:'spell',
    damage:0,
    turns:1,
    durability:100,
    weight:0,
    effects:['guardSelf'],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let strike = {
    name:'Strike',
    type:'attack',
    damage:300,
    turns:0,
    durability:5,
    weight:3,
    effects:[],
    image:'strike.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let replenish = {
    name:'Replenish',
    type:'spell',
    damage:0,
    turns:0,
    durability:1,
    weight:5,
    effects:['heal-500'],
    image:'heal.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let blastCannon = {
    name:'Blast Cannon',
    type:'attack',
    damage:500,
    turns:0,
    durability:1,
    weight:5,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let heal = {
    name:'Heal',
    type:'spell',
    damage:0,
    turns:0,
    durability:2,
    weight:3,
    effects:['heal-350'],
    image:'strike.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let forceField = {
    name:'Force Field',
    type:'spell',
    damage:0,
    turns:2,
    durability:1,
    weight:4,
    effects:['guard'],
    image:'strike.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let holyBlade = {
    name:'Holy Blade',
    type:'attack',
    damage:300,
    turns:0,
    durability:1,
    weight:3,
    effects:['healSelf-300'],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let shieldStrike = {
    name:'Shield Strike',
    type:'attack',
    damage:300,
    turns:1,
    durability:1,
    weight:3,
    effects:['guardSelf'],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let demonCharge = {
    name:'Demon Charge',
    type:'attack',
    damage:400,
    turns:0,
    durability:2,
    weight:3,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        let dmg = get_damage(200,data.user,data.user)
        data.user.health-=dmg
        data.game.log(`${dmg} knockback damage`)
    },
    update:function(data){}
}
let covenantOfCarnage = {
    name:'Covenant of Carnage',
    type:'spell',
    damage:0,
    turns:3,
    durability:2,
    weight:4,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){
        if(data.self.turn_count<=0){
            data.user.health -= get_damage(400,data.user,data.user);
            data.target.health -= get_damage(400,data.user,data.target);
            data.game.log(`${data.user.name} took ${get_damage(400,data.user,data.user)} damage from ${data.self.name}`);
            data.game.log(`${data.target.name} took ${get_damage(400,data.user,data.target)} damage from ${data.self.name}`);
        }else{
            if(data.self.turn_count%1==0){
                data.game.log(`${data.self.turn_count} turns of ${data.self.name} remaining`);
            }
           
        }
    }
}
let mirrorMatch = {
    name:'Mirror Match',
    type:'spell',
    damage:0,
    turns:0,
    durability:1,
    weight:1,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        if(target.lastmoveused && target.lastmoveused.name !== 'Mirror Match'){
            let move_to_copy = target.lastmoveused;
            moveObjects.forEach(obj=>{
                if(obj.name==move_to_copy.name){
                    let copied_move = new move(obj)
                    function get_selected_values(move){
                        let selected_values=[]
                        if(move.prompt_data.type){
                            let arr = []
                            if(move.prompt_data.type=='select target moves'){
                                arr =  target.moves.map((_, i) => i)
                            }else if(move.prompt_data.type=='select moves'){
                                arr = user.moves.map((_, i) => i)
                            }
                            for(let i=0;i<user.moves[num].prompt_data.amount;i++){
                                let m = Math.floor(Math.random() * arr.length)
                                selected_values.push(m)
                                arr.splice(m,1)
                            }
                            return selected_values
                        }else{
                            return []
                        }
                    }
                    let p_data ={
                        user:user,target:target,game:data.game,self:copied_move,
                        prompt_info:{
                            selected_values:get_selected_values(copied_move)
                        },
                    }
                    copied_move.use(p_data);
                }
            })
        }else{
            data.game.log(`No move to copy or last move was Mirror Match!`);
        }
    },
    update:function(data){}
}
let powerUp = {
    name:'Power Up',
    type:'spell',
    damage:0,
    turns:5,
    durability:3,
    weight:2,
    effects:['attack_buff-100'],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let beastMode = {
    name:'Beast Mode',
    type:'spell',
    damage:0,
    turns:3,
    durability:3,
    weight:2,
    effects:['attack_buff-200'],
    image:'strike.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}
let banefulBinding = {
    name:'Baneful Binding',
    type:'spell',
    damage:0,
    turns:2,
    durability:2,
    weight:2,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select one card',type:'select target move',amount:1},
    onhit:function(data){
        if(data.user.type=='cpu'){
            let rand = Math.floor(Math.random() * data.target.moves.length)
            data.self.temp_data.rand = rand
            data.target.moves[rand].isenabled=false
            data.game.log(`${data.target.name}'s move ${data.target.moves[rand].name} is disabled`)
        }else{
             data.target.moves[data.self.prompt_info.selected_values[0]].isenabled=false
              data.game.log(`${data.target.name}'s move ${ data.target.moves[data.self.prompt_info.selected_values[0]].name} is disabled`)
        }
    },
    update:function(data){
        if(data.self.turn_count<=0){
            if(data.user.type=='player'){
                 if( data.target.moves[data.self.prompt_info.selected_values[0]]){
                    data.target.moves[data.self.prompt_info.selected_values[0]].isenabled=true
                    data.game.log(`${data.target.name}'s move ${ data.target.moves[data.self.prompt_info.selected_values[0]].name} is enabled`)
                }
            }
            if(data.user.type=='cpu'){
                if(data.target.moves[data.self.temp_data.rand]){
                    data.target.moves[data.self.temp_data.rand].isenabled=true
                    data.game.log(`${data.target.name}'s move ${data.target.moves[data.self.temp_data.rand].name} is enabled`)
                }
               
            }
        }
    }
}
let repair = {
    name:'Repair',
    type:'spell',
    damage:0,
    turns:0,
    durability:3,
    weight:1,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select one card',type:'select move',amount:1},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        let num = 0
        if(user.type=='player'){
            num = data.prompt_info.selected_values[0]
        }else{
            num = Math.floor(Math.random() * (user.moves.length - 2)) + 2
        }
        user.moves[num].durability =  user.moves[num].durability_ref
        user.moves[num].isenabled = true
        game_instance.log(`${user.name}'s move ${user.moves[num].name} is restored`);
    },
    update:function(data){}
}
let attackUp = {
    name:'Attack Up',
    type:'spell',
    damage:0,
    turns:0,
    durability:3,
    weight:1,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select one card',type:'select move',amount:1},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        let num = 0
        if(user.type=='player'){
            num = data.prompt_info.selected_values[0]
        }else{
            num = Math.floor(Math.random() * options.length)
        }
        user.moves[num].damage+=200
        game_instance.log(`${user.name}'s move ${user.moves[num].name} damage increased`);
    },
    update:function(data){}
}
let speedBullet = {
    name:'Speed Bullet',
    type:'attack',
    damage:200,
    turns:0,
    durability:10,
    weight:2,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}

let fusionXyz = {
    name: 'fusion xyz',
    type:'spell',
    damage:0,
    turns:0,
    durability:1,
    weight:2,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select two moves',type:'select move',amount:2},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        let num = 0
        let num2 = 0
        if(user.type=='player'){
            num = data.prompt_info.selected_values[0];
            num2 = data.prompt_info.selected_values[1];
        }else{
            num = Math.floor(Math.random() * user.moves.length)
            num2 = Math.floor(Math.random() * user.moves.length)
        }
        function get_selected_values(move){
            let selected_values=[]
            if(move.prompt_data.type){
                let arr = []
                if(move.prompt_data.type=='select target moves'){
                    arr =  target.moves.map((_, i) => i)
                }else if(move.prompt_data.type=='select moves'){
                    arr = user.moves.map((_, i) => i)
                }
                for(let i=0;i<user.moves[num].prompt_data.amount;i++){
                    let m = Math.floor(Math.random() * arr.length)
                    selected_values.push(m)
                    arr.splice(m,1)
                }
                return selected_values
               
            }else{
                return []
            }
        }
        
        
        let p_data ={
            user:user,target:target,game:game_instance,self:user.moves[num],
            prompt_info:{
                selected_values:get_selected_values(user.moves[num])
            },
        }
        let p_data2 ={
            user:user,target:target,game:game_instance,self:user.moves[num2],
            prompt_info:{
                selected_values:get_selected_values(user.moves[num2])
            },
        }
        user.moves[num].use(p_data)
        if(num2!=num){
            if(user.moves[num].type=='attack'&&user.moves[num2].type=='attack'){
                game_instance.log('cannot use 2 attacks')
            }else{
                user.moves[num2].use(p_data2)
            }
        }
    },
    update:function(data){}
}

let malevonentArmor = {
    name: 'Malevonent Armor',
    type:'spell',
    damage:0,
    turns:2,
    durability:2,
    weight:2,
    effects:['thorns'],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}

let angelGuard = {
    ...moveTemplate,
    name: 'Angel Guard',
    type:'spell',
    turns:1,
    durability:1,
    weight:3,
    effects:['heal-300','guard'],
}

let gallantBastion = {
    name: 'Gallant Bastion',
    type:'attack',
    damage:200,
    turns:1,
    durability:3,
    weight:2,
    effects:['guardSelf'],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){},
    update:function(data){}
}

let guardBreaker = {
    name: 'Guard Breaker',
    type:'attack',
    damage:200,
    turns:0,
    durability:3,
    weight:2,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        let index = data.target.status_effects.indexOf('guard');
        if (index > -1) {
            data.target.status_effects.splice(index, 1);
            data.game.log(`${data.target.name}'s guard has been removed`);
        }
    },
    update:function(data){}
}

let devilsImprecation = {
    ...moveTemplate,
    name: 'Devils Imprecation',
    type:'attack',
    damage:500,
    turns:0,
    durability:2,
    weight:3,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        data.user.health-=300
        data.game.log('300 knockback damage')
    },
    update:function(data){}
}

let soulDrain = {
    name: 'Soul Drain',
    type:'spell',
    damage:0,
    turns:0,
    durability:3,
    weight:3,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        data.target.health-=300
        data.game.log(`${data.target.name}'s health was drained`)
    },
    update:function(data){}
}

let dragonForce = {
    name: 'Dragon Force',
    type:'attack',
    damage:300,
    turns:0,
    durability:3,
    weight:3,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        if(data.target.lastmoveused){
            if(data.target.lastmoveused.type=='spell'){
                let dmg = get_damage(100,data.user,data.target);
                data.target.health -= dmg
                data.game.log(`${dmg} extra damage`)
            }
        }
    },
    update:function(data){}
}

let shadowBall = {
    ...moveTemplate,
    name: 'Shadow Ball',
    type:'attack',
    damage:300,
    turns:1,
    durability:2,
    weight:3,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        if(data.target.lastmoveused){
            data.target.lastmoveused.isenabled=false
            data.self.temp_data.selected_move =  data.target.lastmoveused
            data.game.log(`${data.target.lastmoveused.name} is disabled`)
        }
    },
    update:function(data){
        if(data.self.turn_count==0){
            data.self.temp_data.selected_move.isenabled=true
        }
    }
}

let crimsonOverdrive = {
    ...moveTemplate,
    name: 'Crimson Overdrive',
    type:'spell',
    damage:0,
    turns:0,
    durability:1,
    weight:0,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select one card',type:'select move',amount:1},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        let num = 0
        if(user.type=='player'){
            num = data.prompt_info.selected_values[0]
        }else{
            num = Math.floor(Math.random() * user.moves.length)
        }
        user.moves[num].damage+=400
        if(user.moves[num].durability>0){
            user.moves[num].durability=1
        }
        data.game.log(`${data.user.name}'s move ${data.user.moves[num].name} damage increased`);
    },
    update:function(data){}
}

let chaosFist = {
    name: 'Chaos Fist',
    type:'attack',
    damage:100,
    turns:0,
    durability:6,
    weight:1,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        data.self.damage+=100
        data.game.log(`${data.self.name} power increased to ${data.self.damage}`);
    },
    update:function(data){}
}

let darkBlade = {
    name: 'Dark Blade',
    type:'attack',
    damage:300,
    turns:1,
    durability:1,
    weight:3,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        data.target.moves.forEach(move=>{
            if(move.type=='spell'){
                 move.isenabled=false
            }
        })
        data.game.log(`${data.target.name}'s' spell moves are disabled`)
    },
    update:function(data){
        if(data.self.turn_count==0){
            data.target.moves.forEach(move=>{
                if(move.type=='spell'){
                     move.isenabled=true
                }
            })
            data.game.log(`${data.target.name}'s' spell moves are enabled`)
        }
    }
}

let phantomDomain = {
    name: 'Phantom Domain',
    type:'spell',
    damage:0,
    turns:1,
    durability:2,
    weight:2,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        data.target.moves.forEach((move,index)=>{
            if(index>1){
                move.isenabled=false
            }
        })
        data.game.log(`${data.target.name}'s' moves are disabled`)
    },
    update:function(data){
        if(data.self.turn_count==0){
            data.target.moves.forEach(move=>{
                move.isenabled=true
            })
            data.game.log(`${data.target.name}'s' moves are enabled`)
        }
    }
}

let eternalEcho = {
    name: 'Eternal Echo',
    type:'spell',
    damage:0,
    turns:0,
    durability:3,
    weight:1,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select one card',type:'select move',amount:1},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        let num = 0
        if(user.type=='player'){
            num = data.prompt_info.selected_values[0]
        }else{
            num = Math.floor(Math.random() * user.moves.length)
        }
        user.moves[num].turns+=1
        game_instance.log(`${user.name}'s move ${user.moves[num].name} effect duration increased`);
    },
    update:function(data){}
}

let faustianBargain = {
    name: 'Faustian Bargain',
    type:'spell',
    damage:0,
    turns:0,
    durability:1,
    weight:2,
    effects:[],
    image:'move.png',
    prompt_data:{message:'select 4 moves',type:'select move',amount:4},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        if(user.type=='player'){
            let attack_power=0
            let selectedSet = new Set(data.prompt_info.selected_values);
            user.moves = user.moves.filter((move, index) => {

                if (!selectedSet.has(index)) return true;

                if (move.type == 'attack') {
                    attack_power += 100;
                }

                if (move.type == 'spell') {
                    user.health += 200;
                    game_instance.log(`${user.name} healed 200 health`);
                }

                return false; // remove
            });
            user.status_effects.push(`attack_buff-${attack_power}`);
            game_instance.log(`${user.name} gained ${attack_power} atk`)
        }else{
            let attack_power = 0;

            user.moves = user.moves.filter((move, index) => {

                // only affect first 4 slots
                if (index >= 4) return true;

                if (move.type === 'attack') {
                    attack_power += 100;
                    return false; // remove move
                }

                if (move.type === 'spell') {
                    user.health += 200;
                    game_instance.log(`${user.name} healed 200 health`);
                    return false; // remove move
                }

                return true; // keep everything else
            });

            if (attack_power > 0) {
                user.status_effects.push(`attack_buff-${attack_power}`);
                game_instance.log(`${user.name} gained ${attack_power} atk`);
            }
        }
    },
    update:function(data){}
}

let necromanticInvokation = {
    name:'Necromantic Invocation',
    type:'spell',
    damage:0,
    turns:0,
    durability:2,
    weight:1,
    effects:[],
    image:'move.png',
    prompt_data:{},
    onhit:function(data){
        let user = data.user 
        let target = data.target
        let game_instance = data.game
        let exhausted_moves = []
        for(let i=0;i<user.moves.length;i++){
            if(user.moves[i].durability<=0){
                exhausted_moves.push(user.moves[i])
            }
        }
        if(exhausted_moves.length<1){
            game_instance.log('no moves to select')
            return
        }
        let num = Math.floor(Math.random() * exhausted_moves.length)
        exhausted_moves[num].durability +=  1
        exhausted_moves[num].isenabled = true
        let pdata = get_prompt_info(user,target,game_instance,exhausted_moves[num])
        exhausted_moves[num].use(user,target,game_instance,pdata)
    },
    update:function(data){}
}

let moveObjects = [
    strike,
    replenish,
    blastCannon,
    heal,
    forceField,
    holyBlade,
    shieldStrike,
    demonCharge,
    covenantOfCarnage,
    mirrorMatch,
    powerUp,
    banefulBinding,
    repair,
    attackUp,
    speedBullet,
    fusionXyz,
    beastMode,
    malevonentArmor,
    angelGuard,
    gallantBastion,
    guardBreaker,
    devilsImprecation,
    soulDrain,
    dragonForce,
    shadowBall,
    crimsonOverdrive,
    chaosFist,
    darkBlade,
    phantomDomain,
    eternalEcho,
    faustianBargain,
    necromanticInvokation
]

zbattle_moves = [
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
    'Speed Bullet',
    'Gallant Bastion',
    'Guard Breaker',
    'Devils Imprecation',
    'Soul Drain',
    'Dragon Force',
    'Shadow Ball',
    'Crimson Overdrive',
    'Chaos Fist',
    'Dark Blade',
    'Phantom Domain',
    'Eternal Echo',
    'Faustian Bargain',
    'Necromantic Invocation'
]

function test_game(){
    let game ={
        log:function(text){console.log(text)}
    }
    let player1={
        lastDamageReceived:0,
        health:500,
        name:'layer 1',
        status_effects:[]
    }
    let strike_instance = new move(strike)
    let replenish_instance = new move(replenish)
    let force_inst = new move(heal)
    let power = new move(powerUp)
    let chrge = new move(demonCharge)
    let data = {
        user:player1,target:player1,game:game
    }
    power.use(data)
    strike_instance.use(data)
    replenish_instance.use(data)
    force_inst.use(data)
    strike_instance.use(data)
    chrge.use(data)
    strike_instance.update()
    replenish_instance.update()
    force_inst.update()
}