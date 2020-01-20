# Introduction

This repository contains a basic example of using LWC and Donut chart based on Chart.js .
In addition to the basic sample, this repository also demonstrates the pub/sub model of LWC allowing interaction between the two unrelated LWC components in the same Lightning page.
Take a look at this link for a brief intro on pubsub module of LWC
https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.events_pubsub 

# Set up Details
This repository is developed and tested under a Lightning Community. 
So if you want to use this Repository as it is, please do the following before deploying package.xml from this repository into your SFDC instance
1. Enable communities
2. Create a 'Build Your Own' Community with the name( accountCases ) and URL as 'accCase'
3. Under sites folder in VS code, change the following two items:

    a. siteAdmin - change the username to the destination Administrator Username
    b. Subdomain - change the domain name to the community created in destination instance

Once the above steps are completed, you can deploy package.xml components in your SFDC instance from VS Code. 
Finally, you can click on 'Activate Community' from the Administration section of your community workspace.

# Components
1. StaticResource - chartjs
2. LWC - accCaseByPriorityComponent, accCaseByStatusComponent, accountListComponent
3. Other LWC - errorPanel, ldsUtils, pubsub
4. Apex Class - AccountChartJSHelper.cls