package com.jims.his.listener;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.servlet.GuiceServletContextListener;
import com.jims.his.CompsiteModul;

/**
 * Created by heren on 2015/8/24.
 */
public class ContextListener extends GuiceServletContextListener {
    @Override
    protected Injector getInjector() {
        CompsiteModul modul = new CompsiteModul() ;

        return Guice.createInjector(modul);
    }
}
