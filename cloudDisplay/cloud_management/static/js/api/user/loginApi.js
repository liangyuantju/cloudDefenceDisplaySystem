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
	
	function Login() {
		let name = document.getElementById("username").value;
	    let password = document.getElementById("password").value;
		RequestByPostMethod("http://192.168.33.91:5000/v3/auth/tokens", {"auth":{"identity":{"methods":["password"],"password":{"user":{"name":name,"domain":{"name":"default"},"password":password}}},"scope":{"project":{"domain":{"name":"default"},"name":"admin"}}}}, 201).then(function(data) {
			console.log(data);
			window.sessionStorage.setItem("loginName", name);
			window.sessionStorage.setItem("loginPassword", password);
			window.location.href='index.html';
		}).catch(function(error) {
			console.log(error);
			alert("账号或密码错误！"); 
			//console.log("错误");
		});
	}