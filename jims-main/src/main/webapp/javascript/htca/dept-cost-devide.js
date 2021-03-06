/**
 * Created by heren on 2015/12/2.
 */
//一线科室成本提取
$(function () {

    var depts = undefined;
    var costItemIds = [] ;//删除的成本项目
    var incomeDeptId = undefined;
    var acctDeptDict = [];
    $.get("/api/acct-dept-dict/acct-list?hospitalId=" + parent.config.hospitalId, function (data) {
        acctDeptDict = data;
    });

    var costItems = [];
    $.get("/api/cost-item/list-item?hospitalId=" + parent.config.hospitalId, function (data) {
        //costItems = data ;
        for (var i = 0; i < data.length; i++) {
            costItems.push(data[i])
        }
    })
    $.get("/api/service-income-type/list-all?hospitalId=" + parent.config.hospitalId, function (data) {
        for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].id;
            obj.costItemName = data[i].serviceTypeName;
            costItems.push(obj);
        }
    });
    $.get("/api/service-income-type/list-detail?hospitalId=" + parent.config.hospitalId, function (data) {
        console.log("3")
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].id;
            obj.costItemName = data[i].incomeDetailName;
            costItems.push(obj);
        }
    });

    var editRow = undefined;
    var p = $('#fetchDate').datebox('panel');//日期选择对象
    var tds = false; //日期选择对象中月份
    var span = p.find('span.calendar-text'); //显示月份层的触发控件
    $("#fetchDate").datebox({
        onShowPanel: function () {//显示日趋选择对象后再触发弹出月份层的事件，初始化时没有生成月份层
            span.trigger('click'); //触发click事件弹出月份层
            if (!tds) setTimeout(function () {//延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔
                tds = p.find('div.calendar-menu-month-inner td');
                tds.click(function (e) {
                    $(this).addClass("calendar-selected")
                    e.stopPropagation(); //禁止冒泡执行easyui给月份绑定的事件
                    var year = /\d{4}/.exec(span.html())[0]//得到年份
                    var month = parseInt($(this).attr('abbr'), 10) + 1; //月份
                    $("#fetchDate").datebox('hidePanel').datebox('setValue', year + "-" + month)
                    setButton(year,month) ;
                });
            }, 0)
        },
        parser: function (s) {//配置parser，返回选择的日期
            if (!s) return new Date();
            var arr = s.split('-');
            return new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, 1);
        },
        formatter: function (d) {
            var year = d.getFullYear();
            var month = d.getMonth();
            if (month == 0) {
                month = 12;
                year = year - 1;
            }
            if (month < 10) {
                return year + '-0' + month;
            }
            return year + '-' + month;

        }//配置formatter，只返回年月
    });
    //设置按钮的使用状态
    var setButton = function(year,month){
        var yearM = undefined ;
        if(month==0){
            year = year -1 ;
            month = 12 ;
        }else{
            month = month -1 ;
        }

        if(month< 10 ){
            yearM = year+"-0"+month ;
        }else{
            yearM = year +"-"+month ;
        }

        $.get("/api/acct-save-record/get?hospitalId="+parent.config.hospitalId+"&yearMonth="+yearM,function(data){

            if(data=="failure"){//尚未结存
                $(".easyui-linkbutton").linkbutton("enable") ;
            }
            if(data=="success"){
                $(".easyui-linkbutton").linkbutton("disable") ;
            }
        })
        //查询结存记录
    }
    $("#serviceDeptIncomeId").combobox({
        textField: 'deptName',
        valueField: 'id',
        method: 'GET',
        url: "/api/acct-dept-dict/acct-list?hospitalId=" + parent.config.hospitalId,
        onLoadSuccess: function () {
            var acctDeptId = parent.config.acctDeptId;
            if (acctDeptId) {
                $(this).combobox('setValue', acctDeptId);
            } else {
                if (acctDeptDict.length > 0) {
                    $(this).combobox('setValue', acctDeptDict[0].id);
                }
            }
        }
    });


    $("#deptCostTable").datagrid({
        fit: true,
        fitColumns: true,
        method: 'GET',
        checkOnSelect: true,
        striped: true,
        singleSelect: false,
        toolbar: '#ft',
        method: 'GET',
        pageSize: 100,
        pageList: [50, 100, 200, 300],
        pagination: true,
        loadMsg: '数据正在加载，请稍后......',
        columns: [[{
            title: 'id',
            field: 'id',
            checkbox: true
        }, {
            title: '核算单元',
            field: 'acctDeptId',
            width: '20%',
            formatter: function (value, row, index) {
                for (var i = 0; i < acctDeptDict.length; i++) {
                    if (value == acctDeptDict[i].id) {
                        return acctDeptDict[i].deptName;
                    }
                }
                return value;
            }
        }, {
            title: '成本类型',
            field: 'costItemId',
            width: '10%',
            formatter: function (value, row, index) {
                console.log(costItems);
                for (var i = 0; i < costItems.length; i++) {
                    if (value == costItems[i].id) {
                        return costItems[i].costItemName;
                    }
                }
                return value;
            }
        }, {
            title: '成本金额',
            field: 'cost',
            width: '10%',
            editor: {
                type: 'validatebox', options: {
                    validType: 'number'
                }
            },
            formatter: function (value, row, index) {
                return parseFloat(value).toFixed(2);
            }
        }, {
            title: '减免成本',
            field: 'minusCost',
            width: '10%',
            editor: {
                type: 'validatebox', options: {
                    validType: 'number'
                }
            }
        }, {
            title: '备注信息',
            field: 'memo',
            width: '30%',
            editor: {type: 'textbox', options: {}}
        }, {
            title: '取得方式',
            field: 'fetchWay',
            width: '10%'
        }]],
        onLoadSuccess: function (data) {
            var row = {};
            row.acctDeptId = "费用合计";
            row.cost = 0.0;
            console.log(data);
            for (var i = 0; i < data.rows.length; i++) {
                row.cost += parseFloat(data.rows[i].cost);
            }
            $(this).datagrid('insertRow', {
                index: 0,
                row: row
            });
        }
    });
    //设置分页
    var p1 = $('#deptCostTable').datagrid('getPager');
    $(p1).pagination({
        pageSize: 100,//每页显示的记录条数，默认为10
        pageList: [50, 100, 200, 300],//可以设置每页记录条数的列表
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
    });
    //成本提取
    $("#devideSetBtn").on('click', function () {
        var yearMonth = $("#fetchDate").datebox('getValue');
        if (!yearMonth) {
            $.messager.alert("系统提示", "请选择计算成本月份", "info");
            return;
        }
        $("#itemWin").window('open');
    });

    $("#fetchType").combobox({
        textField: 'paramName',
        valueField: 'id',
        method: 'GET',
        url: '/api/acct-param/list-by-type?hospitalId=' + parent.config.hospitalId + "&fetchType=cost_fetch_type",
        onLoadSuccess: function () {
            var data = $(this).combobox('getData');
            if (data.length > 0) {
                $(this).combobox('setValue', data[0].id)
            }
        }
    });


    //查看汇总信息
    $("#saveDevideBtn").on('click', function () {
        var yearMonth = $("#fetchDate").datebox('getValue');
        if (!yearMonth) {
            $.messager.alert("系统提示", "获取分摊月份出错", "info");
            return;
        }
        if (!incomeDeptId) {
            $.messager.alert("系统提示", "登记核算单元为空，不能够进行保存", "error");
            return;
        }

        var rows = $("#deptCostTable").datagrid('getRows');
        if (rows.length <= 1) {
            $.messager.alert('系统提示', '没有要保存的数据....', 'info');
            return;
        }
        var costItemId = rows[1].costItemId;
        if (!costItemId) {
            $.messager.alert('系统提示', '获取成本类型错误', 'info');
        }
        for (var i = 0; i < rows.length; i++) {
            rows[i].hospitalId = parent.config.hospitalId;
            rows[i].operator = parent.config.loginId;
            rows[i].operatorDate = new Date();
        }
        rows.shift();
        $.get("/api/acct-dept-cost/list?hospitalId=" + parent.config.hospitalId + "&yearMonth=" + yearMonth + "&costItemId=" + costItemId, function (data) {
            if (data.length > 0) {
                $.messager.confirm("系统提示","本月份已经存在此成本的分摊数据，选择确定合并分摊结果，选择取消覆盖分摊结果",function(v){
                    if(v){
                        $.postJSON("/api/acct-dept-cost/save-dept-devide/1/" + incomeDeptId, rows, function (data) {
                            $.messager.alert('系统提示', '保存成功', 'info');
                        }, function (data) {
                        })
                    }else{
                        $.postJSON("/api/acct-dept-cost/save-dept-devide/0/" + incomeDeptId, rows, function (data) {
                            $.messager.alert('系统提示', '保存成功', 'info');
                        }, function (data) {

                        })
                    }
                })
            }else{
                $.postJSON("/api/acct-dept-cost/save-dept-devide/0/" + incomeDeptId, rows, function (data) {
                    $.messager.alert('系统提示', '保存成功', 'info');
                }, function (data) {

                })
            }
        })

        //$.postJSON("")
    });


    $("#costItemId").combobox({
        textField: 'costItemName',
        valueField: 'id',
        method: 'GET',
        url: '/api/cost-item/list-by-class?hospitalId=' + parent.config.hospitalId + "&classId=4028803e519f790001519fac9c760009",
        onLoadSuccess: function () {
            var data = $(this).combobox('getData');
            if (data.length > 0) {
                $(this).combobox('setValue', data[0].id);
            }
        }
    });

    $("#devideWay").combobox({
        textField: "name",
        valueField: "id",
        data: [{
            name: '人员分摊法',
            id: '0',
            selected: true
        }, {
            name: '面积分摊法',
            id: '1'
        }, {
            name: '平均分摊法',
            id: '2'
        }, {
            name: '护理单元占床日分摊',
            id: '3'
        }],
        onSelect: function (record) {
            if (record.id == '2') {
                $("#acctDeptWin").window('open')
            } else {
                depts = undefined;
            }
        }
    });

    $("#itemWin").window({
        modal: true,
        closed: true
    });



    //分摊计算
    $("#devideBtn").on('click', function () {
        var yearMonth = $("#fetchDate").datebox('getValue');
        if (!yearMonth) {
            $.messager.alert('系统提示', '获取日期失败', 'info');
            return;
        }
        var costItemId = $("#costItemId").combobox('getValue');
        if (!costItemId) {
            $.messager.alert('系统提示', '请选择成本项目', 'error');
            return;
        }

        var devideWay = $("#devideWay").combobox('getValue');
        if (!devideWay) {
            $.messager.alert('系统提示', '请选择分摊方法', 'error');
            return;
        }

        if (devideWay == '2' && !depts) {
            $.messager.alert('系统提示', '平均分摊法需要设置分摊核算单元', 'error');
            return;
        }

        var totalMoney = $("#devideMoney").textbox('getValue');
        if (!totalMoney) {
            $.messager.alert('系统提示', '请填写分摊金额', 'error');
            return;
        }
        $.messager.progress({
            title: '系统提示',
            msg: '正在加载中，请稍后....',
            text: '正在分摊...'
        });

        $.get("/api/cost-item/get-by-id?id=" + costItemId, function (data) {
            if (data.addRate > 0) {
                totalMoney = totalMoney * data.addRate;
            }
            if (depts) {
                $.get("/api/acct-dept-cost/cost-devide?hospitalId=" + parent.config.hospitalId + "&yearMonth=" + yearMonth +
                "&costItemId=" + costItemId + "&devideWay=" + devideWay + "&totalMoney=" + totalMoney + "&depts=" + depts, function (data) {
                    if (data) {
                        $.messager.alert('系统提示', '分摊成功', 'info');
                        $("#deptCostTable").datagrid('loadData', data);
                        $("#itemWin").window('close');
                        $.messager.progress('close');
                        incomeDeptId = $("#serviceDeptIncomeId").combobox('getValue');
                    } else {
                        $.messager.alert("系统提示", "分摊设置出现错误", 'error');
                        $("#itemWin").window('close');
                        $.messager.progress('close');
                    }
                })
            } else {
                $.get("/api/acct-dept-cost/cost-devide?hospitalId=" + parent.config.hospitalId + "&yearMonth=" + yearMonth +
                "&costItemId=" + costItemId + "&devideWay=" + devideWay + "&totalMoney=" + totalMoney, function (data) {
                    if (data) {
                        $.messager.alert('系统提示', '分摊成功', 'info');
                        $("#deptCostTable").datagrid('loadData', data);
                        $("#itemWin").window('close');
                        $.messager.progress('close');
                        incomeDeptId = $("#serviceDeptIncomeId").combobox('getValue');
                    } else {
                        $.messager.alert("系统提示", "分摊设置出现错误", 'error');
                        $("#itemWin").window('close');
                        $.messager.progress('close');
                    }
                })
            }
        })
    })


    //设置分摊项目的对照科室
    $("#acctDeptWin").window({
        title: '分摊项目设置',
        width: '500',
        height: '500',
        modal: true,
        closed: true,
        onOpen: function () {
            $(this).window('center');
        }
    });


    //删除成本窗口
    $("#deleteAcctDeptCostWindow").window({
        title:'待删除成本项目',
        width:'500',
        height:'500',
        modal:true,
        closed:true,
        onOpen:function(){
            $(this).window('center')
        }
    }) ;

    //成本项目表格
    $("#delAcctDeptCostItemTb").datagrid({
        method: 'GET',
        fit: true,
        fitColumns: true,
        url: '/api/cost-item/list-by-class?hospitalId=' + parent.config.hospitalId + "&classId=4028803e519f790001519fac9c760009",
        columns: [[{
            title: "编号",
            field: 'id',
            checkbox: true
        }, {
            title: '成本名称',
            field: 'costItemName',
            width: '80%'
        }]]
    })

    $("#acctDeptTable").datagrid({
        method: 'GET',
        fit: true,
        fitColumns: true,
        url: '/api/acct-dept-dict/list-end-dept?hospitalId=' + parent.config.hospitalId,
        columns: [[{
            title: "编号",
            field: 'id',
            checkbox: true
        }, {
            title: '科室名称',
            field: 'deptName',
            width: '50%'
        }, {
            title: '科室代码',
            field: 'deptCode',
            width: '50%'
        }]]
    });

    //删除取消按钮
    $("#cancelDelAcctDeptBtn").on('click',function(){
        $("#deleteAcctDeptCostWindow").window('close');
    })

    //删除按钮
    $("#delAcctDeptBtn").on('click',function(){
        var rows = $("#delAcctDeptCostItemTb").datagrid('getSelections');
        costItemIds=[] ;
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                costItemIds.push(rows[i].id);
            }
        }

        if(costItemIds.length<=0){
            $.messager.alert('系统提示', '没有选择要删除的成本，请选择', 'info');
            return ;
        }
        var yearMonth = $("#fetchDate").datebox('getValue');
        if (!yearMonth) {
            $.messager.alert('系统提示', '获取日期失败', 'info');
            return;
        }

        $.postJSON("/api/acct-dept-cost/del-cost?yearMonth="+yearMonth,costItemIds,function(data){
            if(data=='OK'){

                $.messager.alert("删除成功");
                $("#deleteAcctDeptCostWindow").window('close');
            }

        })



    })

    $("#delDevideBtn").on("click",function(){
        $("#deleteAcctDeptCostWindow").window("open")
    })

    //取消按钮
    $("#cancelAcctDeptBtn").on('click', function () {
        $("#acctDeptWin").window('close');
    });

    $("#saveAcctDeptBtn").on('click', function () {
        var rows = $("#acctDeptTable").datagrid('getSelections');
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                if (i == 0) {
                    depts = rows[i].id;
                }
                if (i > 0) {
                    depts = depts + ";" + rows[i].id;
                }
            }
        }
        $("#acctDeptWin").window('close');
    })

    $("#closeBtn").on("click", function () {
        //取消按钮
        $("#itemWin").window('close');
    })


    //根据当前时间获取上一个月份的数据
    $("#sameWithLastMonth").on('click',function(){
        var yearMonth = $("#fetchDate").datebox('getValue');
        if (!yearMonth) {
            $.messager.alert('系统提示', '获取日期失败', 'info');
            return;
        }
        var costItemId = $("#costItemId").combobox('getValue');
        if (!costItemId) {
            $.messager.alert('系统提示', '请选择成本项目', 'error');
            return;
        }


        $.post("/api/acct-dept-cost/save-last?hospitalId=" + parent.config.hospitalId + "&yearMonth=" + yearMonth +
        "&costItemId=" + costItemId, function(data){
            //alert("Data Loaded: " + data);
            if(data=="ok"){
                $.messager.alert("系统提示","已经同步完成，请在成本和收入报表中查看！","info") ;
            }else{
                $.messager.alert("系统提示","同步失败,请尝试另外的录入方式",'info') ;
            }
        });





    })
});

