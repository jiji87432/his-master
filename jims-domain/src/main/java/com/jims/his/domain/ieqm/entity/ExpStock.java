package com.jims.his.domain.ieqm.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.GenericGenerator;

/**
 * ExpStock entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "EXP_STOCK", schema = "JIMS", uniqueConstraints = @UniqueConstraint(columnNames = {
		"STORAGE", "EXP_CODE", "EXP_SPEC", "BATCH_NO", "FIRM_ID",
		"PACKAGE_SPEC", "DOCUMENT_NO" }))
public class ExpStock implements java.io.Serializable {

	// Fields

	private String id;
	private String storage;
	private String expCode;
	private String expSpec;
	private String units;
	private String batchNo;
	private Date expireDate;
	private String firmId;
	private Double purchasePrice;
	private Double discount;
	private String packageSpec;
	private Double quantity;
	private String packageUnits;
	private Double subPackage1;
	private String subPackageUnits1;
	private String subPackageSpec1;
	private Double subPackage2;
	private String subPackageUnits2;
	private String subPackageSpec2;
	private String subStorage;
	private String documentNo;
	private Integer supplyIndicator;
	private Date producedate;
	private Date disinfectdate;
	private Integer killflag;
    private String hospitalId ;

	// Constructors

	/** default constructor */
	public ExpStock() {
	}

	/** full constructor */
	public ExpStock(String storage, String expCode, String expSpec,
                    String units, String batchNo, Date expireDate, String firmId,
                    Double purchasePrice, Double discount, String packageSpec,
                    Double quantity, String packageUnits, Double subPackage1,
                    String subPackageUnits1, String subPackageSpec1,
                    Double subPackage2, String subPackageUnits2,
                    String subPackageSpec2, String subStorage, String documentNo,
                    Integer supplyIndicator, Date producedate, Date disinfectdate,
                    Integer killflag, String hospitalId) {
		this.storage = storage;
		this.expCode = expCode;
		this.expSpec = expSpec;
		this.units = units;
		this.batchNo = batchNo;
		this.expireDate = expireDate;
		this.firmId = firmId;
		this.purchasePrice = purchasePrice;
		this.discount = discount;
		this.packageSpec = packageSpec;
		this.quantity = quantity;
		this.packageUnits = packageUnits;
		this.subPackage1 = subPackage1;
		this.subPackageUnits1 = subPackageUnits1;
		this.subPackageSpec1 = subPackageSpec1;
		this.subPackage2 = subPackage2;
		this.subPackageUnits2 = subPackageUnits2;
		this.subPackageSpec2 = subPackageSpec2;
		this.subStorage = subStorage;
		this.documentNo = documentNo;
		this.supplyIndicator = supplyIndicator;
		this.producedate = producedate;
		this.disinfectdate = disinfectdate;
		this.killflag = killflag;
        this.hospitalId = hospitalId;
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

	@Column(name = "STORAGE", length = 8)
	public String getStorage() {
		return this.storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	@Column(name = "EXP_CODE", length = 20)
	public String getExpCode() {
		return this.expCode;
	}

	public void setExpCode(String expCode) {
		this.expCode = expCode;
	}

	@Column(name = "EXP_SPEC", length = 20)
	public String getExpSpec() {
		return this.expSpec;
	}

	public void setExpSpec(String expSpec) {
		this.expSpec = expSpec;
	}

	@Column(name = "UNITS", length = 8)
	public String getUnits() {
		return this.units;
	}

	public void setUnits(String units) {
		this.units = units;
	}

	@Column(name = "BATCH_NO", length = 16)
	public String getBatchNo() {
		return this.batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "EXPIRE_DATE", length = 7)
	public Date getExpireDate() {
		return this.expireDate;
	}

	public void setExpireDate(Date expireDate) {
		this.expireDate = expireDate;
	}

	@Column(name = "FIRM_ID", length = 10)
	public String getFirmId() {
		return this.firmId;
	}

	public void setFirmId(String firmId) {
		this.firmId = firmId;
	}

	@Column(name = "PURCHASE_PRICE", precision = 10, scale = 4)
	public Double getPurchasePrice() {
		return this.purchasePrice;
	}

	public void setPurchasePrice(Double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	@Column(name = "DISCOUNT", precision = 5)
	public Double getDiscount() {
		return this.discount;
	}

	public void setDiscount(Double discount) {
		this.discount = discount;
	}

	@Column(name = "PACKAGE_SPEC", length = 20)
	public String getPackageSpec() {
		return this.packageSpec;
	}

	public void setPackageSpec(String packageSpec) {
		this.packageSpec = packageSpec;
	}

	@Column(name = "QUANTITY", precision = 12)
	public Double getQuantity() {
		return this.quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	@Column(name = "PACKAGE_UNITS", length = 8)
	public String getPackageUnits() {
		return this.packageUnits;
	}

	public void setPackageUnits(String packageUnits) {
		this.packageUnits = packageUnits;
	}

	@Column(name = "SUB_PACKAGE_1", precision = 12)
	public Double getSubPackage1() {
		return this.subPackage1;
	}

	public void setSubPackage1(Double subPackage1) {
		this.subPackage1 = subPackage1;
	}

	@Column(name = "SUB_PACKAGE_UNITS_1", length = 8)
	public String getSubPackageUnits1() {
		return this.subPackageUnits1;
	}

	public void setSubPackageUnits1(String subPackageUnits1) {
		this.subPackageUnits1 = subPackageUnits1;
	}

	@Column(name = "SUB_PACKAGE_SPEC_1", length = 20)
	public String getSubPackageSpec1() {
		return this.subPackageSpec1;
	}

	public void setSubPackageSpec1(String subPackageSpec1) {
		this.subPackageSpec1 = subPackageSpec1;
	}

	@Column(name = "SUB_PACKAGE_2", precision = 12)
	public Double getSubPackage2() {
		return this.subPackage2;
	}

	public void setSubPackage2(Double subPackage2) {
		this.subPackage2 = subPackage2;
	}

	@Column(name = "SUB_PACKAGE_UNITS_2", length = 8)
	public String getSubPackageUnits2() {
		return this.subPackageUnits2;
	}

	public void setSubPackageUnits2(String subPackageUnits2) {
		this.subPackageUnits2 = subPackageUnits2;
	}

	@Column(name = "SUB_PACKAGE_SPEC_2", length = 20)
	public String getSubPackageSpec2() {
		return this.subPackageSpec2;
	}

	public void setSubPackageSpec2(String subPackageSpec2) {
		this.subPackageSpec2 = subPackageSpec2;
	}

	@Column(name = "SUB_STORAGE", length = 10)
	public String getSubStorage() {
		return this.subStorage;
	}

	public void setSubStorage(String subStorage) {
		this.subStorage = subStorage;
	}

	@Column(name = "DOCUMENT_NO", length = 10)
	public String getDocumentNo() {
		return this.documentNo;
	}

	public void setDocumentNo(String documentNo) {
		this.documentNo = documentNo;
	}

	@Column(name = "SUPPLY_INDICATOR", precision = 1, scale = 0)
	public Integer getSupplyIndicator() {
		return this.supplyIndicator;
	}

	public void setSupplyIndicator(Integer supplyIndicator) {
		this.supplyIndicator = supplyIndicator;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "PRODUCEDATE", length = 7)
	public Date getProducedate() {
		return this.producedate;
	}

	public void setProducedate(Date producedate) {
		this.producedate = producedate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "DISINFECTDATE", length = 7)
	public Date getDisinfectdate() {
		return this.disinfectdate;
	}

	public void setDisinfectdate(Date disinfectdate) {
		this.disinfectdate = disinfectdate;
	}

	@Column(name = "KILLFLAG", precision = 1, scale = 0)
	public Integer getKillflag() {
		return this.killflag;
	}

	public void setKillflag(Integer killflag) {
		this.killflag = killflag;
	}

    @Column(name = "hospital_id")
    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }
}