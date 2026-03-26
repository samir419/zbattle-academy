
let money = 0
let money_div = document.createElement("div")
let add_button = document.createElement('button')
add_button.textContent='work';add_button.className="btn"
let shop_assets_div = document.createElement("div") 
add_button.onclick=()=>{
	money++
	render_p_data()
}
let assets = [
	{name:'stand',wage:10,total:0,duration:5,time:0},
	{name:'stand2',wage:12,total:0,duration:6,time:0}
]
function render_p_data(){
	money_div.innerHTML=`money: ${money}`
	shop_assets_div.innerHTML=''
	for(let i=0;i<assets.length;i++){
		let asset = document.createElement("div")
		let wage = document.createElement("p")
		let collect = document.createElement("button");collect.textContent='collect'
		collect.onclick=()=>{money+=assets[i].total;assets[i].total=0;render_p_data()}
		wage.innerHTML=`${assets[i].name}: ${assets[i].total}`
		asset.append(wage,collect)
		shop_assets_div.append(asset)
	}
}
function bus_update(){
	setTimeout(() => {
       for(let i=0;i<assets.length;i++){
       	assets[i].time++
       	if(assets[i].time==assets[i].duration){
       			assets[i].total+=assets[i].wage
       			assets[i].time=0
       		}
       }
       render_p_data()
       bus_update()
    }, 1000);
}
document.getElementById('busines').append(money_div,add_button,shop_assets_div)
render_p_data()
bus_update()