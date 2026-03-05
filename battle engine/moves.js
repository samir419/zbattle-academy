class move {
    constructor(name, type, damage=0, healing=0,turns, durability=1, weight=1, effects,img,prompt_data,onhit,onupdate){
        this.name = name;
        this.type = type;
        this.damage = damage;
        this.healing = healing;
        this.turns = turns; // number of turns the move lasts
        this.turn_count = 0;
        this.durability = durability;
        this.durability_ref = durability;
        this.weight = weight;
        this.effects = effects; // e.g., ['stun', 'poison']
        this.img = img? img:'move.png';
        this.onhit = onhit;
        this.onupdate = onupdate;
        this.isactive = false;
        this.isenabled = true;
        this.user = null;
        this.target = null;
        this.target_moves = [];
        this.prompt_data=prompt_data;
        this.prompt_info;
        this.temp_data={}
        this.elem = null;
        this.data
    }
    use(data){
        this.data=data
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
        this.target_moves = [...user.moves, ...target.moves];
        //this.prompt_info=prompt_info
        game_instance.log(`${user.name} used ${this.name}`);
        let dmg = this.calc_damage(user,target);
        target.health -= dmg
        target.lastDamageReceived = dmg
        user.health += this.healing;
        if(this.damage>0){
            game_instance.log(`${target.name} took ${dmg} damage`);
        }
        if(this.healing>0){
            game_instance.log(`${user.name} healed ${this.healing} health`);
        }
        if(this.elem && this.elem.children[1]){
            this.elem.children[1].textContent = `${this.name} (${this.durability})`
        }
        this.onhit(data);
    }
    calc_damage(user,target){
        let damage = this.damage;
        if(target.status_effects.includes('invulnerable')){
            return damage = 0;
        }
        if(user.status_effects.find(effect => effect.startsWith('attack_buff'))){
            let [keyword, value] = user.status_effects.find(effect => effect.startsWith('attack_buff')).split('-');
            value = Number(value);
           damage = Math.floor(this.damage+value);
        }
         if(user.status_effects.includes('attack_buff2')){
           damage = Math.floor(this.damage+200);
        }
        if(target.status_effects.includes('guard')){
            damage = Math.floor(this.damage/2);
        }
        if(target.status_effects.includes('thorns')){
            user.health-=damage;
            this.data.game.log(`${user.name} received ${damage} thorn damage`)
        }
        return damage;
    }
    update(){
        if(this.isactive && this.turn_count>0){
            this.turn_count -= 1;
            if(this.onupdate){
                this.onupdate(this.data)
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

function guard_update(data){
    if(data.self.turn_count==0){
        let index = data.user.status_effects.indexOf('guard');
        if (index > -1) {
        data.user.status_effects.splice(index, 1);
        data.game.log(`${data.user.name} is no longer guarded`);
        }
    }
}
function attack_buff_update(data){
    if (data.self.turn_count == 0) {

        let index = data.user.status_effects.findIndex(
            effect => effect.startsWith('attack_buff-')
        );

        if (index > -1) {
            data.user.status_effects.splice(index, 1);
            log(`${data.user.name} is no longer empowered`);
        }
    }
}
function attack_buff2_update(data){
    if(data.self.turn_count==0){
        let index = data.user.status_effects.indexOf('attack_buff2');
        if (index > -1) {
            data.user.status_effects.splice(index, 1);
            log(`${data.user.name} is no longer empowered`);
        }
    }
}

function get_damage(dmg, user, target) {
    let damage = dmg;

    // Invulnerability check
    if (target.status_effects.includes('invulnerable')) {
        return 0;
    }

    // Dynamic attack buff (attack buff-XXX)
    let attackBuff = user.status_effects.find(
        effect => effect.startsWith('attack buff-')
    );

    if (attackBuff) {
        let value = Number(attackBuff.split('-')[1]);
        damage += value;
    }

    // Guard halves final damage
    if (target.status_effects.includes('guard')) {
        damage = Math.floor(damage / 2);
    }

    // Thorns reflects final damage
    if (target.status_effects.includes('thorns')) {
        user.health -= damage;
    }

    console.log(damage);
    return Math.floor(damage);
}

const moves = [
    new move(
        'Strike',        // move_name
        'attack',      // type
        300,             // damage
        0,               // healing
        0,                // turns
        5,              // durability
        3,               // weight
        [],              // effects
        'strike.png',    //image
         {msg:'strike prompt data'},            //prompt data
        function(data) {  // onhit
            return;
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'Replenish',        // move_name
        'spell',      // type
        0,             // damage
        500,               // healing
        0,                // turns
        1,              // durability
        5,               // weight
        [],              // effects
        'spell.png',    //image
         {},            //prompt data
        function(data) {  // onhit
            return;
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'Blast Cannon',        // move_name
        'attack',      // type
        500,             // damage
        0,               // healing
        0,                // turns
        1,              // durability
        5,               // weight
        [],              // effects
        'move.png',    //image
         {},            //prompt data
        function(data) {  // onhit
            return;
        },
        function(data) {  // update
            return;
        }
    ),
    new move(
        'Heal',        // move_name
        'spell',       // type
        0,              // damage
        350,          // healing
        0,              // turns
        2,             // durability
        3,                // weight
        [],             // effects
         'spell.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            return;
        },
        function(data) {  // update
           return;
        }
    ),
    new move(
        'Force Field',        // move_name
        'spell',       // type
        0,              // damage
        0,              // healing
        2,              // turns
        1,             // durability
        4,                // weight
        ['guard'],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.user.status_effects.push('guard');
        },
        function(data) {  // update
                guard_update(data)
            }
    ),
    new move(
        'Holy Blade',        // move_name
        'attack',       // type
        300,              // damage
        300,              // healing
        0,              // turns
        1,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            return;
        },
        function(data) {  // update
           return;
        }
    ),
     new move(
        'Demon Charge',        // move_name
        'attack',       // type
        400,              // damage
        0,              // healing
        0,              // turns
        3,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.user.health-=200
            data.game.log('200 knockback damage')
        },
        function(data) {  // update
           return;
        }
    ),
    new move(
        'Shield Strike',        // move_name
        'attack',       // type
        300,              // damage
        0,              // healing
        1,              // turns
        1,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
         function(data) {   // onhit
            data.user.status_effects.push('guard');
        },
        function(data) {  // update
                guard_update(data)
        }
    ),
     new move(
        'Covenant of Carnage',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        3,                // turns
        2,              // durability
        4,               // weight
        [],              // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {  // onhit
            return;
        },
        function(data) {  // update
            if(data.self.turn_count<=0){
                data.self.damage = 400;
                data.user.health -= self.calc_damage(data.user,data.user);
                data.target.health -= self.calc_damage(data.user,data.target);
                log(`${data.user.name} took ${self.calc_damage(data.user,data.user)} damage from ${data.self.name}`);
                log(`${data.target.name} took ${data.self.calc_damage(data.user,data.target)} damage from ${data.self.name}`);
                data.self.damage = 0;
            }else{
                if(data.self.turn_count%1==0){
                    log(`${data.self.turn_count} turns of ${data.self.name} remaining`);
                }
               
            }
        }
    ),
    new move(
        'Mirror Match',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        1,              // durability
        1,               // weight
        [],              // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {  // onhit
            let user = data.user 
            let target = data.target
            if(target.lastmoveused && target.lastmoveused.name !== 'Mirror Match'){
                let move_to_copy = target.lastmoveused;
                let copied_move = new move(
                    move_to_copy.name,
                    move_to_copy.type,
                    move_to_copy.damage,
                    move_to_copy.healing,
                    move_to_copy.turns,
                    move_to_copy.durability_ref,
                    move_to_copy.weight,
                    move_to_copy.effects,
                    null,
                    move_to_copy.prompt_data,
                    move_to_copy.onhit,
                    move_to_copy.onupdate
                );
                data.prompt_info={
                    selected_value:Math.floor(Math.random() * user.moves.length),
                    selected_values:[Math.floor(Math.random() * user.moves.length),Math.floor(Math.random() * user.moves.length)]
                }
                copied_move.use(data);
            }else{
                log(`No move to copy or last move was Mirror Match!`);
            }
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'Power Up',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        5,                // turns
        5,              // durability
        1,               // weight
        [],              // effects
         'move.png',    //image
         {},            //prompt data
        function(data) {  // onhit
            data.user.status_effects.push('attack_buff-100');
        },
        function(data) {  // update
            attack_buff_update(data)
        }
    ),
     new move(
        'Baneful Binding',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        2,                // turns
        3,              // durability
        2,               // weight
        [],              // effects
         'move.png',    //image
         {msg:'select opponent move',type:'move select',},            //prompt data
        function(data) {  // onhit
            (async () => {
                let user = data.user 
                let target = data.target
                let game_instance = data.game

                let state_ref = game_instance.state
                game_instance.state = 'wait'
                let options = []
                target.moves.forEach(move => {options.push(move.name)})
                let num = 0
                if(user.type=='player'){
                    num = data.propmpt_info.selected_value
                }else{
                    num = Math.floor(Math.random() * options.length)
                }
                target.moves[num].isenabled = false;
                if(target.moves[num].elem){
                     target.moves[num].elem.style.backgroundColor='grey'
                }
                target.status_effects.push('move_disabled');
                log(`${target.name}'s move ${target.moves[num].name} is now disabled`);
                game_instance.state='running'
            })();
        },
        function(data) {  // update
            if(data.self.turn_count==0){
                data.target.moves.forEach(m => {
                    m.isenabled = true;
                    if(m&&m.elem){
                        m.elem.style.backgroundColor=null
                    }
                    
                });
                data.target.status_effects = data.target.status_effects.filter(se => se !== 'move_disabled');
                data.game.log(`${target.name}'s moves are now enabled`);
            }
        }
    ),
    /**  new move(
        'Energy Ball',        // move_name
        'attack',      // type
        0,             // damage
        0,               // healing
        1,                // turns
        1,              // durability
        4,               // weight
        [],              // effects
         'move.png',    //image
        function(user, target,game_instance) {  // onhit
            user.status_effects.push('invulnerable');
            log(`${user.name} is now invulnerable for 1 turn`);
        },
        function(self, user, target, moves) {  // update
           
            if(self.turn_count==0){
                self.damage = 400
                target.health -= self.calc_damage(user,target);
                log(`${target.name} took ${self.calc_damage(user,target)} damage from ${self.name}`);
                self.damage = 0;
                let index = user.status_effects.indexOf('invulnerable');
                if (index > -1) {
                user.status_effects.splice(index, 1);
                log(`${user.name} is no longer invulnerable`);
                }
                //skip player turn
                if(game.state=='1'){
                    game.state='2'
                }else{
                    game.state='1'
                }
            }
        }
    ),*/
     new move(
        'Repair',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        3,              // durability
        3,               // weight
        [],              // effects
         'spell.png',    //image
          {message:'select your move',type:'player move select'},            //prompt data
        function(data) {  // onhit
            (async () => {
                let user = data.user 
                let target = data.target
                let game_instance = data.game
                let state_ref = game_instance.state
                game_instance.state = 'wait'
                 let options = []
                user.moves.forEach(move => {options.push(move.name)})
                let num = 0
                if(user.type=='player'){
                    num = data.prompt_info.selected_value
                }else{
                    num = Math.floor(Math.random() * options.length)
                }
                user.moves[num].durability =  user.moves[num].durability_ref
                user.moves[num].isenabled = true
                if( user.moves[num].elem){
                     user.moves[num].elem.style.backgroundColor = null
                }
               
                game_instance.log(`${user.name}'s move ${user.moves[num].name} is restored`);
                game_instance.state='running'
                
            })();
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'Attack Up',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        3,              // durability
        2,               // weight
        [],              // effects
         'move.png',    //image
          {message:'select your move',type:'player move select'},            //prompt data
        function(data) {  // onhit
            (async () => {
                let user = data.user 
                let target = data.target
                let game_instance = data.game
                let state_ref = game_instance.state
                game_instance.state = 'wait'
                 let options = []
                user.moves.forEach(move => {options.push(move.name)})
                let num = 0
                if(user.type=='player'){
                    num = data.prompt_info.selected_value
                }else{
                    num = Math.floor(Math.random() * options.length)
                }
                user.moves[num].damage+=200
                if( user.moves[num].elem){
                     user.moves[num].elem.style.backgroundColor = 'orange'
                }
               
                log(`${user.name}'s move ${user.moves[num].name} damage increased`);
                game_instance.state='running'
                
            })();
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'fusion xyz',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        1,              // durability
        1,               // weight
        [],              // effects
         'move.png',    //image
        {message:'select two moves',type:'player move select multiple',amount:2},            //prompt data
        async function(data) {  // onhit
            let user = data.user 
            let target = data.target
            let game_instance = data.game
            let state_ref = game_instance.state
            //game_instance.state = 'wait'
                let options = []
            user.moves.forEach(move => {options.push(move.name)})
            let num = 0
            let num2 = 0
            if(user.type=='player'){
                num = data.prompt_info.selected_values[0];
                num2 = data.prompt_info.selected_values[1];
            }else{
                num = Math.floor(Math.random() * 6)
                num2 = Math.floor(Math.random() * 6)
            }
            let p_data ={
                user:user,target:target,game:game_instance,
                prompt_info:{
                    selected_value:Math.floor(Math.random() * user.moves.length),
                    selected_values:[Math.floor(Math.random() * user.moves.length),Math.floor(Math.random() * user.moves.length)]
                },

            }
            user.moves[num].use(p_data)
            if(num2!=num){
                user.moves[num2].use(p_data)
            }
            game_instance.state='running'
                
           
        },
        function(data) {  // update
            return;
        }
    ),
    new move(
        'Beast Mode',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        3,                // turns
        2,              // durability
        2,               // weight
        [],              // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {  // onhit
            data.user.status_effects.push('attack_buff-200');
        },
        function(data) {  // update
            attack_buff_update(data)
        }
    ),
      new move(
        'Malevonent Armor',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        2,                // turns
        2,              // durability
        2,               // weight
        ['thorns'],              // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {  // onhit
            data.user.status_effects.push('thorns');
        },
        function(data) {  // update
            if(data.self.turn_count==0){
                let index = data.user.status_effects.indexOf('thorns');
                if (index > -1) {
                data.user.status_effects.splice(index, 1);
                log(`${data.user.name} is no longer thorn`);
                }
            }
        }
    ),
     new move(
        'Angel Guard',        // move_name
        'spell',       // type
        0,              // damage
        300,              // healing
        1,              // turns
        1,             // durability
        3,                // weight
        ['guard'],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.user.status_effects.push('guard');
        },
        function(data) {  // update
                guard_update(data)
            }
    ),
     new move(
        'Speed Bullet',        // move_name
        'attack',      // type
        200,             // damage
        0,               // healing
        0,                // turns
        10,              // durability
        2,               // weight
        [],              // effects
        'strike.png',    //image
         {},            //prompt data
        function(data) {  // onhit
            return;
        },
        function(data) {  // update
            return;
        }
    ),
      new move(
        'Gallant Bastion',        // move_name
        'attack',       // type
        200,              // damage
        0,              // healing
        1,              // turns
        2,             // durability
        2,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
         function(data) {   // onhit
            data.user.status_effects.push('guard');
        },
        function(data) {  // update
                guard_update(data)
        }
    ),
        new move(
        'Guard Breaker',        // move_name
        'attack',       // type
        200,              // damage
        0,              // healing
        1,              // turns
        2,             // durability
        2,                // weight
        [],             // effects
         'strike.png',    //image
          {},            //prompt data
         function(data) {   // onhit
            let index = data.target.status_effects.indexOf('guard');
            if (index > -1) {
                data.target.status_effects.splice(index, 1);
                data.game.log(`${data.target.name}'s guard has been removed`);
            }
        },
        function(data) {  // update
          return
        }
    ),
     new move(
        'Devils Imprecation',        // move_name
        'attack',       // type
        500,              // damage
        0,              // healing
        0,              // turns
        3,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.user.health-=300
            data.game.log('300 knockback damage')
        },
        function(data) {  // update
           return;
        }
    ),
    new move(
        'Soul Drain',        // move_name
        'spell',       // type
        0,              // damage
        0,              // healing
        0,              // turns
        3,             // durability
        3,                // weight
        [],             // effects
         'spell.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.target.health-=300
            data.game.log(`${data.target.name}'s health was drained`)
        },
        function(data) {  // update
           return;
        }
    ),
    new move(
        'Dragon Force',        // move_name
        'attack',       // type
        300,              // damage
        0,              // healing
        0,              // turns
        3,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            if(data.target.lastmoveused){
                if(data.target.lastmoveused.type=='spell'){
                    let dmg = get_damage(100,data.user,data.target);
                    data.target.health -= dmg
                    data.game.log(`${dmg} extra damage`)
                }
            }
            
        },
        function(data) {  // update
           return;
        }
    ),
    new move(
        'Shadow Ball',        // move_name
        'attack',       // type
        300,              // damage
        0,              // healing
        1,              // turns
        2,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            if(data.target.lastmoveused){
                data.target.lastmoveused.isenabled=false
                data.self.temp_data.selected_move =  data.target.lastmoveused
                data.game.log(`${data.target.lastmoveused.name} is disabled`)
            }
            
        },
        function(data) {  // update
            if(data.self.turn_count==0){
                data.self.temp_data.selected_move.isenabled=true
            }
        }
    ),
     new move(
        'Crimson Overdrive',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        2,              // durability
        3,               // weight
        [],              // effects
         'move.png',    //image
          {message:'select your move',type:'player move select'},            //prompt data
        function(data) {  // onhit
            (async () => {
                let user = data.user 
                let target = data.target
                let game_instance = data.game
                let state_ref = game_instance.state
                game_instance.state = 'wait'
                 let options = []
                user.moves.forEach(move => {options.push(move.name)})
                let num = 0
                if(user.type=='player'){
                    num = data.prompt_info.selected_value
                }else{
                    num = Math.floor(Math.random() * options.length)
                }
                user.moves[num].damage+=400
                if(user.moves[num].durability>0){
                    user.moves[num].durability=1
                }
                
               
                data.game.log(`${data.user.name}'s move ${data.user.moves[num].name} damage increased`);
                game_instance.state='running'
                
            })();
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'Chaos Fist',        // move_name
        'attack',       // type
        100,              // damage
        0,              // healing
        0,              // turns
        10,             // durability
        1,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.self.damage+=100
        },
        function(data) {  // update
           return
        }
    ),
     new move(
        'Dark Blade',        // move_name
        'attack',       // type
        300,              // damage
        0,              // healing
        1,              // turns
        2,             // durability
        3,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.target.moves.forEach(move=>{
                if(move.type=='spell'){
                     move.isenabled=false
                }
               
            })
            data.game.log(`${data.target.name}'s' spell moves are disabled`)
            
        },
        function(data) {  // update
            if(data.self.turn_count==0){
                data.target.moves.forEach(move=>{
                    if(move.type=='spell'){
                         move.isenabled=true
                    }
                   
                })
                data.game.log(`${data.target.name}'s' spell moves are enabled`)
            }
        }
    ),
      new move(
        'Phantom Domain',        // move_name
        'spell',       // type
        0,              // damage
        0,              // healing
        1,              // turns
        2,             // durability
        4,                // weight
        [],             // effects
         'move.png',    //image
          {},            //prompt data
        function(data) {   // onhit
            data.target.moves.forEach(move=>{
                if(move.name!='attack'||move.name!='defend'){
                    move.isenabled=false
                }
               
            })
            data.game.log(`${data.target.name}'s' moves are disabled`)
            
        },
        function(data) {  // update
            if(data.self.turn_count==0){
                data.target.moves.forEach(move=>{
                    move.isenabled=true
                })
                data.game.log(`${data.target.name}'s' moves are enabled`)
            }
        }
    ),
    new move(
        'Eternal Echo',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        3,              // durability
        1,               // weight
        [],              // effects
         'move.png',    //image
          {message:'select your move',type:'player move select'},            //prompt data
        function(data) {  // onhit
            (async () => {
                let user = data.user 
                let target = data.target
                let game_instance = data.game
                let state_ref = game_instance.state
                game_instance.state = 'wait'
                 let options = []
                user.moves.forEach(move => {options.push(move.name)})
                let num = 0
                if(user.type=='player'){
                    num = data.prompt_info.selected_value
                }else{
                    num = Math.floor(Math.random() * options.length)
                }
                user.moves[num].turns+=1
                game_instance.log(`${user.name}'s move ${user.moves[num].name} effect duration increased`);
                game_instance.state='running'
            })();
        },
        function(data) {  // update
            return;
        }
    ),
     new move(
        'Faustian Bargain',        // move_name
        'spell',      // type
        0,             // damage
        0,               // healing
        0,                // turns
        1,              // durability
        1,               // weight
        [],              // effects
         'move.png',    //image
        {message:'select 4 moves',type:'player move select multiple',amount:4},            //prompt data
        async function(data) {  // onhit
            let user = data.user 
            let target = data.target
            let game_instance = data.game
            let state_ref = game_instance.state
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
                    user.status_effects.push(`attack buff-${attack_power}`);
                    game_instance.log(`${user.name} gained ${attack_power} atk`);
                }
            }
        },
        function(data) {  // update
            return;
        }
    ),
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
    'Faustian Bargain'
]