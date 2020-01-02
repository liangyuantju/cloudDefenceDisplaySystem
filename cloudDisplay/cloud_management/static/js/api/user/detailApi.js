$().ready(function () {
	let userName = window.sessionStorage.getItem("userName");
	let userId = window.sessionStorage.getItem("userId");
	let runnable = window.sessionStorage.getItem("runnable");
	let domain = window.sessionStorage.getItem("domain");
	loadDetail(userName, userId, runnable, domain);
	//changeDetail();
})
function loadDetail(userName, userId, runnable, domain) {
	document.getElementById("name").innerHTML = userName;
	document.getElementById("uid").innerHTML = userId;
	if (runnable) {
		document.getElementById("urun").innerHTML = "运行中";
	} else {
		document.getElementById("urun").innerHTML = "已停止";
	}
	document.getElementById("domain").innerHTML = domain;
}
function changeDetail(btn) {
	let userInputName = document.getElementById("inputName").value;
	let userInputPassword = document.getElementById("inputPassword").value;
	updateUser(userInputName, userInputPassword);
	document.getElementById("name").innerHTML = userInputName;
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
const RequestByPostMethod = function(url, data, successCode = 200) {
	const promise = new Promise(function(resolve, reject) {
		const handler = function() {
			if(this.readyState !== 4) {
				return;
			} 
			if(this.status === successCode) {
				resolve(this.response);
				sessionStorage.setItem("X-Auth-Token", this.getResponseHeader("X-Subject-Token"));
			} else {
				reject(new Error(this.statusText));
			}
		};
		const client = new XMLHttpRequest();
		client.open("POST", url);
		client.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		client.setRequestHeader("X-Auth-Token", sessionStorage.getItem("X-Auth-Token"));
		client.onreadystatechange = handler;
		client.responseType = "json";
		client.send(JSON.stringify(data));
		});
	return promise;
}
function updateUser(userInputName, userInputPassword) {
	let user_id = window.sessionStorage.getItem("userId");
	let default_project_id = "263fd9";
	let domain_id = window.sessionStorage.getItem("domainId");
	let name = userInputName;
	let password = userInputPassword;
	let ignore_lockout_failure_attempts = true;
	let enabled = true;
	RequestByPatchMethod("http://192.168.33.17:5000/v3/users/" + user_id, {"user":{"default_project_id":default_project_id,"domain_id":domain_id,"name":name,"password":password,"enabled":enabled,"options":{"ignore_lockout_failure_attempts":ignore_lockout_failure_attempts}}}, 200).then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});
}