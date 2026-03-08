const erza = {
    name: 'erza',
    thumbnail: 'chars/erza/erza.png',

    images: [
        'chars/erza/erza.png',
        'chars/erza/erza1.png',
        'chars/erza/erza2.png'
    ],

    battle_info: {
        name: 'erza',
        health: 1000,
        level: 7,
        moves: ['Replenish','Heal','Strike','Blast Cannon','Power up','Force Field'],
        type: 'cpu',
        img: 'chars/erza/erza.png'
    },

    desired_items:[
        {name:'kitchen knife',response:'oh my thats a limited edition, definitely gonna make cooking easier.'},
        {name:'z fighter',response:'is that an actual z fighter? oh my god thank you'},
        {name:'medal',response:'theres no way you managed to get your hands on this.'}
    ],

    intro:'hello there. nice to meet you',

    talks:[
        // friendliness 0
        [
            // emotion 0
            [
                {
                    text:'hello there, nice to meet you. what brings you here?',
                    img:'random',
                    options:[
                        {
                            text:'I just wanted to get to know you better.',
                            response:'is that so. you can have my number.',
                            rewards:[],
                            influence:[0,1]
                        },
                        {
                            text:'I want a match.',
                            response:'you sweats are always challenging anyone.',
                            rewards:[],
                            influence:[1,0]
                        }
                    ]
                },
                {
                    text:'are you just gonna stand there or say something.',
                    img:'random',
                    options:[
                        {
                            text:'Ive seen you in several cooking competitions.',
                            response:'wow, people rarely notice that.',
                            rewards:[],
                            influence:[1,1]
                        },
                        {
                            text:'nevermind.',
                            response:'well scram.',
                            rewards:[],
                            influence:[0,0]
                        }
                    ]
                }
            ],

            // emotion 1
            [
                {
                    text:'are you a dog person or a cat person?',
                    img:'random',
                    options:[
                        {
                            text:'cat',
                            response:'cats are cool i guess.',
                            rewards:[],
                            influence:[1,0]
                        },
                        {
                            text:'dog',
                            response:'me too hehe.',
                            rewards:[],
                            influence:[0,1]
                        }
                    ]
                },
                {
                    text:'so what are your plans for today?',
                    img:'random',
                    options:[
                        {
                            text:'z battle all day',
                            response:'sweaty as always.',
                            rewards:[{name:'old z fighter',quantity:1,price:100}],
                            influence:[1,-1]
                        },
                        {
                            text:'not your concern',
                            response:'meh fair enough.',
                            rewards:[],
                            influence:[0,-1]
                        }
                    ]
                }
            ],

            // emotion 2
            [
                {
                    text:'i baked you a cake today, want some?',
                    img:'random',
                    options:[
                        {
                            text:'yes',
                            response:'glad you like it.',
                            rewards:[{name:'white cake',quantity:1,price:50}],
                            influence:[1,0]
                        },
                        {
                            text:'no',
                            response:'thats fine.',
                            rewards:[],
                            influence:[0,0]
                        }
                    ]
                }
            ]
        ],

        // friendliness 1
        [
            // emotion 0
            [
                {
                    text:'whats on your mind now?',
                    img:'random',
                    options:[
                        {
                            text:'strong opponents',
                            response:'haha youre quite the character.',
                            rewards:[],
                            influence:[1,0]
                        },
                        {
                            text:'what present do you want?',
                            response:'theres this legendary kitchen knife in the shop.',
                            rewards:[],
                            influence:[0,1]
                        }
                    ]
                }
            ],

            // emotion 1
            [
                {
                    text:'being an eldest sibling can be a pain you know.',
                    img:'random',
                    options:[
                        {
                            text:'yeah i feel you',
                            response:'i need a break.',
                            rewards:[],
                            influence:[1,0]
                        },
                        {
                            text:'thats commendable',
                            response:'such a fine way with words.',
                            rewards:[],
                            influence:[0,1]
                        }
                    ]
                }
            ],

            // emotion 2
            [
                {
                    text:'whats your favourite move?',
                    img:'random',
                    options:[
                        {
                            text:'show me',
                            response:'check it out.',
                            rewards:[
                                {name:'Angel Guard'},
                                {name:'fusion xyz'}
                            ],
                            influence:[1,0]
                        },
                        {
                            text:'nothing much',
                            response:'welp.',
                            rewards:[],
                            influence:[0,0]
                        }
                    ]
                }
            ]
        ],

        // friendliness 2
        [
            // emotion 0
            [
                {
                    text:'have fun on your next tournament.',
                    img:'random',
                    options:[
                        {
                            text:'i play to win',
                            response:'...uhuh.',
                            rewards:[],
                            influence:[-1,0]
                        },
                        {
                            text:'you should come watch',
                            response:'not a bad idea.',
                            rewards:[],
                            influence:[0,1]
                        }
                    ]
                }
            ],

            // emotion 1
            [
                {
                    text:'do you think our battle styles work together?',
                    img:'random',
                    options:[
                        {
                            text:'we are a match made in heaven',
                            response:'stop that youll make me blush.',
                            rewards:[],
                            influence:[0,1]
                        },
                        {
                            text:'perhaps',
                            response:'indecisive as always.',
                            rewards:[],
                            influence:[0,0]
                        }
                    ]
                }
            ],

            // emotion 2
            [
                {
                    text:'are you free today? wanna hang out?',
                    img:'random',
                    options:[
                        {
                            text:'sure',
                            response:'sweet.',
                            rewards:[{name:'love bracelet',quantity:1,price:220}],
                            influence:[0,0]
                        },
                        {
                            text:'for what?',
                            response:'just hanging around i guess.',
                            rewards:[],
                            influence:[-1,0]
                        }
                    ]
                }
            ]
        ]
    ]
}