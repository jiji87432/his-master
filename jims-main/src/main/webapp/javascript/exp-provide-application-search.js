/**
 * Created by tangxinbo on 2015/10/15.
 */
/**
 * 查阅本库房所提的申请
 */
$(document).ready(function () {
    var editRowIndex;
    var dates;
    var storageDict = [];//库房字典

    //库房加载
    var storageDictPromise = $.get("/api/exp-storage-dept/list?hospitalId="+parent.config.hospitalId, function (data) {
        $.each(data, function (index, item) {
            var storage = {};
            storage.storageCode = item.storageCode;
            storage.storageName = item.storageName;
            storageDict.push(storage);
        })
    });
    //格式化日期(方法)
    function formatterDate(val, row) {
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

    $('#startTime').datetimebox({
        required: true,
        showSeconds: true,
        value: 'dateTime',
        formatter: formatterDate2,
        onSelect: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var time = $('#startTime').datetimebox('spinner').spinner('getValue');
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' ' + time;
            $('#startTime').datetimebox('setText', dateTime);
            $('#startTime').datetimebox('hidePanel');
        }
    });
    $('#endTime').datetimebox({
        value: 'dateTime',
        required: true,
        showSeconds: true,
        formatter: formatterDate3,
        onSelect: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var time = $('#endTime').datetimebox('spinner').spinner('getValue');
            var dateTime = y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) + ' ' + time;
            //(m < 10 ? ("0" + m) : m) + "/" + (d < 10 ? ("0" + d) : d) + "/" + y + " " + time;
            $('#endTime').datetimebox('setText', dateTime);
            $('#endTime').datetimebox('hidePanel');
        }
    });


    $("#dg").datagrid({
        title: "查阅本库房所提的申请",
        fit: true,
        toolbar: "#topBar",
        footer: "#tb",
        singleSelect: true,
        rownumbers: true,
        columns: [[{
            title: "申请单号",
            field: "applicantNo",
            align: 'center',
            width: "10%"
        }, {
            title: "向哪个库房申请",
            field: "provideName",
            align: 'center',
            width: "10%"
        }, {
            title: "代码",
            field: "expCode",
            align: 'center',
            width: "10%"
        }, {
            title: "序号",
            field: "itemNo",
            align: 'center',
            width: "10%"
        }, {
            title: "产名",
            field: "expName",
            align: 'center',
            width: "10%"
        }, {
            title: "规格",
            field: "packageSpec",
            align: 'center',
            width: "10%"
        }, {
            title: "单位",
            field: "packageUnits",
            align: 'center',
            width: "8%"
        }, {
            title: "数量",
            field: "quantity",
            align: 'center',
            width: "8%"
        }, {
            title: "申请人",
            field: "applicationMan",
            align: 'center',
            width: "10%"
        }, {
            title: "申请时间",
            field: "enterDateTime",
            align: 'center',
            width: "12%",
            formatter: formatterDate
        }]]
    });
    //查询
    $("#searchBtn").on("click", function () {
        var startTime = $("#startTime").datetimebox('getText');
        var endTime = $('#endTime').datetimebox('getText');

        var isSure = $("#topBar input[name='radioOne']:checked").val();
        var applicationStorage = parent.config.storageCode;

        var expProvideApplicationObjs = [];

        $.get("/api/exp-provide-application/find-cur-storage-application" +
            "?startTime=" + startTime + "&endTime=" + endTime + "&isSure=" + isSure + "&applicationStorage=" + applicationStorage, function (data) {
                if (data.length ==  0){
                    $.messager.alert("提示","该申请内无数据","info");
                    $("#dg").datagrid("loadData", {rows: []});
                    return ;
                } else {
                    $("#dg").datagrid("loadData", data);
                }
            }
        );
    });
    //清屏
    $("#clearBtn").on("click", function () {
        $("#dg").datagrid("loadData", {rows: []});
        editRowIndex = undefined;
    })
});