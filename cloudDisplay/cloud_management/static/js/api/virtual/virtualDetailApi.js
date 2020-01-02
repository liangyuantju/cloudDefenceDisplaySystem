$().ready(function () {
	let hostName = window.sessionStorage.getItem("hostName");
	let ipAddr = window.sessionStorage.getItem("ipAddr");
	let hostType = window.sessionStorage.getItem("hostType");
	let virtualStatus = window.sessionStorage.getItem("virtualStatus");
	let virtualId = window.sessionStorage.getItem("virtualId");
	loadDetail(hostName, ipAddr, hostType, virtualStatus, virtualId);
	//changeDetail();
})
function loadDetail(hostName, ipAddr, hostType, virtualStatus, virtualId) {
	document.getElementById("name").innerHTML = hostName;
	document.getElementById("type").innerHTML = hostType;
	document.getElementById("status").innerHTML = virtualStatus;
	document.getElementById("virtualId").innerHTML = virtualId;
	document.getElementById("ipAddr").innerHTML = ipAddr;
}