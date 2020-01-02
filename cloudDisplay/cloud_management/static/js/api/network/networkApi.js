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
function cleanNetworks() {
	let m = document.getElementById("networks");
	let nodesLength = m.childNodes.length;
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function details() {
	let networkDetails = document.querySelectorAll(".aTagNetworkDetails");
	for (let i = 0; i < networkDetails.length; i++) {
		networkDetails[i].onclick = function() {
			window.sessionStorage.setItem("networkName", networkDetails[i].getAttribute("networkName"));
			window.sessionStorage.setItem("networkShared", networkDetails[i].getAttribute("networkShared"));
			window.sessionStorage.setItem("networkId", networkDetails[i].getAttribute("networkId"));
			window.sessionStorage.setItem("networkExt", networkDetails[i].getAttribute("networkExt"));
			window.sessionStorage.setItem("networkStatus", networkDetails[i].getAttribute("networkStatus"));
			window.sessionStorage.setItem("networkType", networkDetails[i].getAttribute("networkType"));
			window.sessionStorage.setItem("networkCreateTime", networkDetails[i].getAttribute("networkCreateTime"));
			window.sessionStorage.setItem("networkUpdateTime", networkDetails[i].getAttribute("networkUpdateTime"));
			//console.log(networkDetails[i].getAttribute("networkUpdateTime"));
		}
	}
}
function deleteNetwork() {
	let deleteBtn = document.querySelectorAll(".btn_deleteNetwork");
	for(let i = 0; i < deleteBtn.length; i++) {
		deleteBtn[i].onclick = function() {
			let networkId = this.getAttribute("networkId");
			RequestByDeleteMethod("http://192.168.33.91:9696/v2.0/networks/" + networkId, 204).then(function(data) {
				console.log(data);
				getAllNetwork();
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
}
function getAllNetwork() {
	RequestByGetMethod("http://192.168.33.91:9696/v2.0/networks").then(function(data) {
		console.log(data);
		cleanNetworks();
		let networkFragment = document.createDocumentFragment();
		for (let i = 0; i < data.networks.length; i++) {
			let tmpTr = document.createElement('tr');
			let tmpType = data.networks[i]["provider:network_type"];
			let tmpExt = data.networks[i]["router:external"];
			tmpTr.innerHTML = '<td><a class="aTagNetworkDetails" networkName="'
				+ data.networks[i].name + '" networkShared="'
				+ data.networks[i].shared + '" networkId="'
				+ data.networks[i].id + '" networkExt="'
				+ tmpExt + '" networkStatus="'
				+ data.networks[i].status + '" networkType="'
				+ tmpType + '" networkCreateTime="'
				+ data.networks[i].created_at + '" networkUpdateTime="'
				+ data.networks[i].updated_at + '" href="networkDetail.html">' 
				+ data.networks[i].name + '</a></td><td>'
				+ data.networks[i].shared + '</td><td>'
				+ tmpExt + '</td><td>'
				+ data.networks[i].status + '</td><td>'
				+ tmpType + '</td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteNetwork" networkId="'
				+ data.networks[i].id + '">删除</button></li></ul></div></td>';
			networkFragment.appendChild(tmpTr);	
		}
		document.getElementById("networks").appendChild(networkFragment);
		details();
		deleteNetwork();
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
	getAllNetwork();
})