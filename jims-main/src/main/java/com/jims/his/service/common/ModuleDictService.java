package com.jims.his.service.common;

import com.jims.his.common.expection.ErrorException;
import com.jims.his.domain.common.entity.ModulDict;
import com.jims.his.domain.common.entity.ModuleVsMenu;
import com.jims.his.domain.common.facade.ModuleDictFacade;
import com.jims.his.domain.common.vo.BeanChangeVo;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by heren on 2015/10/26.
 */
@Path("module-dict")
@Produces("application/json")
public class ModuleDictService {

    private ModuleDictFacade moduleDictFacade ;

    @Inject
    public ModuleDictService(ModuleDictFacade moduleDictFacade) {
        this.moduleDictFacade = moduleDictFacade;
    }

    /**
     * 获取所有的模块
     * @return
     */
    @GET
    @Path("list")
    public List<ModulDict> list(@QueryParam("name") String name){
        return moduleDictFacade.findAll(name) ;
    }

    @POST
    @Path("save")
    public Response save(BeanChangeVo<ModulDict> modulDictBeanChangeVo){
        try {
            moduleDictFacade.save(modulDictBeanChangeVo) ;
            return Response.status(Response.Status.OK).entity(modulDictBeanChangeVo).build() ;
        }catch(Exception e){
            ErrorException errorException = new ErrorException() ;
            errorException.setMessage(e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorException).build() ;
        }
    }


    /**
     * 保存模块菜单
     * @param moduleId 模块ID
     * @param menuIds 菜单ID
     * @return
     */
    @Path("add-module-menu/{moduleId}")
    @POST
    public Response saveModuleVsMenu(@PathParam("moduleId")String moduleId,List<String> menuIds){
        try {
            List<ModuleVsMenu> moduleVsMenus = moduleDictFacade.saveModuleVsMenu(moduleId, menuIds);
            return Response.status(Response.Status.OK).entity(moduleVsMenus).build() ;
        }catch(Exception e){
            ErrorException errorException = new ErrorException() ;
            errorException.setMessage(e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorException).build() ;
        }
    }


}
