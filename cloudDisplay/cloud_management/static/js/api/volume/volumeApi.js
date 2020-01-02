let projrctId = "89f9e5579bda482ba5e6ff2f2152472b";
let volumeName = "";
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
const RequestByGetMethod = function(url, successCode = 200) {
	const promise = new Promise(function(resolve, reject) {
		const handler = function() {
			if(this.readyState !== 4) {
				return;
			} 
			if(this.status === successCode) {
				resolve(this.response);
			} else {
				reject(new Error(this.statusText));
			}
		};
		const client = new XMLHttpRequest();
		client.open("GET", url);
        client.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        client.setRequestHeader("X-Auth-Token", sessionStorage.getItem("X-Auth-Token"));
		client.onreadystatechange = handler;
		client.responseType = "json";
		client.send();
	});
	return promise;
}
const RequestByDeleteMethod = function(url, successCode = 200) {
	const promise = new Promise(function(resolve, reject) {
		const handler = function() {
			if(this.readyState !== 4) {
				return;
			} 
			if(this.status === successCode) {
				resolve(this.response);
			} else {
				reject(new Error(this.statusText));
			}
		};
		const client = new XMLHttpRequest();
		client.open("DELETE", url);
		client.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		client.setRequestHeader("X-Auth-Token", sessionStorage.getItem("X-Auth-Token"));
		client.onreadystatechange = handler;
		client.responseType = "json";
		client.send();
	});
	return promise;
}
function getAllVolume() {
	RequestByGetMethod("http://192.168.33.91:8776/v3/" + projrctId + "/volumes/detail").then(function(data) {
		console.log(data);
		cleanVolumes();
		let volumeFragment = document.createDocumentFragment();
		for (let i = 0; i < data.volumes.length; i++) {
			let tmpTr = document.createElement('tr');
			if (data.volumes[i].name == "") {
				volumeName = data.volumes[i].id;
			} else {
				volumeName = data.volumes[i].name;
			}
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
				+ i + '"></td><td><a class="aTagVolumeDetails" volumeName="'
				+ volumeName + '" volumeId="'
				+ data.volumes[i].id + '" volumeStatus="'
				+ data.volumes[i].status + '" volumeEncrypted="'
				+ data.volumes[i].encrypted + '" volumeSize="'
				+ data.volumes[i].size + '" href="rollDetail.html">' 
				+ volumeName + '</a></td><td>' 
				+ data.volumes[i].status + '</td><td>'
				+ data.volumes[i].size + '</td><td>'
				+ data.volumes[i].encrypted + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteVolume" volumeId="'
				+ data.volumes[i].id + '">删除</button></li></ul></div></td>';
			volumeFragment.appendChild(tmpTr);	
		}
		document.getElementById("volumes").appendChild(volumeFragment);
		details();
		deleteVolume();
	}).catch(function(error) {
		console.log(error);
	});
}
function details() {
	let volumeDetails = document.querySelectorAll(".aTagVolumeDetails");
	for (let i = 0; i < volumeDetails.length; i++) {
		volumeDetails[i].onclick = function() {
			window.sessionStorage.setItem("volumeName", volumeDetails[i].getAttribute("volumeName"));
			window.sessionStorage.setItem("volumeId", volumeDetails[i].getAttribute("volumeId"));
			window.sessionStorage.setItem("volumeStatus", volumeDetails[i].getAttribute("volumeStatus"));
			window.sessionStorage.setItem("volumeEncrypted", volumeDetails[i].getAttribute("volumeEncrypted"));
			window.sessionStorage.setItem("volumeSize", volumeDetails[i].getAttribute("volumeSize"));
		}
	}
}
function deleteVolume() {
	let deleteBtn = document.querySelectorAll(".btn_deleteVolume");
	for(let i = 0; i < deleteBtn.length; i++) {
		deleteBtn[i].onclick = function() {
			let volumeId = this.getAttribute("volumeId");
			RequestByDeleteMethod("http://192.168.33.91:8776/v3/"+ projrctId + "/volumes/" + volumeId, 202).then(function(data) {
				console.log(data);
				getAllVolume();
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
}
function cleanVolumes() {
	let m = document.getElementById("volumes");
	let nodesLength = m.childNodes.length;
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function searchProjects() {
	let text = document.getElementById("searchInput");
	let arr = text.value;
	RequestByGetMethod("http://192.168.33.91:8776/v3/" + projrctId + "/volumes/detail").then(function(data) {
		//console.log(data);
		cleanVolumes();
		let volumeFragment = document.createDocumentFragment();
		for (let i = 0; i < data.volumes.length; i++) {
			let tmpTr = document.createElement('tr');
			
			if (data.volumes[i].name == "") {
				volumeName = data.volumes[i].id;
			} else {
				volumeName = data.volumes[i].name;
			}
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
				+ i + '"></td><td><a class="aTagVolumeDetails" volumeName="'
				+ volumeName + '" volumeId="'
				+ data.volumes[i].id + '" volumeStatus="'
				+ data.volumes[i].status + '" volumeEncrypted="'
				+ data.volumes[i].encrypted + '" volumeSize="'
				+ data.volumes[i].size + '" href="rollDetail.html">' 
				+ volumeName + '</a></td><td>' 
				+ data.volumes[i].status + '</td><td>'
				+ data.volumes[i].size + '</td><td>'
				+ data.volumes[i].encrypted + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteVolume" volumeId="'
				+ data.volumes[i].id + '">删除</button></li></ul></div></td>';
			volumeFragment.appendChild(tmpTr);	
		}
		document.getElementById("volumes").appendChild(volumeFragment);
		details();
		deleteVolume();
	}).catch(function(error) {
		console.log(error);
	});
}
$().ready(function () {
	let name = window.sessionStorage.getItem("loginName");
	let password = window.sessionStorage.getItem("loginPassword");
	RequestByPostMethod("http://192.168.33.91:5000/v3/auth/tokens", {"auth":{"identity":{"methods":["password"],"password":{"user":{"name":name,"domain":{"name":"default"},"password":password}}},"scope":{"project":{"domain":{"name":"default"},"name":"admin"}}}}, 201).then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});
	//console.log(sessionStorage.getItem("projectName"));
	getAllVolume();
})