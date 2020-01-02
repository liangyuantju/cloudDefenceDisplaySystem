$().ready(function () {
	let networkId = window.sessionStorage.getItem("networkId");
	let networkName = window.sessionStorage.getItem("networkName");
	let networkShared = window.sessionStorage.getItem("networkShared");
	let networkStatus = window.sessionStorage.getItem("networkStatus");
	let networkType = window.sessionStorage.getItem("networkType");
	let networkExt = window.sessionStorage.getItem("networkExt");
	let networkCreateTime = window.sessionStorage.getItem("networkCreateTime");
	let networkUpdateTime = window.sessionStorage.getItem("networkUpdateTime");
	console.log(networkUpdateTime);
	loadDetail(networkId, networkName, networkShared, networkStatus, networkType, networkExt, networkCreateTime, networkUpdateTime);
	//changeDetail();
})
function loadDetail(networkId, networkName, networkShared, networkStatus, networkType, networkExt, networkCreateTime, networkUpdateTime) {
	document.getElementById("name").innerHTML = networkName;
	document.getElementById("shared").innerHTML = networkShared;
	document.getElementById("status").innerHTML = networkStatus;
	document.getElementById("type").innerHTML = networkStatus;
	document.getElementById("ext").innerHTML = networkExt;
	document.getElementById("networkId").innerHTML = networkId;
	document.getElementById("createTime").innerHTML = networkCreateTime;
	document.getElementById("createTime").innerHTML = networkUpdateTime;
}