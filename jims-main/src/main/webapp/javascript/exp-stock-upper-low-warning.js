/**
 * Created by wangbinbin on 2015/10/27.
 */
/***
 * 库存限量报警
 */
$(function () {
    $("#dg").datagrid({
//        title: '库存限量报警',
        fit: true,//让#dg数据创铺满父类容器
        footer: '#tb',
//        rownumbers: true,
        singleSelect: true,
        columns: [[{
            title: '代码',
            field: 'expCode',
            width: "16%"
        }, {
            title: '产品名称',
            field: 'expName',
            width: "17%"
        },  {
            title: '产品规格',
            field: 'packageSpec',
            width: "17%"
        }, {
            title: '包装单位',
            field: 'packageUnits',
            width: "10%"
        }, {
            title: '参考批价',
            field: 'tradePrice',
            width: "8%",
            editor: 'numberbox'
        }, {
            title: '参考零价',
            field: 'retailPrice',
            width: "8%",
            editor: 'numberbox'
        }, {
            title: '库存上限',
            field: 'upperLevel',
            width: "8%"
        }, {
            title: '库存下限',
            field: 'lowLevel',
            width: "8%"
        },{
            title: '当前库存',
            field: 'stockQuantity',
            width: "10%",
            styler: function(value,row,index){
                if (row.upperLevel<row.stockQuantity){
                    return 'color:blue;';
                }
                if(row.lowLevel>=row.stockQuantity){
                    return 'color:red;';
                }
            }
        }
        ]]
    });
   var counts = [];
    $("#searchBtn").on('click', function () {
        var promise = loadDict() ;
        promise.done(function(){
            if(counts.length<=0){
                $.messager.alert("系统提示", "数据库暂无数据");
                $("#dg").datagrid('loadData', []);
                return;
            }
            $("#dg").datagrid('loadData', counts);
        })

    });

    //加载相应编码的数据
    var loadDict = function () {
        var expName=$("#expName").val();
        counts.splice(0,counts.length);
        var countPromise =   $.get("/api/exp-stock/upper-low-warning?storage=" + parent.config.storageCode+"&hospitalId="+parent.config.hospitalId+"&expName="+expName, function(data){
           counts = data;
        });
        return countPromise ;
    }
})