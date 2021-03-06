package com.jims.his.service.ieqm;


import com.jims.his.common.expection.ErrorException;
import com.jims.his.domain.common.vo.BeanChangeVo;
import com.jims.his.domain.ieqm.entity.MeasuresDict;
import com.jims.his.domain.ieqm.facade.MeasuresDictFacade;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2015/9/18.
 */
@Path("measures-dict")
@Produces("application/json")
public class MeasuresDictService {
    private MeasuresDictFacade measuresDictFacade;

    @Inject
    public MeasuresDictService(MeasuresDictFacade measuresDictFacade) {
        this.measuresDictFacade = measuresDictFacade;
    }

    @GET
    @Path("list")
    public List<MeasuresDict> measuresDictList(@QueryParam("name") String name){
        return measuresDictFacade.findMeasuresDict(name);
    }

    /**
     * 保存增删改
     *
     * @param beanChangeVo
     * @return
     */
    @POST
    @Path("merge")
    public Response save(BeanChangeVo<MeasuresDict> beanChangeVo) {
        try {
            List<MeasuresDict> newUpdateDict = new ArrayList<>();
            newUpdateDict = measuresDictFacade.save(beanChangeVo);
            return Response.status(Response.Status.OK).entity(newUpdateDict).build();
        } catch (Exception e) {
            ErrorException errorException = new ErrorException();
            errorException.setMessage(e);
            if (errorException.getErrorMessage().toString().indexOf("最大值") != -1) {
                errorException.setErrorMessage("输入数据超过长度！");
            } else if (errorException.getErrorMessage().toString().indexOf("唯一") != -1) {
                errorException.setErrorMessage("数据已存在，保存失败！");
            } else {
                errorException.setErrorMessage("保存失败！");
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorException).build();
        }

    }
    //@GET
    //@Path("search")
    //public Response searchByMeasuresName(String measuresName){
    //    List<MeasuresDict> dicts = measuresDictFacade.searchByMeasuresName(measuresName);
    //    return Response.status(Response.Status.OK).entity(dicts).build();
    //
    //}
}
