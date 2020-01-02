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
function cleanRoles() {
	let m = document.getElementById("roles");
	let nodesLength = m.childNodes.length;
	console.log(nodesLength);
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function getAllRole() {
	RequestByGetMethod("http://192.168.33.17:5000/v3/roles").then(function(data) {
	    console.log(data);
		cleanRoles();
		let roleFragment = document.createDocumentFragment();
		for (let i = 0; i < data.roles.length; i++) {
			let tmpTr = document.createElement('tr');
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="2"></td><td><a href="#">'
				+ data.roles[i].name + '</a></td><td>'
				+ data.roles[i].id + '</td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteRole" roleId="'
				+ data.roles[i].id + '">删除</button></li></ul></div></td>';
			roleFragment.appendChild(tmpTr);
		}
		document.getElementById("roles").appendChild(roleFragment);
	}).catch(function(error) {
	    console.log(error);
	});
}
function deleteRole() {
	let deleteBtn = document.querySelectorAll(".btn_deleteRole");
	for(let i = 0; i < deleteBtn.length; i++) {
		deleteBtn[i].onclick = function() {
			let roleId = this.getAttribute("roleId");
			RequestByDeleteMethod("http://192.168.33.17:5000/v3/roles/" + roleId, 204).then(function(data) {
				console.log(data);
				getAllRole();
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
}
$().ready(function () {
	let name = window.sessionStorage.getItem("loginName");
	let password = window.sessionStorage.getItem("loginPassword");
	RequestByPostMethod("http://192.168.33.17:5000/v3/auth/tokens", {"auth":{"identity":{"methods":["password"],"password":{"user":{"name":name,"domain":{"name":"default"},"password":password}}},"scope":{"project":{"domain":{"name":"default"},"name":"admin"}}}}, 201).then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});
	getAllRole();
})