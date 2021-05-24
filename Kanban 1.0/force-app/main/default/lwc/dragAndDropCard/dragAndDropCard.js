import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class DragAndDropCard extends NavigationMixin(LightningElement) {
    @api status
    @api record
    @api colorsettings ;
    @track internalProjectColor = this.colorsettings.projectColor
    @track changeRequestColor = this.colorsettings.changeColor
    @track ITSupportColor = this.colorsettings.supportColor

    get isSameStatus(){
        return this.status === this.record.Status
    }
    navigateCaseHandler(event){
        event.preventDefault()
        this.navigateHandler(event.target.dataset.id, 'Case')
    }
    navigateAccHandler(event){
        event.preventDefault()
        this.navigateHandler(event.target.dataset.id, 'Account')
    }
    navigateHandler(Id, apiName) {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: Id,
                objectApiName: apiName,
                actionName: 'view',
            },
        }).then(url => {
            window.open(url, "_blank");
        })
    }
    
    itemDragStart(){
        let draggableELement = this.template.querySelector('[data-id="' + this.record.Id + '"]');
        draggableELement.classList.add('moving-card');
        const event = new CustomEvent('itemdrag', {
            detail: this.record.Id
        });
        this.dispatchEvent(event)
        console.log('Drag started: ', this.record.Id)
    }

    removeDragStyle(){
        let draggableELement = this.template.querySelector('[data-id="' + this.record.Id + '"]');
        draggableELement.classList.remove('moving-card');
    }

    senddata(){
        const event = new CustomEvent ('child', {
            detail: this.record.Id
        });
        this.dispatchEvent(event)
    }

    getClass(event){
        let element = this.template.querySelector('.Card');
        let classname = this.Type_Of_Case__c;
        element.classList.add(classname)
    }
    get getTypeOfCase(){
        return this.record.Type_of_Case__c
    }

    get getCardColor(){
        if(this.record.Type_of_Case__c == "IT Support"){
            return `background: ` + this.ITSupportColor
        } 
        else if(this.record.Type_of_Case__c == "Change Request"){
            return `background: ` + this.changeRequestColor
        } 
        else if(this.record.Type_of_Case__c == "Internal Projects"){
            return `background: ` + this.internalProjectColor
        } 
    }


   
}