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
function cleanSnapshots() {
	let m = document.getElementById("snapshots");
	let nodesLength = m.childNodes.length;
	for (let i = 0; i < nodesLength; i++) {
		m.removeChild(m.childNodes[0]);
	}
}
function getAllImage() {
	RequestByGetMethod("http://192.168.33.91:9292/v2/images").then(function(data) {
		console.log(data);
		cleanSnapshots();
		let snapshotFragment = document.createDocumentFragment();
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
			snapshotFragment.appendChild(tmpTr);	
		}
		document.getElementById("snapshots").appendChild(snapshotFragment);
		details();
		deleteImage();
	}).catch(function(error) {
		console.log(error);
	});
}