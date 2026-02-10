class Comp{
	constructor(elem){
		this.elem = elem
		this.event_handler

		this.tabButtons = document.getElementById('shop-tab-buttons').children

		this.sections = [
			document.getElementById('item-shop'),
			document.getElementById('card-shop'),
			"buyable-items"
			"sellable-items"
			"shop girl"
		]

		this.tabButtons[0].onclick =()=>{
			this.switch_tab('item-shop')
		}
		this.tabButtons[1].onclick =()=>{
			this.switch_tab('card-shop')
		}
		this.switch_tab('item-shop')
	}
	

	switch_tab(tab){
		this.sections.forEach(section=>{
			section.style.display='none'
			if(section.id==tab){
				section.style.display='flex'
			}
		})
	}
	handleOnSwitch(){
	}
	
	handle_event(data){
		if(data.message=='tab switch'&&data.tab==this.elem.id){
			this.handleOnSwitch()
		}
	}
}