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
function getAllProject() {
	RequestByGetMethod("http://192.168.33.91:5000/v3/projects").then(function(data) {
		console.log(data);
		cleanProjects();
		let projectFragment = document.createDocumentFragment();
		for (let i = 0; i < data.projects.length; i++) {
			let tmpTr = document.createElement('tr');
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
				+ i + '"></td><td><a class="aTagProjectDetails" projectDescription="'
				+ data.projects[i].description + '" projectName="'
				+ data.projects[i].name + '" projectId="'
				+ data.projects[i].id + '" projectRunnable="'
				+ data.projects[i].enabled + '" domainId="'
				+ data.projects[i].domain_id + '" href="userProgramDetail.html">' 
				+ data.projects[i].name + '</a></td><td>' 
				+ data.projects[i].enabled + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteProject" projectId="'
				+ data.projects[i].id + '">删除</button></li></ul></div></td>';
			projectFragment.appendChild(tmpTr);	
		}
		document.getElementById("projects").appendChild(projectFragment);
		details();
		deleteProject();
	}).catch(function(error) {
		console.log(error);
	});
}
function details() {
	let projectDetails = document.querySelectorAll(".aTagProjectDetails");
	for (let i = 0; i < projectDetails.length; i++) {
		projectDetails[i].onclick = function() {
			window.sessionStorage.setItem("projectName", projectDetails[i].getAttribute("projectName"));
			window.sessionStorage.setItem("projectId", projectDetails[i].getAttribute("projectId"));
			window.sessionStorage.setItem("projectRunnable", projectDetails[i].getAttribute("projectRunnable"));
			window.sessionStorage.setItem("projectDescription", projectDetails[i].getAttribute("projectDescription"));
			window.sessionStorage.setItem("domainId", projectDetails[i].getAttribute("domainId"));
			window.sessionStorage.setItem("isDomain", projectDetails[i].getAttribute("isDomain"));
		}
	}
}
function deleteProject() {
	let deleteBtn = document.querySelectorAll(".btn_deleteProject");
	for(let i = 0; i < deleteBtn.length; i++) {
		deleteBtn[i].onclick = function() {
			let projectId = this.getAttribute("projectId");
			RequestByDeleteMethod("http://192.168.33.91:5000/v3/projects/" + projectId, 204).then(function(data) {
				console.log(data);
				getAllProject();
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
}
function cleanProjects() {
	let m = document.getElementById("projects");
	let nodesLength = m.childNodes.length;
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function searchProjects() {
	let text = document.getElementById("searchInput");
	let arr = text.value;
	RequestByGetMethod("http://192.168.33.91:5000/v3/projects").then(function(data) {
		cleanProjects();
		for (let i = 0; i < data.projects.length; i++) {
			let projectFragment = document.createDocumentFragment();
			if (data.projects[i].name.indexOf(arr) != -1) {
				let tmpTr = document.createElement('tr');
				tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
					+ i + '"></td><td><a class="aTagProjectDetails" isDomain="'
					+ data.projects[i].is_domain + '" projectName="'
					+ data.projects[i].name + '" projectId="'
					+ data.projects[i].id + '" projectRunnable="'
					+ data.projects[i].enabled + '" domainId="'
					+ data.projects[i].domain_id + '" href="userProgramDetail.html">' 
					+ data.projects[i].name + '</a></td><td>' 
					+ data.projects[i].enabled + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteProject" projectId="'
					+ data.projects[i].id + '">删除</button></li></ul></div></td>';
				projectFragment.appendChild(tmpTr);
			}
			document.getElementById("projects").appendChild(projectFragment);
			details();
			deleteProject();
		}
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
	console.log(sessionStorage.getItem("projectName"));
	getAllProject();
})