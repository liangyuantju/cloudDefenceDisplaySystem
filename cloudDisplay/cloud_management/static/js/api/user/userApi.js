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
		function cleanUsers() {
			let m = document.getElementById("users");
			let nodesLength = m.childNodes.length;
			for (let i = 0; i < nodesLength; i++) {
				m.removeChild(m.childNodes[0]);
			}
		}
		function getAllUser() {
			
		    RequestByGetMethod("http://192.168.33.17:5000/v3/users").then(function(data) {
		        console.log(data);
				cleanUsers();
				let userFragment = document.createDocumentFragment();
				for (let i = 0; i < data.users.length; i++) {
					let tmpTr = document.createElement('tr');
					tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
						+ i + '"></td><td><a class="aTagUserDetails" userName="'
						+ data.users[i].name + '" userId="'
						+ data.users[i].id + '" runnable="'
						+ data.users[i].enabled + '" domainId="'
						+ data.users[i].domain_id + '" href="userDetail.html">' 
						+ data.users[i].name + '</a></td><td>' 
						+ data.users[i].enabled + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteUser" userId="'
						+ data.users[i].id + '">删除</button></li></ul></div></td>';
					userFragment.appendChild(tmpTr);	
				}
				document.getElementById("users").appendChild(userFragment);
				details();
				deleteUser();
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
			console.log(sessionStorage.getItem("X-Auth-Token"));
			getAllUser();
			createUserPage()
		})
		function details() {
			let userDetails = document.querySelectorAll(".aTagUserDetails");
			for (let i = 0; i < userDetails.length; i++) {
				userDetails[i].onclick = function() {
					window.sessionStorage.setItem("userName", userDetails[i].getAttribute("userName"));
					window.sessionStorage.setItem("userId", userDetails[i].getAttribute("userId"));
					window.sessionStorage.setItem("runnable", userDetails[i].getAttribute("runnable"));
					window.sessionStorage.setItem("domain", "default");
					window.sessionStorage.setItem("domainId", userDetails[i].getAttribute("domainId"));
				}
			}
		}
		function deleteUser() {
			let deleteBtn = document.querySelectorAll(".btn_deleteUser");
			for(let i = 0; i < deleteBtn.length; i++) {
				deleteBtn[i].onclick = function() {
					let userId = this.getAttribute("userId");
					RequestByDeleteMethod("http://192.168.33.17:5000/v3/users/" + userId, 204).then(function(data) {
						console.log(data);
						getAllUser();
					}).catch(function(error) {
						console.log(error);
					});
				}
			}
		}
		function searchUsers() {
			let text = document.getElementById("searchInput");
			let arr = text.value;
			RequestByGetMethod("http://192.168.33.17:5000/v3/users").then(function(data) {
				cleanUsers();
				for (let i = 0; i < data.users.length; i++) {
					let userFragment = document.createDocumentFragment();
					if (data.users[i].name.indexOf(arr) != -1) {
						let tmpTr = document.createElement('tr');
						tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="'
							+ i + '"></td><td><a class="aTagUserDetails" userName="'
							+ data.users[i].name + '" userId="'
							+ data.users[i].id + '" runnable="'
							+ data.users[i].enabled + '" domainId="'
							+ data.users[i].domain_id + '" href="userDetail.html">' 
							+ data.users[i].name + '</a></td><td>' 
							+ data.users[i].enabled + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteUser" userId="'
							+ data.users[i].id + '">删除</button></li></ul></div></td>';
						userFragment.appendChild(tmpTr);	
					}
					document.getElementById("users").appendChild(userFragment);
					details();
					deleteUser();
				}
			}).catch(function(error) {
		        console.log(error);
		    });
		}
		function createUserPage() {
			document.getElementById("btn-createUser").onclick = function() {
				console.log("111");
				window.location.href = "createUser.html";
			}
		}
		/*
		function getUser(userId) {
			RequestByGetMethod("http://192.168.33.17:5000/v3/users" + userId).then(function(data) {
			    console.log(data);
				cleanUsers();
				let userFragment = document.createDocumentFragment();
				let tmpTr = document.createElement('tr');
				tmpTr.innerHTML = '<td><input type="checkbox" name="post[]" value="2"></td><td><a href="#">' 
					+ data.name + '</a></td><td>' 
					+ data.enabled + '</td><td><a href="#">default</a></td><td><div class="btn-group m-r"><button data-toggle="dropdown" class="btn btn-sm btn-primary dropdown-toggle"><span class="dropdown-label">编辑</span><span class="caret"></span></button><ul class="dropdown-menu dropdown-select"><li class="active"><button type="button" class="btn btn_deleteUser" userId="'
					+ data.id + '">删除</button></li></ul></div></td>';
				userFragment.appendChild(tmpTr);
				document.getElementById("users").appendChild(userFragment);
				deleteUser();
			}).catch(function(error) {
			    console.log(error);
			});
		}
		*/