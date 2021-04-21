import { LightningElement } from 'lwc';


export default class Kanban extends LightningElement {
    columns = [
        {
            Id:1,
            label: 'New'
        },
        {
            Id:2,
            label: 'Open'
        },
        {
            Id:3,
            label: 'Work In Progress'
        },
        {
            Id:4,
            label: 'Resolved'
        },
        {
            Id:3,
            label: 'Closed'
        },
        {
            Id:5,
            label: 'Stalled'
        },
    ]
}