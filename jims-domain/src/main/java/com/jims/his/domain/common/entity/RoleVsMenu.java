package com.jims.his.domain.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * RoleVsMenu entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "ROLE_VS_MENU", schema = "JIMS")
public class RoleVsMenu implements java.io.Serializable {

	// Fields

	private String id;
	private MenuDict menuDict;
	private RoleDict roleDict;

	// Constructors

	/** default constructor */
	public RoleVsMenu() {
	}

	/** full constructor */
	public RoleVsMenu(MenuDict menuDict, RoleDict roleDict) {
		this.menuDict = menuDict;
		this.roleDict = roleDict;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "ID", unique = true, nullable = false, length = 64)
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "MENU_ID")
	public MenuDict getMenuDict() {
		return this.menuDict;
	}

	public void setMenuDict(MenuDict menuDict) {
		this.menuDict = menuDict;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ROLE_ID")
	public RoleDict getRoleDict() {
		return this.roleDict;
	}

	public void setRoleDict(RoleDict roleDict) {
		this.roleDict = roleDict;
	}

}