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
function getAllVirtual() {
	RequestByGetMethod("http://192.168.33.91:8774/v2.1/os-hypervisors/detail").then(function(data) {
		console.log(data);
		cleanVirtuals();
		let virtualFragment = document.createDocumentFragment();
		for (let i = 0; i < data.hypervisors.length; i++) {
			let tmpTr = document.createElement('tr');
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
				+ i + '"></td><td><a class="aTagVirtualDetails" hostName="'
				+ data.hypervisors[i].hypervisor_hostname + '" ipAddr="'
				+ data.hypervisors[i].host_ip + '" hostType="'
				+ data.hypervisors[i].hypervisor_type + '" virtualStatus="'
				+ data.hypervisors[i].status + '" virtualId="'
				+ data.hypervisors[i].id + '" href="virtualDetail.html">' 
				+ data.hypervisors[i].hypervisor_hostname + '</a></td><td>' 
				+ data.hypervisors[i].host_ip + '</td><td>'
				+ data.hypervisors[i].hypervisor_type + '</td><td>'
				+ data.hypervisors[i].status + '</td><td>'
				+ data.hypervisors[i].id + '</td><td><div class="btn-group"><button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">操作 <span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">暂停</a></li><li><a href="#">停止</a></li><li><a href="#">重启</a></li><li><a href="#modal" data-toggle="modal">删除</a></li><li><a href="#">创建快照</a></li><li><a href="#">显示控制台</a></li></ul></div></td>';
			virtualFragment.appendChild(tmpTr);	
		}
		document.getElementById("virtuals").appendChild(virtualFragment);
		details();
		//deleteVolume();
	}).catch(function(error) {
		console.log(error);
	});
}
function details() {
	let virtualDetails = document.querySelectorAll(".aTagVirtualDetails");
	for (let i = 0; i < virtualDetails.length; i++) {
		virtualDetails[i].onclick = function() {
			window.sessionStorage.setItem("hostName", virtualDetails[i].getAttribute("hostName"));
			window.sessionStorage.setItem("ipAddr", virtualDetails[i].getAttribute("ipAddr"));
			window.sessionStorage.setItem("hostType", virtualDetails[i].getAttribute("hostType"));
			window.sessionStorage.setItem("virtualStatus", virtualDetails[i].getAttribute("virtualStatus"));
			window.sessionStorage.setItem("virtualId", virtualDetails[i].getAttribute("virtualId"));
		}
	}
}
// function deleteVolume() {
// 	let deleteBtn = document.querySelectorAll(".btn_deleteVolume");
// 	for(let i = 0; i < deleteBtn.length; i++) {
// 		deleteBtn[i].onclick = function() {
// 			let volumeId = this.getAttribute("volumeId");
// 			RequestByDeleteMethod("http://192.168.33.91:8776/v3/"+ projrctId + "/volumes/" + volumeId, 202).then(function(data) {
// 				console.log(data);
// 				getAllVolume();
// 			}).catch(function(error) {
// 				console.log(error);
// 			});
// 		}
// 	}
// }
function cleanVirtuals() {
	let m = document.getElementById("virtuals");
	let nodesLength = m.childNodes.length;
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function searchVirtuals() {
	let text = document.getElementById("searchInput");
	let arr = text.value;
	RequestByGetMethod("http://192.168.33.91:8774/v2.1/os-hypervisors/detail").then(function(data) {
		//console.log(data);
		cleanVirtuals();
		let virtualFragment = document.createDocumentFragment();
		for (let i = 0; i < data.hypervisors.length; i++) {
			let tmpTr = document.createElement('tr');
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
				+ i + '"></td><td><a class="aTagVirtualDetails" hostName="'
				+ data.hypervisors[i].hypervisor_hostname + '" ipAddr="'
				+ data.hypervisors[i].host_ip + '" hostType="'
				+ data.hypervisors[i].hypervisor_type + '" virtualStatus="'
				+ data.hypervisors[i].status + '" virtualId="'
				+ data.hypervisors[i].id + '" href="virtualDetail.html">' 
				+ data.hypervisors[i].hypervisor_hostname + '</a></td><td>' 
				+ data.hypervisors[i].host_ip + '</td><td>'
				+ data.hypervisors[i].hypervisor_type + '</td><td>'
				+ data.hypervisors[i].status + '</td><td>'
				+ data.hypervisors[i].id + '</td><td><div class="btn-group"><button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">操作 <span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">暂停</a></li><li><a href="#">停止</a></li><li><a href="#">重启</a></li><li><a href="#modal" data-toggle="modal">删除</a></li><li><a href="#">创建快照</a></li><li><a href="#">显示控制台</a></li></ul></div></td>';
			virtualFragment.appendChild(tmpTr);	
		}
		document.getElementById("virtuals").appendChild(virtualFragment);
		details();
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
	getAllVirtual();
})