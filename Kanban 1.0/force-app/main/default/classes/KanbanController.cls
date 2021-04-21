public with sharing class KanbanController {

    public static final string OBJECT_MOVED = '{0} was successfully moved to {1} and column ordering was update';

    //Aura Handlers
    @AuraEnabled
    public static DataFetchResult initialize(){
        DataFetchResult result = new DataFetchResult();

        getColumns(result);
        fetchRecords(result);

        return result;
    }

    @AuraEnabled 
    public static valuesUpdate updatefields(Id objectId, string newCaseStatus, List<String> ordering){
        try{
            Case curCase = [ SELECT Id, Status FROM Case Where Id = objectId];

            curCase.Status = newCaseStatus;
            Update cas;
            
            // Update all the cases with the new ordering 
            List<Case> casesToUpdate = new List<Case>();
            Integer counter = 1;

            for (String recId : ordering){
                casesToUpdate.add(new Case(Id = recId, Kanban_Sort_Order__c = counter++));
            }

            update casesToUpdate;

            return new valuesUpdate(
                TRUE,
                'Success'
                String.format(OBJECT_MOVED, new List<Case>{curCase.Subject, newCaseStatus})
            );
        }
        catch (Exception e){
            return new valuesUpdate(
                FALSE,
                'Error',
                e.getMessage()
            );
        }
    }

    //public classes
    public class Column{
        @AuraEnabled
        public string label {get;set;}
        
        public Column (string label){
            this.label = label;
        }
    } 

    public class DataFetchResult {
        @AuraEnabled
        public List<Column> columns {get;set}

        @AuraEnabled
        public Map<String, List<sObject>> rows{get;set}
    }

    public class valuesUpdate {
        @AuraEnabled
        public Boolean isSuccess{get;set}

        @AuraEnabled
        public string title{get;set}

        @AuraEnabled
        public string message{get;set}

        public valuesUpdate(Boolean isSuccess, string title, string message){
            this.isSuccess = isSuccess;
            this.title = title;
            this.message = message;
        }
    }


    //private helper methods
    static void getCaseStatuses(DataFetchResult result){
        result.columns = new List<Column>();

        for (CaseStatus status : [ SELECT Id, SortOrder, MasterLabel FROM CaseStatus ORDER BY SortOrder ASC]){
            result.columns.add(
                new Column(
                    status.MasterLabel
                )
            );
        }
    }

    static void fetchRecords(DataFetchResult result){
        List<Case> cases = [ SELECT Id, CaseNumber, CreatedById,
                              CreatedDate, Priority, Status, Subject, Type
                              FROM Case WHERE 
                              RecordType.Name IN ('Internal Support', 'Internal Request')
                              ORDER BY Kanban_Sort_Order__c];
        
        result.rows = new Map<String, List<Case>>();

        for(Column col : result.comlums){
            result.rows.put(col.label, new List<Case>{});
        }

        for (Case cas: cases){
            if (result.rows.containsKey(cas.Status)){
                result.rows.get(cas.Status).add(cas);
            }
        }

    }


}
