
let cpu
let cpu_state


let player_data = {
    name: 'base player',
    moves: ['Strike', 'Replenish', 'Blast Cannon', 'Force Field'],
    img: 'assets/profiles/blake.jpg',
    type: 'player',
    team: 'none'
}
class Game {
    constructor() {
        this.players = []
        this.player_queue = []
        this.current_turn = 0;
        this.current_player;
        this.current = 0
        this.state = 'wait'; // 'waiting', 'in_progress', 'finished'
        this.format = 'free for all'
        this.team_data = {}
        this.ui = document.createElement('div')
        this.ui.id = 'game-ui'
        this.log_data = document.createElement('div')
        this.log_data.id = 'game-log'
        this.game_data = []
        this.event_handler
        document.getElementById('engine').append(this.ui, this.log_data)
        this.set_format()
    }
    log(message) {
        let msg = document.createElement('p')
        msg.textContent = message
        this.log_data.appendChild(msg);
        this.log_data.scrollTop = this.log_data.scrollHeight;
    }
    set_player(data) {
        let player = new Player(data)
        this.log(`new player: ${player.name}`)
        return player
    }
    set_format() {
        this.ui.innerHTML = ''
        let parent = document.createElement('div')
        let text = document.createElement('p')
        text.textContent = 'select format'
        let ffa = document.createElement('button'); ffa.className = 'primary'
        ffa.textContent = 'free for all'
        ffa.onclick = () => {
            this.format = 'free for all'
            this.prompt_players_select('add player 1')
        }
        let team = document.createElement('button'); team.className = 'primary'
        team.textContent = 'teams'
        team.onclick = () => {
            this.format = 'teams'
            this.prompt_players_select('add player 1')
        }
        parent.append(text, ffa, team)
        this.ui.append(parent)
    }
    prompt_players_select(msg) {
        this.ui.innerHTML = ''
        let parent = document.createElement('div')

        let text = document.createElement('p')
        text.textContent = msg

        let name = document.createElement('input')
        name.placeholder = 'player name'

        let image = document.createElement('input')
        image.placeholder = 'image url'

        let team = document.createElement('p')
        if (this.format == 'teams') {
            team = document.createElement('input')
            team.placeholder = 'team name'
        }

        let toggle_cpu = document.createElement("input");
        toggle_cpu.type = "checkbox";
        let label = document.createElement('label')
        label.textContent = 'cpu'

        let btn = document.createElement('button'); btn.className = 'primary'
        btn.textContent = 'add'
        btn.onclick = () => {
            let type
            if (toggle_cpu.checked) { type = 'cpu' } else { type = 'player' }
            let player = this.set_player({
                name: name.value ? name.value : `player ${this.players.length + 1}`, moves: [], type: type,
                img: image.value ? image.value : img_list[Math.floor(Math.random() * img_list.length)]
            })
            if (this.format == 'teams') {
                player.team = team.value
            }
            this.display_move_select(player)

        }
        parent.append(text, name, image, team, label, toggle_cpu, btn)
        if (this.players.length >= 2) {
            let finish = document.createElement('button'); finish.className = 'primary'
            finish.textContent = 'finish'
            finish.onclick = () => { this.start() }
            parent.appendChild(finish)
        }
        this.ui.append(parent)


    }
    display_move_select(player) {
        this.ui.innerHTML = ''
        let parent = document.createElement('div')
        let title = document.createElement('p')
        title.textContent = 'select moves'

        let finish = document.createElement('button'); finish.className = 'primary'
        finish.textContent = 'finish'
        finish.onclick = () => {
            this.players.push(player)
            this.prompt_players_select('add player 2')
        }

        let random = document.createElement('button'); random.className = 'primary'
        random.textContent = 'random'
        random.onclick = () => {
            let availableMoves = [...moves]; // copy so original stays intact
            for (let i = 0; i < 6 && availableMoves.length > 0; i++) {
                const index = Math.floor(Math.random() * availableMoves.length);
                const new_move = availableMoves.splice(index, 1)[0]; // remove it
                player.add_move(new_move);
            }
            this.players.push(player)
            console.log(this.players)
            this.prompt_players_select('add player 2')
        }

        let save = document.createElement('button');
        save.className = 'primary';
        save.textContent = 'save this moveset';

        save.onclick = () => {
            let move_arr = [];
            player.moves.forEach(move => {
                move_arr.push(move.name);
            });

            let saved_moves = localStorage.getItem('zbattle-saved-movesets');

            if (!saved_moves) {
                saved_moves = [];
            } else {
                saved_moves = JSON.parse(saved_moves);
            }

            saved_moves.push(move_arr);

            localStorage.setItem('zbattle-saved-movesets', JSON.stringify(saved_moves));
            alert('move set saved');
        };

        let move_set_list = document.createElement('div');
        move_set_list.className = 'moveset-list';

        let load = document.createElement('button');
        load.className = 'primary';
        load.textContent = 'load movesets';

        load.onclick = () => {
            move_set_list.innerHTML = ''; // clear old UI

            let saved_moves = localStorage.getItem('zbattle-saved-movesets');
            if (!saved_moves) {
                move_set_list.textContent = 'No saved movesets.';
                return;
            }

            saved_moves = JSON.parse(saved_moves);

            saved_moves.forEach((moveset, index) => {
                let card = document.createElement('div');
                card.className = 'moveset-card';

                let title = document.createElement('div');
                title.textContent = `Moveset ${index + 1}`;
                title.className = 'moveset-title';

                let list = document.createElement('ul');
                moveset.forEach(moveName => {
                    let li = document.createElement('li');
                    li.textContent = moveName;
                    list.appendChild(li);
                });

                let loadBtn = document.createElement('button');
                loadBtn.textContent = 'Load';
                loadBtn.className = 'secondary';

                loadBtn.onclick = () => {
                    // Clear current moves
                    player.moves = [];

                    // Rebuild moveset
                    moveset.forEach(moveName => {
                        let moveObj = moves.find(m => m.name === moveName);
                        // ^ assumes you have allMoves[] containing move objects

                        if (moveObj) {
                            player.add_move(moveObj)
                        }
                    });

                    alert('moveset loaded');
                };

                card.appendChild(title);
                card.appendChild(list);
                card.appendChild(loadBtn);
                move_set_list.appendChild(card);
            });
        };


        let div = document.createElement('div')
        for (let i = 0; i < moves.length; i++) {
            let btn = document.createElement('button'); btn.className = 'secondary'
            btn.textContent = moves[i].name
            btn.onclick = () => {
                player.add_move(moves[i])
                btn.style.backgroundColor = 'blue'
                btn.disabled = true
            }
            div.appendChild(btn)
        }
        parent.append(title, finish, random, save, load, move_set_list, div)
        this.ui.append(parent)
    }
    start() {
        this.log('game started')
        this.ui.innerHTML = ''
        this.players.forEach(play => {

            let move_data = []
            for (let i = 2; i < play.moves.length; i++) {
                move_data.push(play.moves[i].name)
            }
            this.game_data.push({
                name: play.name,
                moves: move_data,
                img: play.img,
                type: play.type,
                team: play.team
            })

            play.moves.forEach((m, index) => {
                play.weight += m.weight
            })
            this.player_queue.push(play)
            play.id = this.player_queue.length
            if (this.format == 'teams') {
                if (this.team_data[play.team]) {
                    this.team_data[play.team].push(play.id)
                } else {
                    this.team_data[play.team] = [play.id]
                }

            }
            let div = document.createElement('div'); div.className = 'player-div'; div.id = play.name
            let image = document.createElement('img'); image.className = 'player-image'; image.src = play.img
            let health = document.createElement('div'); health.className = 'player-health'
            let status = document.createElement('div'); status.className = 'player-status'
            let move_prompt = document.createElement('div'); move_prompt.className = 'move-prompt'
            let moves = document.createElement('div'); moves.className = 'move-div';
            let normals = document.createElement('div'); normals.className = 'normal-moves'
            if (play.type == 'player'||play.team=='boss') {
                for (let i = 0; i < play.moves.length; i++) {
                    let btn = document.createElement('button'); btn.className = 'move-btn'
                    let m = play.moves[i]
                    let image = document.createElement('img');image.className='move-img'
                    image.src = `battle engine/assets/moves/${m.img}`
                    btn.appendChild(image)
                    let txt = document.createElement('span')
                    txt.textContent=m.name
                    //btn.appendChild(txt)
                    btn.onclick = () => {
                        let prompt = play.elem.querySelector('.move-prompt')
                        prompt.innerHTML = `${m.name}`
                        this.player_queue.forEach(p => {
                            let btn = document.createElement('button');btn.className='secondary'
                            if (p.team == play.team && p.team != 'none') {
                                btn.style.backgroundColor = 'blue'
                            }
                            btn.textContent = p.name
                            btn.onclick = () => { this.play(play, p, m); prompt.innerHTML = `` }
                            prompt.appendChild(btn)
                        })

                    }
                    m.elem = btn
                    m.elem.title  = `name:${m.name}`
                    if (i > 1) {
                        moves.appendChild(btn)
                    } else {
                        btn.className = 'normal-btn'
                        btn.removeChild(btn.children[0])
                        btn.appendChild(txt)
                        normals.appendChild(btn)
                    }

                }
            }
            let profile_info = document.createElement('div'); profile_info.className = 'profile-info'
            profile_info.append(image, status)
            if(play.team=='boss'){div.className+=' boss-div'}
            div.append(profile_info, health, move_prompt, normals, moves)
            this.ui.appendChild(div)
            console.log(div)
            play.elem = div
            this.handle_cpu()
        })
        this.player_queue = this.sortPlayerQueue(this.player_queue)
        this.current_player = this.player_queue[this.current]
        this.state = 'running'
        this.log(`${this.current_player.name} turn`)
        this.update_ui()
    }
    update() {
        this.players.forEach(player => {
            if (this.current_player.id == player.id) {
                player.moves.forEach(move => {
                    move.update()
                })
            }

        })
    }
    play(user, target, move_instance) {
        if (this.state === 'wait') return;
        if (this.state === 'end') {
            log('game ended');
            return;
        }

        if (this.current_player.id !== user.id) {
            log('not your turn');
            return;
        }

        // --- Execute move ---
        if (this.current_player.health > 0) {
            user.moves.forEach(m => {
                if (move_instance.name === m.name) {
                    m.use(user, target, this);
                    user.lastmoveused = m;
                }
            });
        }

        // --- AUTO CLEAN DEAD PLAYERS ---
        this.player_queue = this.player_queue.filter(p => p.health > 0);

        // If no players left, end immediately
        if (this.player_queue.length === 0) {
            this.state = 'end';
            log('No players left');
            return;
        }

        // Clamp current index in case players before it were removed
        if (this.current >= this.player_queue.length) {
            this.current = 0;
        }

        // --- Advance turn ---
        this.current += 1;

        if (this.current > this.player_queue.length - 1) {
            this.current = 0;
            this.current_turn += 1;
            log(`-----------------turn ${Math.floor(this.current_turn)}-----------------`);
        }

        this.current_player = this.player_queue[this.current];

        this.update();
        log(`${this.current_player.name} turn`);
        this.update_ui();
        this.check_winner();
        this.handle_cpu();
    }

    update_ui() {
        this.players.forEach(p => {
            if (p.elem) {
                let stat = p.elem.querySelector('.player-status')
                stat.innerHTML = `<div>name:${p.name}</div>
                            <div>health:${p.health}</div> 
                            <div>status effects: ${p.status_effects.join(', ')}</div> 
                            <div>last move used: ${p.lastmoveused ? p.lastmoveused.name : 'none'}</div> 
                            <div>last damage received: ${p.lastDamageReceived}</div> 
                            <div>team: ${p.team}</div>`
                let health = p.elem.querySelector('.player-health')
                health.innerHTML = ''
                for (let i = 0; i < p.health; i += 100) {
                    let healthbar = document.createElement('div')
                    healthbar.className = 'health-bar'
                    health.appendChild(healthbar)
                }
            }

        })

    }


    check_winner() {
        // players still alive
        const alivePlayers = this.players.filter(p => p.health > 0);

        // ---------- FREE FOR ALL ----------
        if (this.format === 'free for all') {
            if (alivePlayers.length === 1) {
                this.log(`${alivePlayers[0].name} wins`);
                this.event_handler.broadcast({message:'player victory',name:alivePlayers[0].name})
                this.state = 'end';
                this.handle_finished_game()
            }
            return;
        }

        // ---------- TEAM MODES ----------
        // group players by team
        const teams = {};

        for (const player of this.players) {
            if (!teams[player.team]) {
                teams[player.team] = [];
            }
            teams[player.team].push(player);
        }

        // determine which teams still have living players
        const aliveTeams = Object.entries(teams)
            .filter(([_, players]) =>
                players.some(player => player.health > 0)
            )
            .map(([team]) => team);

        // if only one team remains alive, they win
        if (aliveTeams.length === 1) {
            this.log(`${aliveTeams[0]} wins`);
            this.event_handler.broadcast({message:'team victory',name:aliveTeams[0]})
            this.state = 'end';
            this.handle_finished_game()
        }
    }

    sortPlayerQueue(players, descending = false) {
        return [...players].sort((a, b) => {
            return descending ? b.weight - a.weight : a.weight - b.weight;
        });
    }
    handle_cpu() {
        setTimeout(() => {
            if (this.current_player.type === 'cpu' && this.state === 'running') {
                cpu_state = 'active';

                // Choose a random enabled move
                const enabled_moves = this.current_player.moves.filter(m => m.isenabled);
                if (enabled_moves.length === 0) return;
                const move = enabled_moves[Math.floor(Math.random() * enabled_moves.length)];

                let target
                let validTargets;

                if (this.format === 'teams') {
                    // Target players on a different team
                    validTargets = this.players.filter(p =>
                        p !== this.current_player &&
                        p.team !== this.current_player.team &&
                        p.health > 0
                    );
                } else {
                    // Target any player except self
                    validTargets = this.players.filter(p =>
                        p !== this.current_player &&
                        p.health > 0
                    );
                }

                // If no valid targets remain, stop
                if (validTargets.length === 0) {
                    cpu_state = 'inactive';
                    return;
                }

                // Pick a random valid target
                target = validTargets[Math.floor(Math.random() * validTargets.length)];



                // Execute the move
                this.play(this.current_player, target, move);

                cpu_state = 'inactive';
            }

            // Continue checking if state changes back to 'wait'
            if (this.state === 'wait') {
                this.handle_cpu();
            }
        }, 1000);
    }
    handle_finished_game() {
        let restart = document.createElement('button'); restart.textContent = 'restart'
        restart.onclick = () => {
            this.event_handler.broadcast({message:'restart'})
            this.log_data.innerHTML = ''
            this.current_turn = 0
            this.players = []
            this.player_queue = []
            this.game_data.forEach(p => {
                let player = this.set_player(p)
                this.players.push(player)
            })
            this.start()
        }
        let new_game = document.createElement('button'); new_game.textContent = 'new_game'
        new_game.onclick = () => {
            this.event_handler.broadcast({message:'newgame'})
            this.log_data.innerHTML = ''
            this.current_turn = 0
            this.players = []
            this.player_queue = []
            this.set_format()
        }
        //this.log_data.append(restart, new_game)
    }
    apply_data(data) {
        data.forEach(p => {
            let player = this.set_player(p)
            this.players.push(player)
        })
    }
    get_game_data(){
        let data = {players:[],turn:this.current_turn,log_data:this.log_data.innerHTML}
        for(let i = 0;i<this.players.length;i++){
            let curr = this.players[i]
            let curr_moves = []
            for(let j = 0; j<curr.moves.length; j++){
                let move = curr.moves[j]
                curr_moves.push({
                    name:move.name,
                    durability:move.durability
                })
            }
            let obj = {
                name:curr.name,
                health:curr.health,
                moves:curr_moves
            }
            data.players.push(obj)
        }
        return data

    }
    handle_event(data){
        if(data.message=='reset battle'){
            this.log_data.innerHTML = ''
            this.current_turn = 0
            this.players = []
            this.player_queue = []
            this.set_format()
        }
    }
}

let attack = new move(
    'Attack',        // move_name
    'attack',       // type
    100,              // damage
    0,              // healing
    0,              // turns
    100,             // durability
    0,                // weight
    [],             // effects
    'move.png',    //image
    function (user, target) {   // onhit
        return;
    },
    function (self, user, target, moves) {  // update
        return;
    }
)

let defend = new move(
    'Defend',        // move_name
    'spell',       // type
    0,              // damage
    0,              // healing
    1,              // turns
    100,             // durability
    0,                // weight
    [],             // effects
    'move.png',    //image
    function (user, target, game_instance) {   // onhit
        user.status_effects.push('guard');
    },
    function (self, user, target, moves) {  // update
        if (self.turn_count == 0) {
            let index = user.status_effects.indexOf('guard');
            if (index > -1) {
                user.status_effects.splice(index, 1);
                log(`${user.name} is no longer guarded`);
            }
        }
    }
)

class Player {
    constructor(data) {
        this.id = 0
        this.name = data.name || 'player';
        this.health = data.health?data.health:1500;
        this.moves = [];
        this.status_effects = []; // e.g., ['stunned', 'poisoned']
        this.lastmoveused
        this.lastDamageReceived = 0
        this.weight = 0
        this.type = data.type
        this.team = data.team ? data.team : 'none'
        this.elem = null;
        this.img = data.img
        this.event_handler
        this.add_move(attack)
        this.add_move(defend)
        if (data.moves.length != 0) {
            data.moves.forEach(move => {
                for (let i = 0; i < moves.length; i++) {
                    if (move == moves[i].name) {
                        this.add_move(moves[i])
                    }
                }
            })
        }

    }
    add_move(move_data) {
        this.moves.push(new move(move_data.name, move_data.type, move_data.damage, move_data.healing, move_data.turns, move_data.durability,
            move_data.weight, move_data.effects, move_data.img, move_data.onhit, move_data.onupdate));
    }
    set_random_moves(){
        let availableMoves = [...moves];
        for (let i = 0; i < 6 && availableMoves.length > 0; i++) {
            const index = Math.floor(Math.random() * availableMoves.length);
            const new_move = availableMoves.splice(index, 1)[0]; // remove it
            this.add_move(new_move);
        }
    }
    handle_event(data){}
}



function log(message) {
    let msg = document.createElement('p')
    msg.textContent = message
    document.getElementById('game-log').appendChild(msg);
}

function get_prompt(message, options) {
    return new Promise((resolve) => {
        // If CPU mode
        if (cpu && cpu_state === 'active') {
            resolve(Math.floor(Math.random() * 6));
            return;
        }

        // Create main container
        const div = document.createElement('div');

        // Add message text
        const p = document.createElement('p');
        p.textContent = message;
        div.appendChild(p);

        // Create buttons
        options.forEach((option, i) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.addEventListener('click', () => {
                div.remove(); // remove the prompt UI
                resolve(i);
            });
            div.appendChild(btn);
        });

        // Append to log
        const prompt = document.createElement('div');
        prompt.appendChild(div);
        const log = document.getElementById('game-log');
        log.insertAdjacentHTML('beforeend', '<p>Select option:</p>');
        log.appendChild(prompt);
    });
}











