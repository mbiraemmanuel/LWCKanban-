public with sharing class KanbanController {

    @AuraEnabled (cacheable=true)
    public static List<Case> getObjectRecords(){
       return [ SELECT Id,
                       CaseNumber,
                       CreatedById,
                       CreatedDate,
                       Priority,
                       Status,
                       Subject,
                       Type,
                       Type_Category__c,
                       Type_of_Case__c,
                       Owner.Name,
                       Contact.Name
                       FROM Case 
                       WHERE RecordType.Name IN ('VBIT Change Request', 'VBIT Internal Project', 'VBIT IT Support') 
                       ORDER BY Kanban_Sort_Order__c ASC];
    }
    


}
