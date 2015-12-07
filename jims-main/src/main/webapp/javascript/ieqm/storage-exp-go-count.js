/**
 * 库房产品去向汇总
 * Created by wangbinbin on 2015/11/06.
 */
$.extend($.fn.datagrid.methods, {
    autoMergeCells: function (jq, fields) {
        return jq.each(function () {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0,
                j = 0,
                temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < fields.length; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }

            $.each(temp, function (field, colunm) {
                $.each(colunm, function () {
                    var group = this;
                    if (group.length > 1) {
                        var before,
                            after,
                            megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index: megerIndex,
                                    field: field,
                                    rowspan: rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
});
function myFormatter2(val,row) {
    if(val != null){
        var date = new Date(val);
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var str = y+'/'+(m<10?('0'+m):m)+'/'+(d<10?('0'+d):d)+'/'+' '+(h<10?('0'+h):h)+':'+(min<10?('0'+min):min)+':'+(sec<10?('0'+sec):sec);
        return str;
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
    var masterDataVo = {};//主表vo
    var masters = [];//信息

    /**
     * 定义主表信息表格
     */
    $("#importMaster").datagrid({
        title: "库房产品去向汇总",
        fit: true,
        toolbar: '#tb',
        footer: '#ft',
        fitColumns: true,
        singleSelect: true,
        selectOnCheck:true,
        checkOnSelect:true,
        showFooter:true,
        rownumbers:true,
        columns: [[{
            title: '去向',
            field: 'receiver',
            width: '6%'
        },{
            title: '代码',
            field: 'expCode',
            width: '6%'
        },{
            title: '产品名称',
            field: 'expName',
            width: '7%'
        }, {
            title: '规格',
            field: 'packageSpec',
            width: '4%'
        },  {
            title: '单位',
            field: 'packageUnits',
            width: '4%'
        }, {
            title: '厂家',
            width: '8%',
            field: 'firmId'

        }, {
            title: "数量",
            width: '5%',
            field: 'quantity'
        },{
            title: '零售金额',
            width: '5%',
            field: 'retailAmount'
        },{
            title: '批发总价',
            width: '5%',
            field: 'payAmount'
        }]]
    });
    //定义子库房
    var subStorages = [];
    var subStoragePromise = $.get('/api/exp-sub-storage-dict/list-by-storage?storageCode=' + parent.config.storageCode + "&hospitalId=" + parent.config.hospitalId, function (data) {
        $.each(data, function (index, item) {
            var ec = {};
            ec.storageCode = item.storageCode;
            ec.subStorage = item.subStorage;
            subStorages.push(ec);
        });
        var all = {};
        all.storageCode = '全部';
        all.subStorage = '全部';
        subStorages.unshift(all);

        $('#subStorage').combobox({
            panelHeight: 'auto',
            data: subStorages,
            valueField: 'storageCode',
            textField: 'subStorage'
        });
        $('#subStorage').combobox("select", "全部");
    });
    //类型字典
    $("#formClass").combobox({
        url: '/api/exp-form-dict/list',
        valueField: 'formCode',
        textField: 'formName',
        method: 'GET'
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
            var dateTime = y + "/" + (m < 10 ? ("0" + m) : m) + "/" + (d < 10 ? ("0" + d) : d) + ' ' + time;
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
            var dateTime = y + "/" + (m < 10 ? ("0" + m) : m) + "/" + (d < 10 ? ("0" + d) : d) + ' ' + time;
            $('#stopDate').datetimebox('setText', dateTime);
            $('#stopDate').datetimebox('hidePanel');
        }
    });
    $("#searchBtn").on('click', function () {
        loadDict();
    })
    var loadDict = function(){
        masterDataVo.formClass = $("#formClass").combobox("getText");
        var sub = $("#subStorage").textbox("getText");
        if(sub=="全部"){
            masterDataVo.subStorage ='';
        }else{
            masterDataVo.subStorage =sub;
        }
        masterDataVo.startDate = $("#startDate").datebox("getText");
        masterDataVo.stopDate = $("#stopDate").datebox("getText");
        masterDataVo.hospitalId = parent.config.hospitalId;
        masterDataVo.storage = parent.config.storageCode;
        var retailAmount = 0.00;
        var payAmount = 0.00;
        var promise =$.get("/api/exp-export/storage-exp-go-count",masterDataVo,function(data){
            masters =data ;
            for(var i = 0 ;i<data.length;i++){
                retailAmount+=data[i].retailAmount;
                payAmount+=data[i].payAmount;
            }
        },'json');
        promise.done(function(){
            if(masters.length<=0){
                $.messager.alert('系统提示','数据库暂无数据','info');
                $("#importMaster").datagrid('loadData',[]);
                return;
            }
            $("#importMaster").datagrid('loadData',masters);
            $('#importMaster').datagrid('appendRow', {
                expName: "合计：",
                retailAmount: retailAmount,
                payAmount: payAmount
            });
            $("#importMaster").datagrid("autoMergeCells", ['expCode']);
        })
        masters.splice(0,masters.length);
        return promise;

    }
})