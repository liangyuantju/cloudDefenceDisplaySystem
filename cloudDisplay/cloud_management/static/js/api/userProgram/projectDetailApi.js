$().ready(function () {
	let projectName = window.sessionStorage.getItem("projectName");
	let projectId = window.sessionStorage.getItem("projectId");
	let projectRunnable = window.sessionStorage.getItem("projectRunnable");
	let projectDescription = window.sessionStorage.getItem("projectDescription");
	loadDetail(projectName, projectId, projectRunnable, projectDescription);
	console.log(111);
	//changeDetail();
})
function loadDetail(projectName, projectId, projectRunnable, projectDescription) {
	document.getElementById("pname").innerHTML = projectName;
	document.getElementById("pid").innerHTML = projectId;
	if (projectRunnable) {
		document.getElementById("prun").innerHTML = "运行中";
	} else {
		document.getElementById("prun").innerHTML = "已停止";
	}
	document.getElementById("pdes").innerHTML = projectDescription;
}
function changeDetail(btn) {
	let userInputName = document.getElementById("inputName").value;
	let userInputDes = document.getElementById("inputDes").value;
	//alert(userInputName);
	updateUser(userInputName, userInputDes);
	document.getElementById("pname").innerHTML = userInputName;
	document.getElementById("pdes").innerHTML = userInputDes;
}
const RequestByPatchMethod = function(url, data, successCode = 200) {
	const promise = new Promise(function(resolve, reject) {
		const handler = function() {
			if(this.readyState !== 4) {
				return;
			} 
			if(this.status === successCode) {
				resolve(this.response);
				sessionStorage.setItem("X-Auth-Token", this.getResponseHeader("X-Auth-Token"));
			} else {
				reject(new Error(this.statusText));
			}
		};
		const client = new XMLHttpRequest();
		client.open("PATCH", url);
		client.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		client.setRequestHeader("X-Auth-Token", sessionStorage.getItem("X-Auth-Token"));
		client.onreadystatechange = handler;
		client.responseType = "json";
		client.send(JSON.stringify(data));
	});
	return promise;
}
function updateUser(userInputName, userInputDes) {
	let project_id = window.sessionStorage.getItem("projectId");
	let description = userInputDes;
	let name = userInputName;
	RequestByPatchMethod("http://192.168.33.17:5000/v3/projects/" + project_id, {"project":{"description":description,"name":name}}, 200).then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});
}