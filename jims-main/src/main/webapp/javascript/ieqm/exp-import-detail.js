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

$(function () {
    var editIndex;
    var stopEdit = function () {
        if (editIndex || editIndex == 0) {
            $("#dg").datagrid('endEdit', editIndex);
            editIndex = undefined;
        }
    }
    //格式化日期函数
    function formatterDate(val, row) {
        if (val != null) {
            var date = new Date(val);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
//            var h = date.getHours();
//            var mm = date.getMinutes();
//            var s = date.getSeconds();
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d);
//                + (h < 10 ? ("0" + h) : h) + ":" + (mm < 10 ? ("0" + mm) : mm) + ":" + (s < 10 ? ("0" + s) : s);
            return dateTime
        }
    }

    function formatterDate2(val, row) {
        if (val != null) {
            var date = new Date(val);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var h = 00;
            var mm = 00;
            var s = 00;
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' '
                + (h < 10 ? ("0" + h) : h) + ":" + (mm < 10 ? ("0" + mm) : mm) + ":" + (s < 10 ? ("0" + s) : s);
            return dateTime
        }
    }

    function formatterDate3(val, row) {
        if (val != null) {
            var date = new Date(val);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var h = 23;
            var mm = 59;
            var s = 59;
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
    $('#startDate').datetimebox({
        required: true,
        showSeconds: true,
        value: 'dateTime',
        formatter: formatterDate2,
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

    $('#endDate').datetimebox({
        required: true,
        showSeconds: true,
        value: 'dateTime',
        formatter: formatterDate3,
        onSelect: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var time = $('#endDate').datetimebox('spinner').spinner('getValue');
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' ' + time;
            $('#endDate').datetimebox('setText', dateTime);
            $('#endDate').datetimebox('hidePanel');
        }
    });
    //定义expName
    $("#expName").searchbox({
        searcher: function (value, name) {
            $("#dg").datagrid("unselectAll");
            var rows = $("#dg").datagrid("getRows");
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].expName == value) {
                    $("#dg").datagrid('selectRow', i);
                }
            }
        }
    });
    var suppliers = {};
    var promise = $.get("/api/exp-supplier-catalog/list-with-dept?hospitalId=" + parent.config.hospitalId, function (data) {
        suppliers = data;
        return suppliers;
    });
    $("#dg").datagrid({
        title: '入库记录查询',
        fit: true,//让#dg数据创铺满父类容器
        toolbar: '#ft',
        footer: '#tb',
        rownumbers: true,
        nowrap: false,
        columns: [[{
            title: '子库房',
            field: 'subStorage',
            align: 'center',
            width: "7%"
        }, {
            title: '代码',
            field: 'expCode',
            align: 'center',
            width: "7%"
        }, {
            title: '产品名称',
            field: 'expName',
            align: 'center',
            width: "7%"
        }, {
            title: '规格',
            field: 'packageSpec',
            align: 'center',
            width: "6%"
        }, {
            title: '单位',
            field: 'packageUnits',
            align: 'center',
            width: "6%"
        }, {
            title: '厂家',
            field: 'firmId',
            align: 'center',
            width: "7%"

        }, {
            title: '价格',
            field: 'purchasePrice',
            align: 'right',
            width: "6%"
        }, {
            title: '数量',
            field: 'quantity',
            align: 'center',
            width: "6%"
        }, {
            title: '金额',
            field: 'sum',
            align: 'right',
            width: "7%"
        }, {
            title: '扣率',
            field: 'discount',
            align: 'center',
            width: "7%"
        }, {
            title: '发票号',
            field: 'invoiceNo',
            align: 'center',
            width: "7%"
        }, {
            title: '发票日期',
            field: 'invoiceDate',
            formatter: formatterDate,
            align: 'center',
            width: "9%"
        }, {
            title: '入库单号',
            field: 'documentNo',
            align: 'center',
            width: "7%"
        }, {
            title: '供货单位',
            field: 'supplier',
            align: 'center',
            width: "8%",
            formatter: function (value, row, index) {
                for (var i = 0; i < suppliers.length; i++) {
                    if (value == suppliers[i].supplierCode) {
                        return suppliers[i].supplierName;
                    }
                }
                return value;
            }
        }, {
            title: '批号',
            field: 'batchNo',
            align: 'center',
            width: "7%"
        }, {
            title: '有效期',
            field: 'expireDate',
            formatter: formatterDate,
            align: 'center',
            width: "8%"
        }, {
            title: '备注',
            field: 'memo',
            align: 'center',
            width: "6%"
        }]]
    });

    $("#search").on('click', function () {
        var startDate = $("#startDate").datetimebox('getText');
        var endDate = $("#endDate").datetimebox('getText');
        var storageCode = parent.config.storageCode;
        var hospitalId = parent.config.hospitalId;
         //
        $.get("/api/exp-import/exp-import-detail?storage=" + storageCode + "&hospitalId=" + hospitalId + "&startDate=" + startDate + "&stopDate=" + endDate, function (data) {
            if (data.length>0) {
                console.log(data);
                //为报表准备字段
                startDates=startDate;
                stopDates=endDate;

                var purchasePrice = 0.00;   //价格
                var sumSum = 0.00;  //金额
                sumSum = parseFloat(sumSum);
                purchasePrice = parseFloat(purchasePrice);
                $.each(data, function (index, item) {
                    item.purchasePrice = parseFloat(item.purchasePrice);
                    item.sum = parseFloat(item.sum);
                    item.quantity = parseFloat(item.quantity);

                    item.sum = item.purchasePrice * item.quantity; //金额= 价格 * 数量

                    sumSum += item.sum;
                    purchasePrice += item.purchasePrice;

                    item.purchasePrice = fmoney(item.purchasePrice, 2);
                    item.sum = fmoney(item.sum, 2);
                });
                purchasePrice = fmoney(purchasePrice,2);
                sumSum = fmoney(sumSum,2);

                $("#dg").datagrid('loadData', data);
                $('#dg').datagrid('appendRow', {
                    packageSpec: "合计：",
                    purchasePrice: fmoney(purchasePrice,2),
                    sum: fmoney(sumSum, 2),
                    supplier: ''
                });
                //$("#dg").datagrid("autoMergeCells", ['subStorage', 'packageSpec', 'packageUnits', 'batchNo', 'expireDate']);
            } else {
                $.messager.alert("提示", "起始时间段内无数据！")
            }
        });
    });
    $("#saveAs").on('click', function () {
        $.messager.alert("系统提示", "另存为", "info");
    });
    $("#setPrint").on('click', function () {
        $.messager.alert("系统提示", "打印设置", "info");
    });

    //为报表准备字段
    var startDates='';
    var stopDates='';

    //打印
    $("#printDiv").dialog({
        title: '打印预览',
        width: 1000,
        height: 520,
        catch: false,
        modal: true,
        closed: true,
        onOpen: function () {
            var https="http://"+parent.config.reportDict.ip+":"+parent.config.reportDict.port+"/report/ReportServer?reportlet=exp/exp-list/exp-import-detail.cpt"+"&hospitalId="+parent.config.hospitalId+"&storageCode="+parent.config.storageCode+"&startDate=" + startDates + "&stopDate=" + stopDates
            $("#report").prop("src",cjkEncode(https));
        }
    });
    $("#print").on('click', function () {
        var printData = $("#dg").datagrid('getRows');
        if (printData.length <= 0) {
            $.messager.alert('系统提示', '请先查询数据', 'info');
            return;
        }
        $("#printDiv").dialog('open');
    });

    //格式化金额
    function fmoney(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
});