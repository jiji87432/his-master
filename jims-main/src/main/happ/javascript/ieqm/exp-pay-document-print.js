/**
 * 付款单据打印
 * Created by wangbinbin on 2015/11/02.
 */
function checkRadio(){
    if($("#billing:checked").val()){
        $("#startBill").textbox("enable");
    }else{
        $("#startBill").textbox("clear");
        $("#startBill").textbox({disabled:true});
    }
    if($("#supply:checked").val()){
        $("#supplier").combogrid("enable");
    }else{
        $("#supplier").combogrid("clear");
        $("#supplier").combogrid({disabled:true});
    }
}
//格式化日期函数
function myFormatter2(val, row) {
    if (val != null) {
        var date = new Date(val);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' '
            + (h < 10 ? ("0" + h) : h) + ":" + (mm < 10 ? ("0" + mm) : mm) + ":" + (s < 10 ? ("0" + s) : s);
        return dateTime
    }
}

function w3(s) {
    if (!s) return new Date();
    var y = s.substring(0, 4);
    var m = s.substring(5, 7);
    var d = s.substring(8, 10);
    var h = s.substring(11, 14);
    var min = s.substring(15, 17);
    var sec = s.substring(18, 20);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(h) && !isNaN(min) && !isNaN(sec)) {
        return new Date(y, m - 1, d, h, min, sec);
    } else {
        return new Date();
    }
}

$(function () {
    /**
     * 供货方
     *
     */
    var masterDataVo = {};//主表vo
    var disData = [];
    var masters = [];//信息
    var currentDocumentNo;//当前账单号
    /**
     * 定义主表信息Panel
     */
    $("#expImportMaster").panel({
        width: "100%",
        height: 470,
        footer: '#ft'

    });

    $("#expImportDetail").panel({
        width: "100%",
        height: 'auto',
        title: "付款单据打印"
    });
    var suppliers = {};
    var promise = $.get("/api/exp-supplier-catalog/list-with-dept?hospitalId=" + parent.config.hospitalId, function (data) {
        suppliers = data;
        return suppliers;
    });
    /**
     * 定义主表信息表格
     */
    $("#importMasterDoc").datagrid({
        height:270,
        singleSelect: true,
        rownumbers:true,
        columns: [[{
            title: '付款日期',
            field: 'disburseDate',
            width: '11%',
            formatter:myFormatter2
        },{
            title: '付款单号',
            field: 'disburseRecNo',
            width: '9%',
            editor: {type: 'textbox'}
        },   {
            title: '供货单位',
            field: 'receiver',
            width: '9%',
            editor: {type: 'textbox'},
            formatter: function (value, row, index) {
                for (var i = 0; i < suppliers.length; i++) {
                    if (value == suppliers[i].supplierCode) {
                        return suppliers[i].supplierName;
                    }
                }
                return value;
            }

        },{
            title: '付款金额',
            field: 'payAmount',
            width: '9%',
            editor: {type: 'textbox'}
        }, {
            title: '零售金额',
            width: '9%',
            field: 'retailAmount'

        }, {
            title: "批价金额",
            width: '9%',
            field: 'tradeAmount'
        }, {
            title: '开户行',
            field: 'bank',
            width: '9%',
            editor: {type: 'textbox'}
        }, {
            title: '帐号',
            field: 'accountNo',
            width: '9%',
            editor: {type: 'numberbox'}
        }, {
            title: '支票号',
            width: '9%',
            field: 'checkerNo'
        }, {
            title: '操作员',
            width: '9%',
            field: 'operator'
        }, {
            title: '库房',
            width: '9%',
            field: 'storage'
        }]],onClickRow: function (rowIndex,rowData) {
            $("#importMasterAcc").datagrid('loadData',[]);
            var loadDicts = function(){
                var  dis = {};
                dis.disburseRecNo = rowData.disburseRecNo;

                nober=rowData.disburseRecNo;

                dis.hospitalId = parent.config.hospitalId;
                dis.storage = parent.config.storageCode;
                var promiseDis =$.get("/api/exp-dis/exp-pay-detail-print",dis,function(data){
                    disData =data ;
                },'json');
                promiseDis.done(function(){
                    if(disData.length<=0){
                        $.messager.alert('系统提示','数据库暂无数据','info');
                        $("#importMasterAcc").datagrid('loadData',[]);
                        return;
                    }
                    $("#importMasterAcc").datagrid('loadData',disData);
                })
            }
            loadDicts();
        }

    });
    $("#importMasterAcc").datagrid({
        height:200,
        singleSelect: true,
        rownumbers:true,
        columns: [[{
            title: '入库单号',
            field: 'documentNo',
            width: '7%',
            editor: {type: 'textbox'}
        },{
            title: '代码',
            field: 'expCode',
            width: '7%',
            editor: {type: 'textbox'}
        },{
            title: '产品名称',
            field: 'expName',
            width: '5%',
            editor: {type: 'textbox'}
        }, {
            title: '规格',
            field: 'packageSpec',
            width: '4%'
        },  {
            title: '结账数',
            field: 'disburseCount',
            width: '5%',
            editor: {type: 'numberbox'}
        }, {
            title: '单位',
            field: 'packageUnits',
            width: '4%'

        },  {
            title: '进价',
            field: 'purchasePrice',
            width: '5%',
            editor: {type: 'textbox'}
        }, {
            title: '结账金额',
            width: '5%',
            field: 'payAmount'

        }, {
            title: "厂家",
            width: '5%',
            field: 'firmId'
        }, {
            title: '扣率',
            field: 'discount',
            width: '4%',
            editor: {type: 'textbox'}
        }, {
            title: '批价',
            width: '5%',
            field: 'tradePrice'
        }, {
            title: '零价',
            width: '5%',
            field: 'retailPrice'
        }, {
            title: '批号',
            width: '5%',
            field: 'batchNo'
        }, {
            title: '有效期',
            width: '11%',
            field: 'expireDate',
            formatter:myFormatter2
        }, {
            title: '发票号',
            width: '5%',
            field: 'invoiceNo'
        }, {
            title: '发票日期',
            width: '11%',
            field: 'invoiceDate',
            formatter:myFormatter2
        }, {
            title: '付款单据号',
            width: '5%',
            field: 'disburseRecNo'

        }, {
            title: '顺序号',
            width: '5%',
            field: 'itemNo'

        }, {
            title: '批价结账总额',
            width: '9%',
            field: 'tradeAmount'

        }, {
            title: '零价结账总额',
            width: '9%',
            field: 'retailAmount'

        }]]
    });
    //设置时间
    var curr_time = new Date();
    $("#startDate").datetimebox("setValue", myFormatter2(curr_time));
    $("#stopDate").datetimebox("setValue", myFormatter2(curr_time));
    $('#startDate').datetimebox({
        required: true,
        showSeconds: true,
        value: 'dateTime',
        formatter: myFormatter2,
        onSelect: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var time = $('#startDate').datetimebox('spinner').spinner('getValue');
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' ' + time;
            $('#startDate').datetimebox('setText', dateTime);
            $('#startDate').datetimebox('hidePanel');
        }
    });
    $('#stopDate').datetimebox({
        required: true,
        showSeconds: true,
        value: 'dateTime',
        formatter: myFormatter2,
        onSelect: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var time = $('#stopDate').datetimebox('spinner').spinner('getValue');
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' ' + time;
            $('#stopDate').datetimebox('setText', dateTime);
            $('#stopDate').datetimebox('hidePanel');
        }
    });
    //入库分类字典
    $("#importClass").combobox({
        url: '/api/exp-import-class-dict/list',
        valueField: 'importClass',
        textField: 'importClass',
        method: 'GET'
    });
    $('#searchInput').combogrid({
        disabled: true,
        panelWidth: 500,
        idField: 'expCode',
        textField: 'expName',
        url: '/api/exp-name-dict/list-exp-name-by-input',
        method: 'GET',
        mode: 'remote',
        columns: [[
            {field: 'expCode', title: '编码', width: 150, align: 'center'},
            {field: 'expName', title: '名称', width: 200, align: 'center'},
            {field: 'inputCode', title: '拼音', width: 50, align: 'center'}
        ]],
        pagination: false,
        fitColumns: true,
        rowNumber: true,
        autoRowHeight: false,
        pageSize: 50,
        pageNumber: 1
    });
    //供应商
    var suppliers = {};
    var promise = $.get("/api/exp-supplier-catalog/list-with-dept?hospitalId=" + parent.config.hospitalId, function (data) {
        suppliers = data;
        return suppliers;
    });
    promise.done(function () {
        $("#supplier").combogrid({
            idField: 'supplierCode',
            textField: 'supplierName',
            data: suppliers,
            panelWidth: 500,
            fitColumns: true,
            columns: [[{
                title: '供应商名称', field: 'supplierName', width: 200, align: 'center'
            }, {
                title: '供应商代码', field: 'supplierCode', width: 150, align: 'center'
            }, {
                title: '输入码', field: 'inputCode', width: 50, align: 'center'
            }]],
            filter: function (q, row) {
                return $.startWith(row.inputCode.toUpperCase(), q.toUpperCase());
            }
        })
    });
    $("#searchBtn").on('click', function () {
        var promiseMaster = loadDict();
        promiseMaster.done(function(){
            if(masters.length<=0){
                $.messager.alert('系统提示','数据库暂无数据','info');
                $("#importMasterDoc").datagrid('loadData',[]);
                return;
            }
            $("#importMasterDoc").datagrid('loadData',masters);
        })
    })
    var loadDict = function(){
        nober='';
        masterDataVo.disburseRecNo = $("#startBill").textbox("getText");
        masterDataVo.startDate = new Date($("#startDate").datetimebox("getText"));
        masterDataVo.stopDate = new Date($("#stopDate").datetimebox("getText"));
        masterDataVo.supplier = $("#supplier").combogrid("getValue");
        masterDataVo.hospitalId = parent.config.hospitalId;
        masterDataVo.storage = parent.config.storageCode;
        var promise =$.get("/api/exp-dis/exp-pay-document-print",masterDataVo,function(data){
            masters =data ;
        },'json');
        return promise;

    }

    var nober='';
    $("#printDiv").dialog({
        title: '打印预览',
        width: 1000,
        height: 520,
        catch: false,
        modal: true,
        closed: true,
        onOpen: function () {
            var disburseRecNo = $("#startBill").textbox("getText");
            var startDates = $("#startDate").datetimebox("getText");
            var stopDates = $("#stopDate").datetimebox("getText");
            var supplier = $("#supplier").combogrid("getValue");
            var https="http://"+parent.config.reportDict.ip+":"+parent.config.reportDict.port+"/report/ReportServer?reportlet=exp/exp-list/exp-pay-document-print-appro.cpt&hospitalId="+parent.config.hospitalId+"&storage="+parent.config.storageCode+"&startDate=" + startDates + "&stopDate=" + stopDates+"&disburseRecNo=" + disburseRecNo + "&receive=" + supplier+"&nober=" + nober;
            $("#report").prop("src",cjkEncode(https));
        }
    })
    $("#printAccBtn").on('click',function(){
        var printData = $("#importMasterDoc").datagrid('getRows');
        if(printData.length<=0){
            $.messager.alert('系统提示','请先查询数据','info');
            return;
        }
        $("#printDiv").dialog('open');

    })
    $("#printDivs").dialog({
        title: '打印预览',
        width: 1000,
        height: 520,
        catch: false,
        modal: true,
        closed: true,
        onOpen: function () {
            var printData = $("#importMasterAcc").datagrid('getRows');
            var disburseRecNo = printData[0].disburseRecNo;
            var hospitalId = parent.config.hospitalId;
            var storage = parent.config.storageCode;
            var https="http://"+parent.config.reportDict.ip+":"+parent.config.reportDict.port+"/report/ReportServer?reportlet=exp/exp-list/exp-pay-document-print-approving.cpt"+"&hospitalId="+parent.config.hospitalId+"&storage="+parent.config.storageCode+"&disburseRecNo=" + disburseRecNo;
            $("#reports").prop("src",cjkEncode(https));
        }
    })
    $("#printDocBtn").on('click',function(){
        var printData = $("#importMasterAcc").datagrid('getRows');
        if(printData.length<=0){
            $.messager.alert('系统提示','请先查询付款单数据','info');
            return;
        }
        $("#printDivs").dialog('open');

    })
    //格式化日期函数
    function formatterDate(val, row) {
        if (val != null) {
            var date = new Date(val);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d);
            return dateTime
        }
    }
})