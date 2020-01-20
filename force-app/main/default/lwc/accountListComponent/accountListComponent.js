/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountChartJSHelper.getAccountList';
import currentUserId from '@salesforce/user/Id';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class AccountListComponent extends LightningElement {
    @track accountList;
    @track value = '';
    @wire(CurrentPageReference) pageRef;
    @wire(getAccountList, { userId: currentUserId })
    accountList;

    get accountListOptions() {
        return this.accountList.data;
    }
    handleChange(event) {
        this.value = event.detail.value;
        //console.log(this.value);
        fireEvent(this.pageRef, 'renderCaseComponents', this.value);
    }
}