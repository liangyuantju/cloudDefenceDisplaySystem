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
function cleanImages() {
	let m = document.getElementById("images");
	let nodesLength = m.childNodes.length;
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function details() {
	let imageDetails = document.querySelectorAll(".aTagImageDetails");
	for (let i = 0; i < imageDetails.length; i++) {
		imageDetails[i].onclick = function() {
			window.sessionStorage.setItem("imageOwner", imageDetails[i].getAttribute("imageOwner"));
			window.sessionStorage.setItem("imageId", imageDetails[i].getAttribute("imageId"));
			window.sessionStorage.setItem("imageSize", imageDetails[i].getAttribute("imageSize"));
			window.sessionStorage.setItem("imageVisibility", imageDetails[i].getAttribute("imageVisibility"));
			window.sessionStorage.setItem("isImageProtected", imageDetails[i].getAttribute("isImageProtected"));
			window.sessionStorage.setItem("imageCreateTime", imageDetails[i].getAttribute("imageCreateTime"));
			window.sessionStorage.setItem("imageUpdateTime", imageDetails[i].getAttribute("imageUpdateTime"));
		}
	}
}
function deleteImage() {
	let deleteBtn = document.querySelectorAll(".btn_deleteImage");
	for(let i = 0; i < deleteBtn.length; i++) {
		deleteBtn[i].onclick = function() {
			let imageId = this.getAttribute("imageId");
			RequestByDeleteMethod("https://192.168.33.91:9292/v2/images/" + imageId, 204).then(function(data) {
				console.log(data);
				getAllImage();
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
}
function getAllImage() {
	RequestByGetMethod("http://192.168.33.91:9292/v2/images").then(function(data) {
		console.log(data);
		cleanImages();
		let imageFragment = document.createDocumentFragment();
		for (let i = 0; i < data.images.length; i++) {
			let tmpTr = document.createElement('tr');
			tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
				+ i + '"></td><td><a class="aTagImageDetails" imageOwner="'
				+ data.images[i].owner + '" imageName="'
				+ data.images[i].name + '" imageId="'
				+ data.images[i].id + '" imageSize="'
				+ data.images[i].size + '" imageVisibility="'
				+ data.images[i].visibility + '" isImageProtected="'
				+ data.images[i].protected + '" imageCreateTime="'
				+ data.images[i].created_at + '" imageUpdateTime="'
				+ data.images[i].updated_at + '" href="imageDetail.html">' 
				+ data.images[i].name + '</a></td><td><a href="#">'
				+ data.images[i].owner + '</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteImage" imageId="'
				+ data.images[i].id + '">删除</button></li></ul></div></td>';
			imageFragment.appendChild(tmpTr);	
		}
		document.getElementById("images").appendChild(imageFragment);
		details();
		deleteImage();
	}).catch(function(error) {
		console.log(error);
	});
}
function searchProjects() {
	let text = document.getElementById("searchInput");
	let arr = text.value;
	RequestByGetMethod("http://192.168.33.91:9292/v2/images").then(function(data) {
		cleanProjects();
		for (let i = 0; i < data.projects.length; i++) {
			let imageFragment = document.createDocumentFragment();
			if (data.projects[i].name.indexOf(arr) != -1) {
				let tmpTr = document.createElement('tr');
				tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
					+ i + '"></td><td><a class="aTagImageDetails" imageOwner="'
					+ data.images[i].owner + '" imageName="'
					+ data.images[i].name + '" imageId="'
					+ data.images[i].id + '" imageSize="'
					+ data.images[i].size + '" imageVisibility="'
					+ data.images[i].visibility + '" isImageProtected="'
					+ data.images[i].protected + '" imageCreateTime="'
					+ data.images[i].created_at + '" imageUpdateTime="'
					+ data.images[i].updated_at + '" href="imageDetail.html">' 
					+ data.images[i].name + '</a></td><td><a href="#">'
					+ data.images[i].owner + '</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteImage" imageId="'
					+ data.images[i].id + '">删除</button></li></ul></div></td>';
				imageFragment.appendChild(tmpTr);
			}
			document.getElementById("images").appendChild(imageFragment);
			details();
			deleteImage();
		}
	}).catch(function(error) {
		console.log(error);
	});
}
$().ready(function () {
	let name = window.sessionStorage.getItem("loginName");
	let password = window.sessionStorage.getItem("loginPassword");
	RequestByPostMethod("http://192.168.33.17:5000/v3/auth/tokens", {"auth":{"identity":{"methods":["password"],"password":{"user":{"name":name,"domain":{"name":"default"},"password":password}}},"scope":{"project":{"domain":{"name":"default"},"name":"admin"}}}}, 201).then(function(data) {
		console.log(data);
	}).catch(function(error) {
		console.log(error);
	});
	console.log(sessionStorage.getItem("projectName"));
	getAllImage();
})