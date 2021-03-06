package com.jims.his.service.ieqm;

import com.jims.his.common.expection.ErrorException;
import com.jims.his.domain.common.vo.BeanChangeVo;
import com.jims.his.domain.ieqm.entity.ExpFormDict;
import com.jims.his.domain.ieqm.entity.ExpStorageProfile;
import com.jims.his.domain.ieqm.entity.MeasuresDict;
import com.jims.his.domain.ieqm.facade.ExpFormDictFacade;
import com.jims.his.domain.ieqm.facade.ExpStorageProfileFacade;
import com.jims.his.domain.ieqm.facade.MeasuresDictFacade;
import com.jims.his.domain.ieqm.vo.ExpStockDefineVo;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by tangxinbo on 2015/10/13.
 */
@Path("exp-stock-define")
@Produces("application/json")
public class ExpStockDefineService {
    private ExpStorageProfileFacade expStorageProfileFacade;

    @Inject
    public ExpStockDefineService(ExpStorageProfileFacade expStorageProfileFacade) {
        this.expStorageProfileFacade = expStorageProfileFacade;
    }

    @GET
    @Path("find-stock-define")
    public List<ExpStorageProfile> findStockDefine(@QueryParam("expForm") String expForm,@QueryParam("expCode")String expCode,@QueryParam("storage")String storage ){
        List<ExpStorageProfile> list = expStorageProfileFacade.findExpStockDefine(expForm,expCode,storage);
        return list;
    }

    @POST
    @Path("save")
    public Response saveFindStockDefine(BeanChangeVo<ExpStorageProfile> beanChangeVo){
        try {
            List<ExpStorageProfile> expStockDefineList = expStorageProfileFacade.saveExpStockDefine(beanChangeVo);
            return Response.status(Response.Status.OK).entity(expStockDefineList).build();
        }catch (Exception e){
            ErrorException errorException = new ErrorException();
            errorException.setMessage(e);
            if(errorException.getErrorMessage().toString().indexOf("最大值")!=-1){
                errorException.setErrorMessage("输入数据超过长度！");
            }else if(errorException.getErrorMessage().toString().indexOf("唯一")!=-1){
                errorException.setErrorMessage("数据已存在，保存失败！");
            } else {
                errorException.setErrorMessage("保存失败！");
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorException).build();
        }
    }
}
