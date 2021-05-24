import { LightningElement, wire, track } from 'lwc';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import ID_FIELD from '@salesforce/schema/Case.Id'; 
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import PRIORITY_FIELD from '@salesforce/schema/Case.Priority';
import TYPE_FIELD from '@salesforce/schema/Case.Type';
import TYPE_CATEGORY_FIELD from '@salesforce/schema/Case.Type_Category__c';
import RECORD_TYPE_FIELD from '@salesforce/schema/Case.RecordTypeId';
import CONTACT_FIELD from '@salesforce/schema/Case.Contact.Name';
import getCases from '@salesforce/apex/KanbanController.getObjectRecords'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import jQuery from '@salesforce/resourceUrl/jQuery';
import jQueryUI from '@salesforce/resourceUrl/jQueryUI';
import Close from '@salesforce/resourceUrl/Close';
import Add from '@salesforce/resourceUrl/Add';


export default class Kanban extends LightningElement {
    //declare a variable that will hold the column fields, and add the 
    //@track decorator to track any changes that may occur
    @track columns;
    @track cases
    @track isModalOpen = false
    @track isTabOneOpen = true
    @track isTabTwoOpen = false
    @track isTabThreeOpen = false
    @track allCasesData
    @track currRecord;
    @track isTabOneOpen = true
    @track isTabTwoOpen = false
    @track isTabThreeOpen = false
    @track isCreateNewCaseOpen = false
    @track isSettingOpen = false
    @track internalProjectColor = '#50f97c'
    @track changeRequestColor = '#529aff'
    @track ITSupportColor = '#ff7dd7'
    @track colorSettings = {
        changeColor: '#529aff',
        supportColor: '#ff7dd7',
        projectColor: '#50f97c'
    }
    error;
    recordId;
    wiredCases;

    addImage = Add;
    closeImage = Close;
    sObject = CASE_OBJECT
    statusField = STATUS_FIELD;
    idField = ID_FIELD;
    subjectField = SUBJECT_FIELD;
    priorityField = PRIORITY_FIELD;
    typeField = TYPE_FIELD;
    typeCategory = TYPE_CATEGORY_FIELD;
    recordTypeId = RECORD_TYPE_FIELD;
    recordContactField = CONTACT_FIELD;



    // Wired apex method to fetch case in the criteria set.
    @wire(getCases)
        wiredCases(results){
            //capture the returned data and any errors
            this.allCasesData = results;            
            // build filtered arras if data returned
            if (this.allCasesData.data){
                this.cases = this.allCasesData.data;
                console.log('Check 1', this.cases);
            }
            if (this.allCasesData.error){
                console.log(error)
            }
        }
    
    
    @wire(getPicklistValuesByRecordType, { objectApiName: CASE_OBJECT, recordTypeId: '0122g000000AOCSAA4'})
        wiredPicklistValue({data, error}){
            if(data){
                // console.log(cases.data);
                this.columns = data.picklistFieldValues.Status.values;
                console.log('Picklist values are: ', this.columns);
                console.log('Data Check ', this.cases);
                
            }
            else if(error){
                console.log('Error while fetching Picklist values ${error}');
            }
        }

    
    handleClick(event){
        console.log(event.target.dataset.item);
    }

    handleListItem(event){
        this.recordId = event.detail;
    }

    get calcWidth(){
        let len = this.columns.length
        return `width: calc(100%/ ${len})`
    }

    handleItemDrop(event){
        let status = event.detail
        this.updateHandler(status);
    }

    updateHandler(status){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STATUS_FIELD.fieldApiName] = status
        const recordInput = {fields}
        updateRecord(recordInput)
        .then(()=> {
            console.log("Updated Successfully")
            this.showToast();
            return refreshApex(this.allCasesData);
        }).catch(error=>{
            console.error(error)
        })
    }
    showToast(){
        const event = new ShowToastEvent({
            title:'Success',
            message: 'Status updated successfully',
            variant: 'success'
        });
        this.dispatchEvent(event);
    }
    

    slideIt(event){
        $(this.template.querySelector('.panel')).slideToggle();
        
    }

    slideRight(event){
        $(this.template.querySelector('.innerDiv')).animate({left: '275px'});
    }    
    
    handleParent(event){
        console.log('GrandParent')
        console.log(event.detail);
        this.currRecord = event.detail;
        this.isModalOpen = true;
    }

    openModal(){
        this.isModalOpen = true;
        this.isTabTwoOpen = true;
    }
    closeModal(){
        this.isModalOpen = false;
    }
    valueUpdate(event){
        event.preventDefault()
        this.isModalOpen = false;
        return refreshApex(this.allCasesData);

    }
    submitDetails(){
        this.isModalOpen=false;
    }

    detailTab(event){
        event.preventDefault();
        this.isTabOneOpen = true;
        this.isTabTwoOpen = false;
        this.isTabThreeOpen = false;

        var tablinks = document.getElementsByClassName('slds-tabs_scoped__link')
        for(var i = 0; i < tablinks.length; i++){
            tablinks[i].setAttribute("tabindex", "-1");
            tablinks[i].setAttribute("aria-selected", "false");
        }


        event.target.setAttribute("tabindex", "0");;
        event.target.setAttribute("aria-selected", "true");
        event.target.classList.add("slds-is-active");
    }

    feedTab(event){
        event.preventDefault();
        this.isTabOneOpen = false;
        this.isTabTwoOpen = true;
        this.isTabThreeOpen = false;

        var tablinks = document.getElementsByClassName('slds-tabs_scoped__link')
        for(var i = 0; i < tablinks.length; i++){
            tablinks[i].setAttribute("tabindex", "-1");
            tablinks[i].setAttribute("aria-selected", "false");
        }


        event.target.setAttribute("tabindex", "0");;
        event.target.setAttribute("aria-selected", "true");
        event.target.classList.add("slds-is-active");
    }

    flowTab(event){
        event.preventDefault();
        this.isTabOneOpen = false;
        this.isTabTwoOpen = false;
        this.isTabThreeOpen = true;

        var tablinks = document.getElementsByClassName('slds-tabs_scoped__link')
        for(var i = 0; i < tablinks.length; i++){
            tablinks[i].setAttribute("tabindex", "-1");
            tablinks[i].setAttribute("aria-selected", "false");
        }


        event.target.setAttribute("tabindex", "0");;
        event.target.setAttribute("aria-selected", "true");
        event.target.classList.add("slds-is-active");
    }

    newCase(){
        this.isCreateNewCaseOpen = true;
    }

    closeNewCaseForm(){
        this.isCreateNewCaseOpen = false;
    }

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
        })
        .catch(error=>{
            console.log('Failed to load the JQueryUI : ' +error);
        });
    }


    }
    


    
    
