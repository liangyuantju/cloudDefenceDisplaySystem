$().ready(function () {
	let volumeName = window.sessionStorage.getItem("volumeName");
	let volumeId = window.sessionStorage.getItem("volumeId");
	let volumeStatus = window.sessionStorage.getItem("volumeStatus");
	let volumeSize = window.sessionStorage.getItem("volumeSize");
	loadDetail(volumeName, volumeId, volumeStatus, volumeSize);
	//changeDetail();
})
function loadDetail(volumeName, volumeId, volumeStatus, volumeSize) {
	document.getElementById("name").innerHTML = volumeName;
	document.getElementById("vid").innerHTML = volumeId;
	document.getElementById("status").innerHTML = volumeStatus;
	document.getElementById("size").innerHTML = volumeSize;
}