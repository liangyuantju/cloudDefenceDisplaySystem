var aOpenStack = document.querySelectorAll(".openStack");
var aCloudStack = document.querySelectorAll(".cloudStack");

$().ready(function () {
	startCloud();
	stopCloud();
	cureCloud();
});

function changeState(osNumber, csNumber) {
	let openStack = document.querySelectorAll(".openStack");
	let cloudState = document.querySelectorAll(".cloudStack");
	for (let i = 0; i < 4; i++) {
		if (i < osNumber) {
			openStack[i].innerHTML = "运行";
		} else {
			openStack[i].innerHTML = "停止";
		}	
	}
	for (let i = 0; i < 4; i++) {
		if (i < csNumber) {
			cloudState[i].innerHTML = "运行";
		} else {
			cloudState[i].innerHTML = "停止";
		}	
	}
}

function updateNumber() {
	let osNumber = document.getElementById("osNumber").value;
	let csNumber = document.getElementById("csNumber").value;
	let isNumberInit = "false";
	if (osNumber == 0 && csNumber == 0) {
		alert("集群数不能都为0！");
	} else {
		window.localStorage.setItem("osNumber", osNumber);
		window.localStorage.setItem("csNumber", csNumber);
		changeState(osNumber, csNumber);
		window.open("cloudIndex.html");
	}
}

function startCloud() {
	let startBtn = document.querySelectorAll(".btn_startCloud");
	for(let i = 0; i < startBtn.length; i++) {
		
		startBtn[i].onclick = function() {
			let num = i + 1;
			let tmpState = "cloudState" + num;
			
			let tmpNode = startBtn[i].parentNode.parentNode;
			console.log(tmpNode);
			console.log(tmpNode.getAttribute("cloudClass"));
			if(tmpNode.getAttribute("cloudClass") == "openStack") {
				if (i < 4 && (aOpenStack[i].innerHTML == "停止" || aOpenStack[i].innerHTML == "自愈中")) {
					//window.localStorage.setItem("osNumber", parseInt(window.localStorage.getItem("osNumber"), 10) + 1);
					window.localStorage.setItem("userAction", "openAdd");
				}
			} else {
				if (aCloudStack[i - 4].innerHTML == "停止" || aOpenStack[i].innerHTML == "自愈中") {
					//console.log("这是第 " + i)
					//window.localStorage.setItem("csNumber", parseInt(window.localStorage.getItem("csNumber"), 10) + 1);
					window.localStorage.setItem("userAction", "cloudAdd");
				}
			}
			window.localStorage.setItem("numI", i);
			document.getElementById(tmpState).innerHTML = "运行";
		}
	}
}

function stopCloud() {
	let stopBtn = document.querySelectorAll(".btn_stopCloud");
	for(let i = 0; i < stopBtn.length; i++) {
		stopBtn[i].onclick = function() {
			let num = i + 1;
			let tmpState = "cloudState" + num;
			
			let tmpNode = stopBtn[i].parentNode.parentNode;

			console.log(tmpNode);
			console.log(tmpNode.getAttribute("cloudClass"));
			

			if(tmpNode.getAttribute("cloudClass") == "openStack") {
				if (i < 4 && aOpenStack[i].innerHTML == "运行") {
					window.localStorage.setItem("userAction", "openStop");
					//window.localStorage.setItem("osNumber", parseInt(window.localStorage.getItem("osNumber"), 10) - 1);
				}
			} else {
				if (aCloudStack[i - 4].innerHTML == "运行") {
					window.localStorage.setItem("userAction", "cloudStop");
					//window.localStorage.setItem("csNumber", parseInt(window.localStorage.getItem("csNumber"), 10) - 1);
				}
			}
			window.localStorage.setItem("numI", i);
			document.getElementById(tmpState).innerHTML = "停止";
		}
	}
}
function cureCloud() {
	let cureBtn = document.querySelectorAll(".btn_selfCure");
	for(let i = 0; i < cureBtn.length; i++) {
		cureBtn[i].onclick = function() {
			let num = i + 1;
			let tmpState = "cloudState" + num;
			
			let tmpNode = cureBtn[i].parentNode.parentNode;
			if(tmpNode.getAttribute("cloudClass") == "openStack") {
				if (i < 4 && aOpenStack[i].innerHTML == "运行") {
					window.localStorage.setItem("userAction", "openCure");
					//window.localStorage.setItem("osNumber", parseInt(window.localStorage.getItem("osNumber"), 10) - 1);
				}
			} else {
				if (aCloudStack[i - 4].innerHTML == "运行") {
					window.localStorage.setItem("userAction", "cloudCure");
					//window.localStorage.setItem("csNumber", parseInt(window.localStorage.getItem("csNumber"), 10) - 1);
				}
			}
			document.getElementById(tmpState).innerHTML = "自愈中";
		}
	}
}

document.querySelector(".cloud-synchronize").onclick = function() {
	setTimeout(function(){alert("已同步")}, 4000);
	console.log(22);
}