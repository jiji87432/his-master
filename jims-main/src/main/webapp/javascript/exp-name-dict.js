/**
 * Created by heren on 2015/9/14.
 */
var expNameCas = [];//产品名称列表
var expTypes = [];//产品类型列表
var expCategorys = [];//产品类别列表
var codeArrays = [];//新生成的expCode数组
$(function () {
    var editIndex;
    var stopEdit = function () {
        if (editIndex || editIndex == 0) {
            $("#expNameDict").datagrid('endEdit', editIndex);
            $("#expDict").datagrid('endEdit', editIndex);
            editIndex = undefined;
        }
    }

    //产品名称、产品代码二选一切换
    $(".radios").click(function () {
        $(this).next().combogrid('enable');
        $(this).siblings(":radio").next().combogrid('clear');
        $(this).siblings(":radio").next().combogrid('disable');
    });

    //定义expName
    $('#expName').combogrid({
        panelWidth: 500,
        idField: 'expCode',
        textField: 'expName',
        loadMsg: '数据正在加载',
        url: "/api/exp-name-dict/list-exp-name-by-input",
        mode: 'remote',
        method: 'GET',
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
    //定义expCode
    $('#expCode').combogrid({
        panelWidth: 500,
        idField: 'expCode',
        textField: 'expName',
        loadMsg: '数据正在加载',
        url: "/api/exp-name-dict/list-exp-name-by-input",
        mode: 'remote',
        method: 'GET',
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

    //产品类型数据加载
    var expClassDictPromise = $.get("/api/exp-class-dict/list", function (data) {
        $.each(data, function (index, item) {
            var en = {};
            en.classCode = item.classCode;
            en.className = item.className + "(" + item.classCode + ")";
            expTypes.push(en);
        });

        $('#expType').combobox({
            panelHeight: 255,
            width: 200,
            data: expTypes,
            valueField: 'classCode',
            textField: 'className'
        });
    });


    //产品类别数据加载
    var expFormDictPromise = $.get("/api/exp-form-dict/list", function (data) {
        $.each(data, function (index, item) {
            var ec = {};
            ec.formCode = item.formCode;
            ec.formName = item.formName;
            expCategorys.push(ec);
        });
        var all = {};
        all.formCode = '';
        all.formName = '全部';
        expCategorys.unshift(all);

        $('#expCategory').combobox({
            panelHeight: 200,
            width: 200,
            data: expCategorys,
            valueField: 'formCode',
            textField: 'formName'
        });
    });

    //定义页面中部expNAmeDict列表
    $("#expNameDict").datagrid({
        title: '产品名称',
        footer: '#tbNameDict',
        singleSelect: true,
        fit:true,
        columns: [[{
            title: '代码',
            field: 'expCode',
            align: 'center',
            width: "40%",
            onchange:function(newValue,oldValue){

            }
        }, {
            title: '品名',
            field: 'expName',
            align: 'center',
            width: "40%",
            editor: {type: 'text', options: {required: true}}
        }
        ]],
        onClickRow: function (index, row) {
            stopEdit();
            if (row.columnProtect != 1) {
                $(this).datagrid('beginEdit', index);
                editIndex = index;
            }
        }
    });
    //定义页面下方expDict列表
    $("#expDict").datagrid({
        title:'产品属性',
        footer: '#tbDict',
        singleSelect: true,
        fit: true,
        columns: [[{
            title: '代码',
            field: 'expCode',
            align: 'center',
            width: "10%"
        }, {
            title: '品名',
            field: 'expName',
            align: 'center',
            width: "10%"
        }, {
            title: '规格',
            field: 'expSpec',
            align: 'center',
            width: "9%",
            editor: {type: 'text', options: {required: true}}
        }, {
            title: '单位',
            field: 'units',
            align: 'center',
            width: "10%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 200,
                    valueField: 'measuresName',
                    textField: 'measuresName',
                    method: 'get',
                    url: '/api/measures-dict/list',
                    filter: function (q, row) {
                        var opts = $(this).combobox('options');
                        var r=$("#expDict").datagrid("getData").rows[editIndex];
                        r.doseUnits=row[opts.textField];
                    }
                 }
            }
          },{
            title: '产品类型',
            field: 'expForm',
            align: 'center',
            width: "10%",
            editable:false
//            editor: {
//                type: 'combobox',
//                options: {
//                    panelHeight: 200,
//                    valueField: 'formName',
//                    textField: 'formName',
//                    method: 'get',
//                    url: '/api/exp-form-dict/list'
//                }
//            }
        }, {
            title: '属性',
            field: 'toxiProperty',
            align: 'center',
            hidden:false,
            width: "10%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 200,
                    valueField: 'toxiProperty',
                    textField: 'toxiProperty',
                    method: 'get',
                    url: '/api/exp-property-dict/list'
                }
            }
        }, {
            title: '单位数量',
            field: 'dosePerUnit',
            align: 'center',
            width: "10%",
            editable:false
        }, {
            title: '数量单位',
            field: 'doseUnits',
            align: 'center',
//            hidden:true,
            width: "10%",
            editable:false
//            editor: {
//                type: 'combobox',
//                options: {
//                    panelHeight: 200,
//                    valueField: 'measuresName',
//                    textField: 'measuresName',
//                    method: 'get',
//                    url: '/api/measures-dict/list'
//                }
//            }
        }, {
            title: 'storageCode',
            field: 'storageCode',
            hidden:true
        },{
            title: '是否包',
            field: 'singleGroupIndicator',
            align: 'center',
            width: "10%",
            hidden:true,
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'code',
                    textField: 'name',
                    data: [{'code': '1', 'name': '是'}, {'code': '2', 'name': '否'}]
                }
            },
            formatter:function(value,row,index){
                if(value=="1"){
                    value = "是";
                }
                else if(value=="2"){
                    value="否";
                }
                else if(value=="S"){
                    value = "是";
                }else{
                    value ="是";
                }
                return value;
            }
        }, {
            title: '产品范围',
            field: 'expIndicator',
            align: 'center',
            width: "11%",
            editable:false
//            editor: {
//                type: 'combobox',
//                options: {
//                    panelHeight: 'auto',
//                    valueField: 'code',
//                    textField: 'name',
//                    data: [{'code': '1', 'name': '全院产品'}, {'code': '2', 'name': '普通产品'}]
//                }
//            },
//             formatter:function(value,row,index){
//                if(value=="1"){
//                    value="全院产品";
//                }else if(value == "2"){
//                    value = "普通产品";
//                }
//                return value;
//            }
        }
        ]],
        onClickRow: function (index, row) {
            stopEdit();
            //if (row.columnProtect != 1) {
            //    $(this).datagrid('beginEdit', index);
            //    editIndex = index;
            //}

            $(this).datagrid('beginEdit', index);
            editIndex = index;
        }
    });

    $("#top").datagrid({
        toolbar: '#tb',
        border: false
    });
    $("#bottom").datagrid({
        footer: '#ft',
        border: false
    });

    $('#dg').layout('panel', 'north').panel('resize', {height: 'auto'});
    $('#dg').layout('panel', 'south').panel('resize', {height: 'auto'});

    $("#dg").layout({
        fit: true
    });

    $("#fText").textbox({
        buttonText: 'Search',
        iconCls: 'icon-man',
        iconAlign: 'left'
    })

    //提取
    $("#filter").on('click',function(){
        $("#clear").click();
        var val = $(':radio:checked').next().combogrid('getValue');
        $("#listPrice").linkbutton("enable");
        if (val) {
            //expNameDict数据添加
            $.get('/api/exp-name-dict/list?expCode=' + val, function (data) {
                if (data.length == 0) {
                    $.messager.alert("提示", "数据库暂无数据", "info");
                    $("#expNameDict").datagrid("loadData", {rows: []});
                } else {
                    $.each(data, function (index, item) {
                        item.columnProtect = 1;
                    });
                    $("#expNameDict").datagrid("loadData", data);
                }
            });
            //expDict数据添加
            $.get('/api/exp-dict/list-query?expCode=' + val, function (data) {
                if (data.length == 0) {
                    $.messager.alert("提示", "数据库暂无数据", "info");
                    $("#expDict").datagrid("loadData", {rows: []});
                } else {
                    $.each(data, function (index, item) {
                        item.columnProtect = 1;
                    });
                    $("#expDict").datagrid("loadData", data);
                }
            });
        } else {
            $.messager.alert("提示","请先选择产品名称或代码！","info");
        }
    });

    //清屏
    $("#clear").on('click',function(){
        $("#expNameDict").datagrid('loadData', {total: 0, rows: []});
        $("#expDict").datagrid('loadData', {total: 0, rows: []});
    });

    //保存
    $("#save").on('click',function(){
        var row = $("#expDict").datagrid('getData').rows[editIndex];
        row.doseUnits=row.units;
        if(row.columnProtect){
            delete row.columnProtect;
        }
        if (editIndex || editIndex == 0) {
            $("#expNameDict").datagrid('endEdit', editIndex);
            $("#expDict").datagrid('endEdit', editIndex);
        }

        var expDictRows =$("#expDict").datagrid('getRows');

        for(var i = 0 ;i<expDictRows.length;i++){

            for(var j=0 ;j<expDictRows.length;j++){
                if(j==i){
                    continue ;
                }else{
                    if(expDictRows[i].expSpec==expDictRows[j].expSpec){
                        $.messager.alert("系统提示","存在相同规格小的数据，请处理后在保存");
                        return ;
                    }
                }
            }
        }

        var insertNameData = $("#expNameDict").datagrid("getChanges", "inserted");
        var updateNameData = $("#expNameDict").datagrid('getChanges', "updated");
        var deleteNameData = $("#expNameDict").datagrid('getChanges', "deleted");
//        if(insertNameData.length>0||updateNameData.length>0||deleteNameData.length>0){
            $.each(insertNameData, function (index, item) {
                item.stdIndicator = 1;
            });
            $.each(updateNameData, function (index, item) {
                item.stdIndicator = 1;
            })
            var insertData = $("#expDict").datagrid("getChanges", "inserted");

            for(var i=0;i<insertData.length;i++){
                insertData[i].doseUnits=insertData[i].units;
                if(insertData[i].expIndicator=="全院产品"){
                    insertData[i].expIndicator="1";
                }
                if(insertData[i].expIndicator=="普通产品"){
                    insertData[i].expIndicator="2";
                }

                insertData[i].doseUnits=insertData[i].units;
                if($.trim(insertData[i].expSpec)==""|| $.trim(insertData[i].expName) == ""|| $.trim(insertData[i].units) == ""|| $.trim(insertData[i].expForm) == ""|| $.trim(insertData[i].dosePerUnit) == ""|| $.trim(insertData[i].doseUnits) == ""|| $.trim(insertData[i].expIndicator) == ""){
                    $.messager.alert('系统提示', '请检查数据完整型！', 'info');
                    return;
                }
            }
            var updateData = $("#expDict").datagrid('getChanges', "updated");
            var deleteData = $("#expDict").datagrid('getChanges', "deleted");
//            alert("qqq "+insertData.length)
            if (insertData.length > 0 || updateData.length > 0 || deleteData.length > 0) {
            var expNameDictChangeVo = {};
            expNameDictChangeVo.inserted = insertNameData;
            expNameDictChangeVo.updated = updateNameData;
            expNameDictChangeVo.deleted = deleteNameData;
            if(insertData.length>1){
                $.messager.alert("系统提示","若维护多个规格，请到价格维护功能进行操作！","error");
                return;
            }
            var expDictChangeVo = {};
            expDictChangeVo.inserted = insertData;
            expDictChangeVo.updated = updateData;
            expDictChangeVo.deleted = deleteData;

            var beanChangeVo = {};
            beanChangeVo.expDictBeanChangeVo = expDictChangeVo;
            beanChangeVo.expNameDictBeanChangeVo = expNameDictChangeVo;
            console.log(beanChangeVo);

            if (beanChangeVo) {
                $.postJSON("/api/exp-name-dict/save", beanChangeVo, function (data) {
                    $.messager.confirm("系统提示", "保存成功,请维护价格信息！", function(r){
                        if(r){
                            $("#listPrice").linkbutton("enable");
                            $("#listPrice").trigger('click');
                        }else{
                            $("#clear").click();
                            codeArrays = [];
                        }
                    });


                }, function (data) {
                    $.messager.alert('提示', data.responseJSON.errorMessage, "error");
                })
            }
            } else {
                $.messager.alert('系统提示', '没有需要保存的信息，请规范操作系统！', 'info');
                return;
            }
//        }else{
//            $.messager.alert('系统提示','没有需要保存的信息，请规范操作系统！','info');
//            return;
//        }

    });

    //生成10位代码
    var newCode = "";
    var newExpCode = function () {
        var scope = $("#expScope").combobox('getValue');//产品范围
        newCode = '0' + scope;
        var category = $("#expCategory").combobox('getValue');//产品类别
        category == '' ? newCode : newCode += category;
        var type = $("#expType").combobox('getValue');//产品类型
        if (type == '') {
            $.messager.alert("系统提示", "产品类型不能为空,请选择产品类型！", "error");
            return '';
        } else {
            type == '' ? newCode : newCode += type;
        }
        var ll_len = newCode.length;
        var max = "";
        var getMax;
        if (ll_len < 10) {
            getMax = $.get("/api/exp-name-dict/list-max-exp-code?length=" + ll_len + "&header=" + newCode, function (data) {
                max = data + "";
                while (10 - newCode.length > max.length) {
                    max = '0' + max;
                }
                newCode = newCode + max;
            });
        }

        return getMax;
    }
    //当增加多条信息时，newCode从数据库获取的是相同的最大值，这是需要在js里面手动增大max值与前面的固定六位数字拼接
    var existCode = function(){
        if(codeArrays.length > 0){
            for (var i = 0; i < codeArrays.length; i++) {
                if (codeArrays[i] == newCode){
                    var num = newCode.substr(6, 4);
                    num = parseInt(num) + 1;
                    var max = num+"";
                    newCode = newCode.substr(0, 6);
                    while (10 - newCode.length > max.length) {
                        max = '0' + max;
                    }
                    newCode = newCode + max;
                }
            }
        }
        return newCode;
    }
    //增加ExpNameDict
    $("#addExpName").on('click',function(){
        stopEdit();
        $("#listPrice").linkbutton("disable");
        var rowLength = $('#expNameDict').datagrid("getRows");
        if(rowLength.length==1){
            $.messager.alert('系统消息','请维护好之前的产品之后再点击新增！','info');
            return;
        }
        var getMax = newExpCode();
        console.log("getMax:" + getMax);
        if (getMax != "") {
            getMax.done(function () {

                if (newCode != '') {
                    //newCode = existCode();
                    console.log("newCode:" + newCode);
                    $('#expNameDict').datagrid('appendRow', {
                        expCode: newCode, expName: ''
                    });
                    codeArrays.push(newCode);
                    var rows = $("#expNameDict").datagrid("getRows");
                    var addRowIndex = $("#expNameDict").datagrid('getRowIndex', rows[rows.length - 1]);
                    editIndex = addRowIndex;
                    $("#expNameDict").datagrid('selectRow', editIndex);
                    $("#expNameDict").datagrid('beginEdit', editIndex);
                }
            })
        }

    });

    //删除ExpNameDict
    $("#removeExpName").on('click',function(){
        var row = $('#expNameDict').datagrid('getSelected');
        var index = $('#expNameDict').datagrid('getRowIndex', row);
        if (index == -1) {
            $.messager.alert("提示", "请选择删除的行", "info");
        } else {
            $.get("/api/exp-price-list/get-exp-price-list?expCode=" + row.expCode, function (data) {
                if (data.length > 0 && row.id) {
                    $.messager.alert("提示", "已经存在该产品的价格等信息，不允许删除！", "info");
                } else {
                    $('#expNameDict').datagrid('deleteRow', index);
                    $("#expDict").datagrid('loadData', {total: 0, rows: []});
                    editIndex = undefined;
                }
            })

        }
    });
    //添加ExpDict
    $("#appendExp").on('click',function(){
        /**
         *  产品范围：<select id="expScope" class="easyui-combobox" name="state" style="width:200px ;" data-options="panelHeight:'auto' " >
         <option value="1" selected>全院产品</option>
         <option value="2">普通产品</option>
         </select>
         产品类别：<select id="expType" class="easyui-combobox"></select>
         产品类型：<select id="expCategory" class="easyui-combobox"></select>
         */
        stopEdit();
        $("#listPrice").linkbutton("disable");
        var allRowsTop = $('#expNameDict').datagrid("getRows");
        var allRowsBottom = $('#expDict').datagrid("getRows");
        var code = "";
        var name = "";
        var row = $('#expNameDict').datagrid('getSelected');
        if (allRowsBottom.length <= 0 && allRowsTop.length <= 0) {
            $.messager.alert("提示", "请首先添加产品名称！", "error");
        } else if (!row) {
            $.messager.alert("提示", "请首先选中产品名称！", "error");
        }else {
            code = row.expCode;
            name = row.expName;

            $('#expDict').datagrid('appendRow', {
                expCode: code, expName: name, expSpec: '', units: '', expForm:$("#expCategory").combobox("getText"), toxiProperty: '', dosePerUnit: '1',
                doseUnits: '', storageCode: parent.config.storageCode, expIndicator:$("#expScope").combobox("getText")
            });
            var rows = $("#expDict").datagrid("getRows");
            var addRowIndex = $("#expDict").datagrid('getRowIndex', rows[rows.length - 1]);
            editIndex = addRowIndex;
//            if(rows[editIndex].units!=""){
//                rows[editIndex].doseUnits=  rows[editIndex].units;
//            }
            $("#expDict").datagrid('selectRow', editIndex);
            $("#expDict").datagrid('beginEdit', editIndex);
        }
    });
    //删除expDict
    $("#removeExp").on('click', function () {
        var row = $('#expDict').datagrid('getSelected');
        var index = $('#expDict').datagrid('getRowIndex', row);
        if (index == -1) {
            $.messager.alert("提示", "请选择删除的行", "info");
        } else {
            $.get("/api/exp-price-list/get-exp-price-list?expCode=" + row.expCode, function (data) {
                if (data.length > 0&&row.id) {
                    $.messager.alert("提示", "已经存在该产品的价格等信息，不允许删除！", "info");
                } else {
                    $('#expDict').datagrid('deleteRow', index);
                    editIndex = undefined;
                }
            })
        }
    });

    //价格
    $("#listPrice").on('click', function () {
        if ($('#expDict').datagrid("getRows").length > 0) {
            var code = $('#expDict').datagrid('getData').rows[0].expCode;
            var name = $('#expDict').datagrid('getData').rows[0].expName;
            setCookie("exp_code", code);
            setCookie("exp_name", name);
            parent.addTab('产品价格维护', '/his/ieqm/exp-price-list');
            $("#clear").click();
            codeArrays = [];
        } else {
            $.messager.alert("提示", "请选取维护价格的行", "info");
        }
    });

});


