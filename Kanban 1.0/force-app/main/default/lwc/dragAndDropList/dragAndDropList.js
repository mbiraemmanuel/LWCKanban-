import { LightningElement, api, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import jQuery from '@salesforce/resourceUrl/jQuery';
import jQueryUI from '@salesforce/resourceUrl/jQueryUI';

export default class DragAndDropList extends LightningElement {
    @api records
    @api status
    @api colorsettings
    @api sobject


    // drag source event handler for dispatch event from child component
    handleItemDrag(evt){
        console.log('Drag event started');
        const event = new CustomEvent('listitemdrag', {
            detail: evt.detail
        })
        this.dispatchEvent(event)
    }


    handleDragOver(evt){
        console.log('Drag over event for: ' + this.status);
        evt.preventDefault();
        this.addDragOverStyle();
    }

    handleDragLeave(event){
        console.log('Drag Leave event for: ' + this.status);
        event.preventDefault();
        this.removeDragOverStyle();
    }

    handleDrop(evt){
        console.log('Handling drop into target for status: ' + this.status);
        evt.preventDefault();
        const event = new CustomEvent('itemdrop', {
            detail: this.status
        })
        this.dispatchEvent(event)
        this.removeDragOverStyle();
    }

    handleChild(evt){
        console.log('Parent')
        const event = new CustomEvent ('parent', {
            detail: evt.detail
        });
        this.dispatchEvent(event)        
    }

    addDragOverStyle(){
        let draggableELement = this.template.querySelector('[data-role="drop-target"]');
        draggableELement.classList.add('over')
    }

    removeDragOverStyle(){
        let draggableELement = this.template.querySelector('[data-role="drop-target"]');
        draggableELement.classList.remove('over')
    }


    // load scripts for use in a more friendly UI, for future purposes.
    renderedCallback(){
        loadScript(this, jQuery)
        .then(() => {
            console.log('JQuery loaded.');
        })
        .catch(error=>{
            console.log('Failed to load the JQuery : ' +error);
        });

         loadScript(this, jQueryUI)
        .then(() => {
            console.log('JQueryUI loaded.');
            // $(this.template.querySelector('.dropZone')).sortable();
            // $(this.template.querySelector('.dropZone')).disableSelection();
        })
        .catch(error=>{
            console.log('Failed to load the JQueryUI : ' +error);
        });
    }
    connectedCallback(){
        // $(this.template.querySelector('.dropZone')).sortable();
        // $(this.template.querySelector('.dropZone')).disableSelection();
    }
    
}