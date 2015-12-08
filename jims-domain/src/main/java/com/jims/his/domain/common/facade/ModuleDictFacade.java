package com.jims.his.domain.common.facade;

import com.google.inject.persist.Transactional;
import com.jims.his.common.BaseFacade;
import com.jims.his.common.util.PinYin2Abbreviation;
import com.jims.his.domain.common.entity.MenuDict;
import com.jims.his.domain.common.entity.ModulDict;
import com.jims.his.domain.common.entity.ModuleVsMenu;
import com.jims.his.domain.common.vo.BeanChangeVo;

import javax.persistence.Query;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 系统模块维护功能
 * Created by heren on 2015/10/26.
 */
public class ModuleDictFacade extends BaseFacade {
    /**
     * 查找
     * @param name
     * @return
     */
    public List<ModulDict> findAll(String name, String hospitalId) {
        String hql = "from ModulDict as dict where 1=1";
        if (name != null && name.trim().length() > 0) {
            hql += " and dict.moduleName like '%" + name.trim() + "%'";
        }
        if(null !=hospitalId && !hospitalId.trim().equals("")){
            hql += " and dict.hospitalId='"+hospitalId+"'";
        }
        Query query = entityManager.createQuery(hql);
        List resultList = query.getResultList();
        return resultList;
    }

    /**
     * 保存模块儿维护信息
     * @param modulDict
     */
    @Transactional
    public void save(BeanChangeVo<ModulDict> modulDict) {

        List<ModulDict> inserted = modulDict.getInserted();
        List<ModulDict> updated = modulDict.getUpdated();
        List<ModulDict> deleted = modulDict.getDeleted();

        inserted.addAll(updated) ;
        for(ModulDict dict:inserted){
            dict.setInputCode(PinYin2Abbreviation.cn2py(dict.getModuleName()));
            merge(dict) ;
        }

        List<String> ids= new ArrayList<>() ;

        for(ModulDict dict:deleted){
            ids.add(dict.getId()) ;
        }

        if(ids.size()>0){
            super.removeByStringIds(ModulDict.class,ids);
        }
    }


    /**
     * 保存模块与菜单的对照关系表
     * @param moduleId
     * @param menuIds
     * @return
     */
    @Transactional
    public List<ModuleVsMenu> saveModuleVsMenu(String moduleId, List<String> menuIds) {
        ModulDict modulDict = get(ModulDict.class,moduleId) ;
        List<ModuleVsMenu> moduleVsMenus = new ArrayList<>() ;

        //先删除已经分配的菜单
        Set<ModuleVsMenu> moduleVsMenus1 = modulDict.getModuleVsMenus();
        List<String> ids = new ArrayList<>() ;
        for(ModuleVsMenu moduleVsMenu:moduleVsMenus1){
            remove(moduleVsMenu);
        }

        Set<ModuleVsMenu> moduleVsMenuSet = new HashSet<>() ;
        for(String menuId :menuIds){
            ModuleVsMenu moduleVsMenu = new ModuleVsMenu() ;
            MenuDict menuDict = get(MenuDict.class,menuId) ;
            moduleVsMenu.setModulDict(modulDict);
            moduleVsMenu.setMenuDict(menuDict);
            moduleVsMenus.add(moduleVsMenu) ;
            moduleVsMenuSet.add(moduleVsMenu) ;
        }
        modulDict.setModuleVsMenus(moduleVsMenuSet);
        merge(modulDict) ;
        return moduleVsMenus;
    }

    /**
     * 根据模块ID查出所有的模块菜单关系数据
     * @param moduleId
     * @return
     */
    public List<ModuleVsMenu> listMenusByModule(String moduleId) {
        String hql = "From ModuleVsMenu as mm where mm.modulDict.id='" + moduleId + "'";
        Query query = entityManager.createQuery(hql);
        List resultList = query.getResultList();
        return resultList;
    }
}
