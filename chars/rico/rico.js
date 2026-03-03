const rico = {
            name:'rico',
            thumbnail:'chars/rico/thumbnail.png',
            images:[
                'chars/rico/assistant1.png',
                'chars/rico/assistant2.png',
                'chars/rico/assistant3.png'
            ],
            battle_info:{name:'rico',health:1000,level:2,moves:['Strike','Repair','Heal','Force Field'],type:'cpu',img:'chars/rico/thumbnail.png'},
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
            ],
            intro:'hi im rico'
        }

const rico2 = {
            name:'rico2',
            thumbnail:'chars/rico/assistant1.png',
            images:[
                'chars/rico/assistant1.png',
                'chars/rico/assistant2.png',
                'chars/rico/assistant3.png'
            ],
            battle_info:{name:'rico',health:1000,level:2,moves:['Strike','Repair','Heal','Force Field'],type:'cpu',img:'chars/rico/assistant1.png'},
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
            ],
            intro:'hi this is rico 2'
        }