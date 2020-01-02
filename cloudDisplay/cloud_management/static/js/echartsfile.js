// 网络流量
var graphic_dom = document.getElementById("graphic");
var graphic_myChart = echarts.init(graphic_dom);
var app = {};
graphic_option = null;
graphic_option = {
    title: {
        text: '网络流量',
        textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
        },
        padding: 10,
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params) {
            return params[0].name + '<br/>' +
                params[0].seriesName + ' : ' + params[0].value + '<br/>' +
                params[1].seriesName + ' : ' + (params[1].value + params[0].value);
        }
    },
    legend: {
        show: false,
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: ['Cosco', 'CMA', 'APL', 'OOCL', 'Wanhai', 'Zim'],
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            },
        },
        axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#fff', //左边线的颜色
            }
        },

    }],
    yAxis: [{
        type: 'value',
        splitNumber: 2,
        boundaryGap: [0, 0.2],
        splitLine: 1,
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            },
        },
        axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#fff', //左边线的颜色
            }
        },

    }],
    series: [{
            name: 'virtul',
            type: 'bar',
            stack: 'sum',
            barCategoryGap: '50%',
            itemStyle: {
                normal: {
                    color: '#CD950C',
                    barBorderColor: '#CD950C',
                    barBorderWidth: 2,
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        position: 'insideTop'
                    }
                }
            },
            data: [260, 200, 220, 160, 100, 80]
        },
        {
            name: 'Forecast',
            type: 'bar',
            stack: 'sum',
            itemStyle: {
                normal: {
                    color: '#fff',
                    barBorderColor: '#CD950C',
                    barBorderWidth: 2,
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function(params) {
                            for (var i = 0, l = graphic_option.xAxis[0].data.length; i < l; i++) {
                                if (graphic_option.xAxis[0].data[i] == params.name) {
                                    return graphic_option.series[0].data[i] + params.value;
                                }
                            }
                        },
                        textStyle: {
                            color: '#CD950C'
                        }
                    }
                }
            },
            data: [40, 50, 80, 80, 20, 60]
        }
    ]
};
if (graphic_option && typeof graphic_option === "object") {
    graphic_myChart.setOption(graphic_option, true);
}



// 表决

var judgeBox_dom = document.getElementById("judgeBox");
var judgeBox_myChart = echarts.init(judgeBox_dom);
var app = {};
judgeBox_option = null;
judgeBox_option = {
    title: {
        text: '拟态表决',
        textStyle: {
            color: '#ffffff',
            fontWeight: 'normal'
        },
        padding: 10,
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        show: false,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0601', '0602', '0603', '0604', '0605', '0606', '0607'],
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            },
        },
        axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#fff', //左边线的颜色
            }
        },
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: false,
        },
        splitNumber: 2,
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            },
        },
        axisLine: {
            lineStyle: {
                type: 'solid',
                color: '#fff', //左边线的颜色
            }
        },
    },
    series: [{
            name: '执行体1',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '执行体2',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '执行体3',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '执行体4',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '执行体5',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};;
if (judgeBox_option && typeof judgeBox_option === "object") {
    judgeBox_myChart.setOption(judgeBox_option, true);
}








// 表决