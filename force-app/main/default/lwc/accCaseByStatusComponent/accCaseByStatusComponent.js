/* eslint-disable vars-on-top */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chartJS';
//import Id from '@salesforce/user/Id';
import getAccountCasesByStatus from '@salesforce/apex/AccountChartJSHelper.getAccountCasesByStatus';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class AccCaseByStatusComponent extends LightningElement {
    @track error;
    chart;
    @track accountId = '';
    chartjsInitialized = false;
    //@track doughNutMap;
    @wire(CurrentPageReference) pageRef;
    @wire(getAccountCasesByStatus, { accountId: '$accountId' }) doughtNutMap;
    //doughNutLabels = [];
    //doughNutValues = []; 
    
    dataVar = [
        generateRandomNumber(),
        generateRandomNumber(),
        generateRandomNumber(),
        generateRandomNumber(),
        generateRandomNumber()
    ];
    connectedCallback() {
        // subscribe to searchKeyChange event
        //console.log('In connectedcallback of proj status component');
        registerListener('renderCaseComponents', this.handleChartReRender, this);
        //console.log('after registerListener In connectedcallback of proj status component');
    }
    
    disconnectedCallback() {
        // unsubscribe from searchKeyChange event
        //console.log('In disconnectedcallback of proj status component');
        unregisterAllListeners(this);
    }
    async handleChartReRender(accountId) {
        //console.log('In the handle Chart Render event handler '+accountId);
        this.accountId = accountId;
        this.doughNutMap =  await getAccountCasesByStatus({accountId: this.accountId});
        this.chart.data.datasets[0].data = Object.values(this.doughNutMap);
        this.chart.data.labels = Object.keys(this.doughNutMap);
        this.chart.update();
    }
    async renderedCallback() {
        //console.log('Inside Rendered Callback method ');
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        this.doughNutMap = await getAccountCasesByStatus({accountId: ''});
        //console.log(' board List is ' , Object.keys(this.doughNutMap));
        
        loadScript(this, chartjs)
            .then(() => {
                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chart = new window.Chart(ctx, this.setConfig(this.doughNutMap));//this.config
            })
            .catch(error => {
                this.error = error;
            });
    }
    setConfig(doughNutMap) {
        let config = {
            type: 'doughnut',
            cutoutPercentage : 80,
            data: {
                datasets: [
                    {
                        data: Object.values(doughNutMap), //this.doughNutValues,//Object.values(this.doughtNutMap.data)
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)'
                            //'rgb(54, 162, 235)'
                        ],
                        label: 'Dataset 1'
                    }
                ],
                labels: Object.keys(doughNutMap)//this.doughNutLabels
                //['Red', 'Orange', 'Yellow', 'Green', 'Blue']//Object.keys(this.doughtNutMap.data)
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    onComplete : function() {
                        var ctx = this.chart.ctx;
                        ctx.font = 
                            window.Chart.helpers.fontString(window.Chart.defaults.global.defaultFontFamily,
                                                             'normal', 
                                                             window.Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        this.data.datasets.forEach(function (dataset) {
                            for (var i = 0; i < dataset.data.length; i++) {
                                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                    //total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                    mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                                    start_angle = model.startAngle,
                                    end_angle = model.endAngle,
                                    mid_angle = start_angle + (end_angle - start_angle)/2;
                                var x = mid_radius * Math.cos(mid_angle);
                                var y = mid_radius * Math.sin(mid_angle);
                                ctx.fillStyle = '#fff';
                                if (i === 3){ // Darker text color for lighter background
                                    ctx.fillStyle = '#444';
                                }
                                //var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                                if(dataset.data[i] !== 0 && dataset._meta[0].data[i].hidden !== true) {
                                    ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                                    // Display percent in another line, line break doesn't work for fillText
                                    //ctx.fillText(percent, model.x + x, model.y + y + 15);
                                }
                            }
                        });
                    }
                },
                events : ['click']
            }
        };
        return config;
    }
    
    clickHandler(evt) {
        var firstPoint = this.chart.getElementAtEvent(evt)[0];
        var label = '';
        var value = '';
        // eslint-disable-next-line no-console
        if(firstPoint) {
            label =  this.chart.data.labels[firstPoint._index];
            value = this.chart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
            console.log( 'first point label is ' + label);
            console.log(' first point value is '+value);
        }
    }
}