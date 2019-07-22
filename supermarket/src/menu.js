const navMenu = [
	{
		index:"1",
		name:"门店管理",
		icon:"el-icon-document",
		sub:[
			{index:"1-1",name:"门店信息",routerName:"shopInfo",icon:"el-icon-search"},
			{index:"1-2",name:"门店列表",routerName:"shopList",icon:"el-icon-plus"},
			{index:"1-3",name:"门店类别",routerName:"shopType",icon:"el-icon-plus"},
			{index:"1-4",name:"员工管理",routerName:"empMgr",icon:"el-icon-plus"}
		]
	},
	{
		index:"2",
		name:"商品管理",
		icon:"el-icon-phone",
		sub:[
			{index:"2-1",name:"商品列表",routerName:"goodsList",icon:"el-icon-tickets"},
			{index:"2-2",name:"商品类别",routerName:"goodsType",icon:"el-icon-plus"},
			{index:"2-3",name:"商品规格",routerName:"goodsSpec",icon:"el-icon-plus"}
		]
	},
	{
		index:"3",
		name:"会员特权",
		icon:"el-icon-phone",
		sub:[
			{index:"3-1",name:"会员列表",routerName:"memberList",icon:"el-icon-tickets"},
			{index:"3-2",name:"会员等级",routerName:"memberLevel",icon:"el-icon-tickets"}
		]
	}
]

export default navMenu
