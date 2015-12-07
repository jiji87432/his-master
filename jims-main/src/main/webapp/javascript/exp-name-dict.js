/**
 * Created by heren on 2015/9/14.
 */
var expNameCas = [];//产品名称列表
var expTypes = [];//产品类型列表
var expCategorys = [];//产品类别列表

$(function () {
    var editIndex;
    var stopEdit = function () {
        if (editIndex || editIndex == 0) {
            $("#expNameDict").datagrid('endEdit', editIndex);
            $("#expDict").datagrid('endEdit', editIndex);
            editIndex = undefined;
        }
    }

    //设置工具栏高度
    $("#toolbardiv").treegrid({
        toolbar: '#topbar',
        height: 55
    });

    //产品名称、产品代码二选一切换
    $(".radios").click(function () {
        $(this).next().combogrid('enable');
        $(this).siblings(":radio").next().combogrid('clear');
        $(this).siblings(":radio").next().combogrid('disable');
    });

    //定义页面中部expNAmeDict列表
    $("#expNameDict").datagrid({
        title:'消耗品目录维护',
        toolbar: '#tb',
        footer: '#tbNameDict',
        height:'50%',
        singleSelect: true,
        columns: [[{
            title: '代码',
            field: 'expCode',
            width: "10%"
        }, {
            title: '品名',
            field: 'expName',
            width: "10%",
            editor: {type: 'text', options: {required: true}}
        }, {
            title: '拼音码',
            field: 'inputCode',
            width: "7%",
            editor: 'text'
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
        footer: '#tbDict',
        singleSelect: true,
        height: '50%',
        columns: [[{
            title: '代码',
            field: 'expCode',
            width: "10%"
        }, {
            title: '品名',
            field: 'expName',
            width: "10%"
        }, {
            title: '规格',
            field: 'expSpec',
            width: "7%",
            editor: {type: 'text', options: {required: true}}
        }, {
            title: '单位',
            field: 'units',
            width: "7%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'measuresName',
                    textField: 'measuresName',
                    method: 'get',
                    url: '/api/measures-dict/list'
                }
            }
        }, {
            title: '类型',
            field: 'expForm',
            width: "7%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'formName',
                    textField: 'formName',
                    method: 'get',
                    url: '/api/exp-form-dict/list'
                }
            }
        }, {
            title: '属性',
            field: 'toxiProperty',
            width: "7%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'toxiProperty',
                    textField: 'toxiProperty',
                    method: 'get',
                    url: '/api/exp-property-dict/list'
                }
            }
        }, {
            title: '单位数量',
            field: 'dosePerUnit',
            width: "7%",
            editor: 'numberbox'
        }, {
            title: '数量单位',
            field: 'doseUnits',
            width: "7%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'measuresName',
                    textField: 'measuresName',
                    method: 'get',
                    url: '/api/measures-dict/list'
                }
            }
        }, {
            title: '标志',
            field: 'storageCode',
            width: "7%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'name',
                    textField: 'name',
                    data: [{'code': '1', 'name': '全院产品'}, {'code': '2', 'name': '普通产品'}]
                }
            }
        }, {
            title: '是否包',
            field: 'expIndicator',
            width: "7%",
            editor: {
                type: 'combobox',
                options: {
                    panelHeight: 'auto',
                    valueField: 'code',
                    textField: 'name',
                    data: [{'code': 'true', 'name': '是'}, {'code': 'false', 'name': '否'}]
                }
            }
        }, {
            title: '输入码',
            field: 'inputCode',
            width: "10%",
            editor: 'text'
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
            panelHeight: 'auto',
            width: 200,
            data: expCategorys,
            valueField: 'formCode',
            textField: 'formName'
        });
    });

    //expNameDict数据添加
    $('#expNameDict').datagrid({
        height: 200,
        singleSelect: true,
        url: '',
        method: 'get',
        footer: '#ftEnd'
    });
    //expDict数据添加
    $('#expDict').datagrid({
        singleSelect: true,
        height: 300,
        url: '',
        method: 'get',
        footer: '#ftEd'
    });

    $("#fText").textbox({
        buttonText: 'Search',
        iconCls: 'icon-man',
        iconAlign: 'left'
    })

    //提取
    $("#filter").on('click',function(){
        var val = $(':radio:checked').next().combogrid('getValue');

        if (true) {
            //expNameDict数据添加
            $('#expNameDict').datagrid({
                height: 300,
                singleSelect: true,
                url: '/api/exp-name-dict/list?expCode=' + val,
                method: 'get',
                footer: '#tbNameDict'
            });
            //expDict数据添加
            $('#expDict').datagrid({
                height: 300,
                singleSelect: true,
                url: '/api/exp-dict/list-query?expCode=' + val,
                method: 'get',
                footer: '#tbDict'
            });
        } else {
            alert("请先选择产品名称或代码！");
        }
    });

    //清屏
    $("#clear").on('click',function(){
        $("#expNameDict").datagrid('loadData', {total: 0, rows: []});
        $("#expDict").datagrid('loadData', {total: 0, rows: []});
    });

    //保存
    $("#save").on('click',function(){
        if (editIndex || editIndex == 0) {
            $("#expNameDict").datagrid('endEdit', editIndex);
            $("#expDict").datagrid('endEdit', editIndex);
        }
        var insertNameData = $("#expNameDict").datagrid("getChanges", "inserted");
        var updateNameData = $("#expNameDict").datagrid('getChanges', "updated");
        var deleteNameData = $("#expNameDict").datagrid('getChanges', "deleted");

        var insertData = $("#expDict").datagrid("getChanges", "inserted");
        var updateData = $("#expDict").datagrid('getChanges', "updated");
        var deleteData = $("#expDict").datagrid('getChanges', "deleted");

        var expNameDictChangeVo = {};
        expNameDictChangeVo.inserted = insertNameData;
        expNameDictChangeVo.updated = updateNameData;
        expNameDictChangeVo.deleted = deleteNameData;

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
                $.messager.alert("系统提示", "保存成功", "info");
            }, function (data) {
                $.messager.alert('提示', data.responseJSON.errorMessage, "error");
            })
        }
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

    //增加ExpNameDict
    $("#addExpName").on('click',function(){
        stopEdit();
        var allRows = $('#expNameDict').datagrid("getRows");
        if (allRows.length > 0) {
            var code = $('#expNameDict').datagrid('getData').rows[allRows.length - 1].expCode;
            $('#expNameDict').datagrid('appendRow', {
                expCode: code, expName: '', inputCode: ''
            });
            var addRowIndex = $("#expNameDict").datagrid('getRowIndex', allRows[allRows.length - 1]);
            editIndex = addRowIndex;
            $("#expNameDict").datagrid('selectRow', editIndex);
            $("#expNameDict").datagrid('beginEdit', editIndex);
        } else {
            var getMax = newExpCode();
            console.log("getMax:" + getMax);
            if (getMax != "") {
                getMax.done(function () {
                    if (newCode != '') {
                        $('#expNameDict').datagrid('appendRow', {
                            expCode: newCode, expName: '', inputCode: ''
                        });
                        var rows = $("#expNameDict").datagrid("getRows");
                        var addRowIndex = $("#expNameDict").datagrid('getRowIndex', rows[rows.length - 1]);
                        editIndex = addRowIndex;
                        $("#expNameDict").datagrid('selectRow', editIndex);
                        $("#expNameDict").datagrid('beginEdit', editIndex);
                    }
                })
            }

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
                    editIndex = undefined;
                }
            })

        }
    });
    //添加ExpDict
    $("#appendExp").on('click',function(){
        stopEdit();
        var allRowsTop = $('#expNameDict').datagrid("getRows");
        var allRowsBottom = $('#expDict').datagrid("getRows");
        var code = "";
        var name = "";

        if (allRowsBottom.length <= 0 && allRowsTop.length <= 0) {

        } else {
            if (allRowsBottom.length > 0) {
                code = $('#expDict').datagrid('getData').rows[allRowsBottom.length - 1].expCode;
                name = $('#expDict').datagrid('getData').rows[allRowsBottom.length - 1].expName;
            } else if (allRowsBottom.length <= 0 && allRowsTop.length > 0) {
                code = $('#expNameDict').datagrid('getData').rows[allRowsTop.length - 1].expCode;
                name = $('#expNameDict').datagrid('getData').rows[allRowsTop.length - 1].expName
            }
            $('#expDict').datagrid('appendRow', {
                expCode: code, expName: name, expSpec: '', units: '', expForm: '', toxiProperty: '', dosePerUnit: '',
                doseUnits: '', storageCode: '', expIndicator: '', inputCode: ''
            });

            var rows = $("#expDict").datagrid("getRows");
            var addRowIndex = $("#expDict").datagrid('getRowIndex', rows[rows.length - 1]);
            editIndex = addRowIndex;
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

        } else {
            $.messager.alert("提示", "请提取查询价格的行", "info");
        }
    });

});


