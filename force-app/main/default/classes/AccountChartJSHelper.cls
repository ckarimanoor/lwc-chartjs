public with sharing class AccountChartJSHelper {
    public AccountChartJSHelper() {

    }
    @TestVisible
    @AuraEnabled(cacheable=true)
    public static Map<String,Integer> getAccountCasesByStatus(String accountId) {
        Map<String, Integer> labelVal = new Map<String, Integer>();
        if ( String.isNotBlank( accountId ) ) {
            List<Account> accountIdList = [select Id, Name from Account where Id = :accountId limit 1];
            System.debug('Line no 25 ');
            if ( accountIdList.size() > 0  ) {
                AggregateResult[] groupedResults
                    = [SELECT Status, Count(Id)
                        FROM Case where AccountId = :accountIdList[0].Id
                        GROUP BY Status];
                for (AggregateResult ar : groupedResults)  {
                    labelVal.put(String.valueOf(ar.get('Status')), Integer.valueOf(ar.get('expr0')));
                }
            } 
        } else {
            AggregateResult[] groupedResults
                = [SELECT Status, Count(Id)
                    FROM Case
                    GROUP BY Status];
            for (AggregateResult ar : groupedResults)  {
                labelVal.put(String.valueOf(ar.get('Status')), Integer.valueOf(ar.get('expr0')));
            }
        }
        return labelVal;
    }
    @TestVisible
    @AuraEnabled
    public static Map<String,Integer> getAccountCasesByPriority(String accountId) {
        //List<User> accountIdList = [select Contact.AccountId from User u where Id = :accountId limit 1];
        Map<String, Integer> labelVal = new Map<String, Integer>();
        System.debug('Line no 54 ');
        if ( String.isNotBlank( accountId ) ) {
            List<Account> accountIdList = [select Id, Name from Account where Id = :accountId limit 1];
            if ( accountIdList.size() > 0  ) {
                AggregateResult[] groupedResults
                = [SELECT Priority, Count(Id) 
                    FROM Case where AccountId = :accountIdList[0].Id
                    GROUP BY Priority];
                for (AggregateResult ar : groupedResults)  {
                    labelVal.put(String.valueOf(ar.get('Priority')), Integer.valueOf(ar.get('expr0')));
                }
            }
        } else {
            AggregateResult[] groupedResults
                = [SELECT Priority, Count(Id) 
                    FROM Case 
                    GROUP BY Priority];
                for (AggregateResult ar : groupedResults)  {
                    labelVal.put(String.valueOf(ar.get('Priority')), Integer.valueOf(ar.get('expr0')));
                }
        }
        return labelVal;
    }
    @TestVisible
    @AuraEnabled(cacheable=true)
    public static List<AccountListWrapper> getAccountList(String userId) {

        List<Account> accountList = new List<Account>();

            accountList = [SELECT Id, Name FROM Account 
                        ORDER BY CreatedDate ASC LIMIT 20];
        
       List<AccountListWrapper> response = new List<AccountListWrapper>();
       AccountListWrapper blankAcc = new AccountListWrapper();
        blankAcc.label='--select--';
        blankAcc.value ='';
        response.add(blankAcc);
        
        for(Account accRec : accountList){
            AccountListWrapper obj = new AccountListWrapper();
            obj.value = accRec.Id;
            obj.label = accRec.name;
            response.add(obj);
        }

        return response;
    }

    private class AccountListWrapper {
        @AuraEnabled
        public String label { get;set; }
        @AuraEnabled
        public String value { get;set; }
    }
}