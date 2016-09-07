(function (window, $) {

	//TODO: DEPARTAMENTS
	//TODO: remove inspectPc when respective worker has been fired
	//TODO: Implement game types: Normal, MMO(FTP, PTP), Sequel
	//TODO: custom consoles
	//TODO: tropes to be common within sequels

	//VARS

	var money = 20000;
	var codeBits = 0;
	var artBits = 0;
	var audioBits = 0;
	var researchBits = 0;
	var inDev = 0;
	var inDevType = 'none';

	var games = [];
	var inDevGame = {};

	var engines = [{
		name: "No Engine",
		art: 2000,
		audio: 2000,
		code: 2000
	}];

	var newEngine = {
		cost : 0,
		graphicsCost : 0,
		codeCost : 0,
		artCost : 0,
		audioCost : 0,
		code: 0,
		graphics: 0,
		audio: 0,
		art: 0,
		neededTime: 1,
		progress: 0
	};
	
	var inDevEngine = {};
	var newEngCode, newEngArt, newEngGraph, newEngAudio;

	var platforms = [1];

	var genres = [{name: "Shooter", owned: 1}, {name: "Platformer", owned: 0}, {name: "Fighting", owned: 1}, {name: "Stealth", owned: 0}];
	var topics = [{name: "Aliens", owned: 1}, {name: "Alternate History", owned: 1}, {name: "Amusement Park", owned: 0}];
	var sizes = [1, 1.5, 2.3];
	var devTimes = [10, 225, 425];

	var devTime = 0;

	var compatibility = [[10 , 8 , 10],
						 [8  , 10, 6 ],
						 [10 , 8 , 6 ]];

	var potentialWorkers = [];
	var workers = [];

	var hardwareInv = [];

	var features = [0];

	var time = 0; var _time = 0;
	var y = 1970; var m = 1; var d = 1;

	//FUNCTIONS

	function gatherBits(type){
		switch(type){
			case "game":
				var stage = getStage(inDevGame.progress);
				$(".inDevGameStatusStage").text(" - " + stage + " (" + Math.ceil(inDevGame.progress) + "%)");
				switch(stage){
					case "Prototype":
						for(i = 0; i < workers.length; i++){
							if(chance.weighted([1, 0], [75, 25])){
								var factor = chance.floating({fixed: 2, min: 0.5, max: 1.1});
								codeBits += Math.floor(factor * workers[i].codePoints);
								$(".newCode[data-id = '" + i + "'").text("+" + Math.floor(factor * workers[i].codePoints) + "CP");
								$(".newPoints").addClass("newPointsShow");
								setTimeout(function(){
									$(".newCode").empty();
									$(".newPoints").removeClass("newPointsShow");
								}, 1000);
							}
						}
						break;
					case "Alpha":
						for(i = 0; i < workers.length; i++){
							if(chance.weighted([1, 0], [75, 25])){
								var factor = chance.floating({fixed: 2, min: 0.5, max: 1.1});
								codeBits += Math.floor(factor * workers[i].codePoints);
								artBits += Math.floor(factor * workers[i].artPoints);
								
								$(".newCode[data-id = '" + i + "'").text("+" + Math.floor(factor * workers[i].codePoints) + "CP");
								$(".newArt[data-id = '" + i + "'").text("+" + Math.floor(factor * workers[i].artPoints) + "AP");
								$(".newPoints").addClass("newPointsShow");
								setTimeout(function(){
									$(".newCode").empty();
									$(".newArt").empty();
									$(".newPoints").removeClass("newPointsShow");
								}, 1000);
							}
						}
						break;
					case "Beta":
						for(i = 0; i < workers.length; i++){
							if(chance.weighted([1, 0], [75, 25])){
								var factor = chance.floating({fixed: 2, min: 0.5, max: 1.1});
								artBits += Math.floor(factor * workers[i].artPoints);
								audioBits +=Math.floor(factor * workers[i].audioPoints);
								
								$(".newArt").text("+" + Math.floor(factor * workers[i].artPoints) + "AP");
								$(".newAudio").text("+" + Math.floor(factor * workers[i].audioPoints) + "AuP");
								$(".newCode").empty();
								$(".newPoints").addClass("newPointsShow");
								setTimeout(function(){
									$(".newArt").empty();
									$(".newAudio").empty();
									$(".newPoints").removeClass("newPointsShow");
								}, 1000);
							}
						}
						break;
					default:
						console.log("unhandled game stage");
						break;
				}
				break;
			case "engine":
				for(i = 0; i < workers.length; i++){
					if(chance.weighted([0, 1], [75, 25])){//TODO: this chance should be influencec by a workers individual productivity
						researchBits += Math.floor(workers[i].level/10);
						updateHeader();
						$(".inDevGameReq").text(" Requirments: " + inDevEngine.cost + " RP (" + (inDevEngine.cost - researchBits) + " remaining)");
					}
				}
				break;
			case "feature":
				for(i = 0; i < workers.length; i++){
					if(chance.weighted([0, 1], [9, 1]))
						researchBits += workers[i].level/10;
				}
				break;
			case "none": break;
			default:
				console.log("unhandled gatherBits type");
				break;
		}
	}

	function getStage(procent){
		if(procent < 35){
			x = "Prototype";
			return x;
		} else if(procent < 75){
			x = "Alpha";
			return x;
		} else if(procent < 100){
			x = "Beta";
			return x;
		}
	}
	
	function getReviews(game){
		
	}

	//FUNCTIONS//MISC

	function areEqual(){
		var len = arguments.length;
		for (var i = 1; i < len; i++){
			if (arguments[i] != arguments[i-1])
				return false;
		}
		return true;
	}

	//FUNCTIONS//UI

	function updateHeader(){
		$(".money span").text(money);
		$(".codeBits span").text(codeBits);
		$(".artBits span").text(artBits);
		$(".audioBits span").text(audioBits);
		$(".researchBits span").text(researchBits);
	}

	function moveProgressBar(procent){
		if(procent > 100) procent = 100;
		var elem = document.getElementById("inDevBar"); 
		elem.style.width = procent + '%';
	}

	function moveTime(procent){
		if(procent > 100) procent = 100;
		var _elem = document.getElementById("timeBar"); 
		_elem.style.width = procent + '%';
	}

	function addCommas(z){
		return toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function zeroPad(num, places){
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	function updateEngineCost(){
		newEngine.cost = newEngine.graphicsCost + newEngine.artCost + newEngine.audioCost + newEngine.codeCost;
		$(".newEngineCost").html("Total Cost: " + newEngine.cost + "<img class='headerItem' title='RB' src='res/RB.png'>");
	}

	$(document).ready(function(){

		updateHeader();

		setInterval(function(){
			_time += 10;
			if(_time == 100){
				_time = 10;
				time++;
				d++;
				devTime ++;
				if(inDev){
					switch(inDevType){
						case "game":
							inDevGame.progress = (devTime * 100) / devTimes[inDevGame.size];
							if(inDevGame.progress >= 100){
								inDevGame.progress = 100;
								break;
							}
							gatherBits(inDevType);
							updateHeader();
							moveProgressBar(inDevGame.progress);
							console.log(inDevGame.progress);
							break;
						case "engine":
							gatherBits(inDevType);
							inDevEngine.progress = (researchBits * 100) / inDevEngine.cost;
							moveProgressBar(inDevEngine.progress);
							break;
						case "feature":
							break;
						default:
							console.log("unhandled inDevType");
							break;
					}

				}
				//TODO: at == 100, time should pause until release is pressed
				if(inDevEngine.progress >= 100){
					$(".finishedGameWrap").fadeIn(100);
					$(".finishedGameName").html(inDevEngine.name + "<br>(Engine)");
					$(".inDevGameName").text("");
					engines[engines.length] = inDevEngine;
					inDevEngine = {};
					inDev = 0;
					inDevType = "none";
					$(".inDevGameReq").empty();
					moveProgressBar(0);
				}
				if(inDevGame.progress == 100){
					$(".finishedGameWrap").fadeIn(100);
					$(".finishedGameName").html(inDevGame.name + "<br>(" + genres[inDevGame.genre].name + " | " + topics[inDevGame.topic].name + ")");
					inDev = 0;
					inDevType = "none";
					//TODO: reviews come here, to be added as an attribute
					inDevGame.releaseDate = [y, m, d];
					games[games.length] = inDevGame;
					inDevGame = {};
					$(".newGame").fadeIn(100);
					$(".inDevGameName").text("");
					$(".inDevGameStatusStage").empty();
					moveProgressBar(0);
				}
				if(d > 30){
					m++;
					d = 1;
					var totalSalary = 0;
					for(i = 0; i < workers.length; i++){
						totalSalary += workers[i].salary;
					}
					if(totalSalary){
                        $.playSound("../res/monthlypayment");
                        console.log("yolo");
						$(".notif").text("-$" + totalSalary).fadeIn(100);
						$(".noteWrapper").addClass("tgld");
						setTimeout(function(){
							$(".noteWrapper").removeClass("tgld");
                            $(".notif").empty().fadeOut();
						}, 5000);
					}
				}
				if(m > 12){y++; m = 1; d = 1;}
				$(".time").text(zeroPad(d, 2) + "." + zeroPad(m, 2) + "." + zeroPad(y, 4));
			}
			moveTime(_time);
		}, 250);
		
		$(".expandLeftMenu").click(function(){
			$(".leftWrap").toggleClass("expanded"); 
		});

		$(".main").click(function(){
			$(".window").fadeOut(0);
			$(".mainWindow").fadeIn(100);

			$(".currentWorkers").empty();

			for(i = 0; i < workers.length; i++){
                $(".currentWorkers").append('<div class="potentialWorker mainWorker"><i class="material-icons" id="fireWorker" data-id="'+ i +'" title="Fire">close</i><div class="potentialWorkerAvatar" style="background-color:' + workers[i].avatar + '"></div><div class="potentialWorkerName">'+ workers[i].firstName +' '+ workers[i].lastName +'</div><div class="potentialWorkerLevel">LEVEL ' + workers[i].level +'</div><div class="potentialWorkerInfo">' + workers[i].age + ' ('+ workers[i].gender +')<br>Coding: '+ workers[i].codePoints +'<br>Art: '+ workers[i].artPoints +'<br>Audio: '+ workers[i].audioPoints +'<br>Salary: $'+ workers[i].salary +'<br><button class="inspectPc" data-workerpcid="'+ i +'">Inspect PC</button></div><div class="newPoints"><div class="newCode" data-id="'+ i +'"></div><div class="newArt" data-id="'+ i +'"></div><div class="newAudio" data-id="'+ i +'"></div></div></div>');
			}
		});

		$(document).on("click", ".inspectPc", function(){
			$(".inspectPcWindow").fadeIn(100);

			var currentWorker = parseInt($(this).attr("data-workerPcId"));
			$(".inspectPcName").text(workers[currentWorker].fullName);

			xx = hardwareDb({id: workers[currentWorker].case}).get();
			$(".currentCase").text(xx[0].name);
			xx = hardwareDb({id: workers[currentWorker].power}).get();
			$(".currentPower").text(xx[0].name);
			xx = hardwareDb({id: workers[currentWorker].mobo}).get();
			$(".currentMobo").text(xx[0].name);
			xx = hardwareDb({id: workers[currentWorker].cpu}).get();
			$(".currentCpu").text(xx[0].name);
			xx = hardwareDb({id: workers[currentWorker].ram}).get();
			$(".currentRam").text(xx[0].name);
			xx = hardwareDb({id: workers[currentWorker].vcard}).get();
			$(".currentVcard").text(xx[0].vcard);
			xx = hardwareDb({id: workers[currentWorker].hard}).get();
			$(".currentHard").text(xx[0].name);
		});

		$("#closeInspectPc").click(function(){
			$(".inspectPcWindow").fadeOut(100);
		});

		$(document).on("click", "#fireWorker", function(){
			workers.splice(parseInt($(this).attr("data-id")), 1);
			$(this).parent(".potentialWorker").remove(); 
		});

		$(".newGame").click(function(){
			$(".window").fadeOut(0);
			$(".newGameWindow").fadeIn(100);

			$(".featWrap").empty();
			$(".list").empty();

			for(i = 0; i < genres.length; i++){
				if(genres[i].owned){
					$(".newGameGenreList").append("<option value='" + i + "'>" + genres[i].name + "</option>");
				}
			}
			for(i = 0; i < topics.length; i++){
				if(topics[i].owned){
					$(".newGameTopicsList").append("<option value='" + i + "'>" + topics[i].name + "</option>");
				}
			}
			for(i = 0; i < platforms.length; i++){
				var xx = platformsDb({id: platforms[i]}).get();
				$(".newGamePlatforms").append("<option value='" + i + "'>" + xx[0].name + "</option><br>");
			}
			for(i = 0; i < engines.length; i++){
				$(".newGameEngines").append("<option value='" + i + "'>" + engines[i].name + "</option><br>");
			}
		});

		$("#hideStatus").click(function(){
			$(".inDevGameStatus").toggleClass("moveStatusRight");
			$("#hideStatus").toggleClass("rotate");
		});
		
		$(".inDevArrow").click(function(){
			$(".inDevGameStatus").toggleClass("downed"); 
		});

		$(".startDev").click(function(){
			//TODO: some fade out maybe
			inDev = 1;
			inDevType = "game";
			devTime = 0;
			var newGameEngine = 0; //TEMP
			inDevGame = {
				name: document.getElementById("newGameName").value,
				size: $(".newGameSize").attr("data-size"),
				price: $(".newGamePrice").attr("data-price"),
				genre: $(".newGameGenreList option:selected").val(),
				topic: $(".newGameTopicsList option:selected").val(),
				progress: 0,
				engine: newGameEngine,
				minCode: engines[newGameEngine].minCode,
				minArt: engines[newGameEngine].minArt,
				minAudio: engines[newGameEngine].minAudio,//TODO: remove the minimum system, instead reviews are based on how good the genre/topics etc are matched
				releaseDate: 0
				/* subjComp: newGameSubjComp,
                graphics: newGameGraphics,
                audio: newGameAudio,
                marketing: newGameMarketing */
			};
			$(".inDevGameName").text(inDevGame.name + " (" + genres[inDevGame.genre].name + " | " + topics[inDevGame.topic].name + ")");
			$(".newGame").fadeOut(100);
			$(".main").trigger("click");
			moveProgressBar(0);
			$(".inDevGameStatusStage").text(" - Prototype (0%)");
		});

		$(".priceOption").click(function(){
			document.getElementById("newGamePrice").setAttribute("data-price", $(this).attr("data-price"));
			$(".priceOption").removeClass("selectedPrice");
			$(this).addClass("selectedPrice");
		});

		$(".sizeOption").click(function(){
			document.getElementById("newGameSize").setAttribute("data-size", $(this).attr("data-size"));
			$(".sizeOption").removeClass("selectedSize");
			$(this).addClass("selectedSize");
		});

		$(".closeFinishedGame").click(function(){
			$(".finishedGameWrap").fadeOut(100); 
		});

		$(".research").click(function(){
			$(".window").fadeOut(0);
			$(".researchWindow").fadeIn(100);

			$(".newResearch").empty();
			$(".list").empty();

			var xx = featuresDb().get();

			for(i = 0; i < xx.length; i++){
				var canResearch = 1;
				for(j = 0; j < xx[i].featReq.length; j++){
					if(xx[i].featReq[j] == 0) continue;
					if(features.indexOf(xx[i].featReq[j]) == -1){
						canResearch = 0;
					}
				}
				if (features.indexOf(xx[i].id) == -1 && canResearch){
					$(".newResearch").append("<div class='researchNewResearch' id='newResearchButton' data-genreId='" + xx[i].id + "'>" + xx[i].name + "<br>Price: " + xx[i].price + "<img class='researchPrice' title='RB' src='res/RB.png'></div>");
				}
			}

			for(i = 0; i < features.length; i++){
				if(!features[i]) continue;
				var xz = featuresDb({id: features[i]}).get();
				$(".newEngine" + xz[0].domain).append("<option selected='selected' value='" + i + "'>" + xz[0].name + "</option><br>");
				$(".newEngine" + xz[0].domain + "Details").text("(Cost: " + xz[0].points + "RP)");
				newEngine["engine" + xz[0].domain + "Cost"] = xz[0].points;
				updateEngineCost();
			}
		});

		$(document).on('click', '#newResearchButton', function(){
			var zz = parseInt($(this).attr("data-genreId"));
			features.push(zz);
			var xx = featuresDb({id: zz}).get();
			switch (xx[0].domain) {
				case "Graphics":
					newEngGraph = zz;
					break;
				case "Code":
					newEngCode = zz;
					break;
				case "Art":
					newEngArt = zz;
					break;
				case "Audio":
					newEngAudio = zz;
					break;
				default:
					console.log("unhandled domain case");
					break;
			}
			features.sort();
			$(this).remove();
			updateEngineCost();
			$(".research").trigger("click");
		});

		$(".newEngineGraphics").change(function(){                  //TODO: those 4 events should be only 1 
			newEngGraph = parseInt($(this).val());
			var xx = featuresDb({id: newEngGraph}).get();
			newEnginegraphicsCost = xx[0].points;
			updateEngineCost();
			$(".newEngineGraphicsDetails").text(" (Cost: " + xx[0].points + "RP)");
		});

		$(".newEngineCode").change(function(){
			newEngCode = parseInt($(this).val());
			var xx = featuresDb({id: newEngCode}).get();
			newEnginecodeCost = xx[0].points;
			updateEngineCost();
			$(".newEngineCodeDetails").text(" (Cost: " + xx[0].points + "RP)");
		});

		$(".newEngineArt").change(function(){
			newEngArt = parseInt($(this).val());
			var xx = featuresDb({id: newEngArt}).get();
			newEngine.artCost = xx[0].points;
			updateEngineCost();
			$(".newEngineArtDetails").text(" (Cost: " + xx[0].points + "RP)");
		});

		$(".newEngineAudio").change(function(){
			newEngAudio = parseInt($(this).val());
			var xx = featuresDb({id: newEngAudio}).get();
			newEngine.audioCost = xx[0].points;
			updateEngineCost();
			$(".newEngineAudioDetails").text(" (Cost: " + xx[0].points + "RP)");
		});

		$(".newEngineCreate").click(function(){
			newEngine.code = newEngCode;
			newEngine.graphics = newEngGraph;
			newEngine.audio = newEngAudio;
			newEngine.art = newEngArt;
			newEngine.name = $(".newEngineName").val();
			//should remove either the newEngine object or those stupid vars
			if(areEqual(featuresDb({id: newEngCode}).get()[0].techLevel, featuresDb({id: newEngGraph}).get()[0].techLevel, featuresDb({id: newEngAudio}).get()[0].techLevel, featuresDb({id: newEngArt}).get()[0].techLevel) && newEngine.name != ""){
				inDevEngine = newEngine;
				inDevEngine.progress = 0;
				inDevEngine.cost = newEngine.code + newEngine.graphics + newEngine.audio + newEngine.art;
				inDev = 1;
				inDevType = "engine";
				$(".inDevGameName").text(newEngine.name + (" (Engine)"));
				$(".inDevGameReq").text(" Requirments: " + inDevEngine.cost + " RP");
				moveProgressBar(0);
			}
		});

		$(".upgrades").click(function(){
			$(".window").fadeOut(0);
			$(".upgradesWindow").fadeIn(100);

			$(".newGenres").empty();

			var _x = 0;
			for(i = 0; i < genres.length; i++){
				if(!genres[i].owned){
					$(".newGenres").append("<div class='upgradesNewGenre' data-genreId='" + i + "'>" + genres[i].name + "</div>");
					_x ++;
				}
				if (_x == 5) break;
			}
		});

		$(".recruit").click(function(){
			$(".window").fadeOut(0);
			$(".recruitWindow").fadeIn(0);
			$(".potentialWorkersList").empty();
			for(i = 0; i < 6; i++){
				var basePoints = chance.natural({min: 1, max: 25});//TODO: chooses potentialWorkers by players own level
				var abilityOrder = chance.shuffle([0.8, 1.3, 3]);
				var age = chance.natural({min: 18, max: 50});
				var avatar = chance.color({format: 'hex'});
				if(chance.bool()){
					var fName = chance.first({gender: 'Male'});
					var gender = 'M';
				} else {
					var fName = chance.first({gender: 'Female'});
					var gender = 'F';
				}

				var lName = chance.last();

				potentialWorkers[i] = {
					firstName: fName,
					lastName: lName,
					fullName: fName + " " + lName,
					age: age,
					gender: gender,
					avatar: avatar,
					level: basePoints,
					exp: 0,
					toNextLevel: 500,
					codePoints: Math.floor(basePoints * abilityOrder[0] + age/10),
					artPoints: Math.floor(basePoints * abilityOrder[1] + age/10),
					audioPoints: Math.floor(basePoints * abilityOrder[2] + age/10),
					salary: 160 * basePoints,
					case: 1,
					power: 2,
					mobo: 3,
					cpu: 4,
					ram: 5,
					vcard: 6,
					hard: 7
				};
			}
			for(i = 0; i < 6; i++){
				$(".potentialWorkersList").append("<div class='potentialWorker'><div class='potentialWorkerAvatar' style='background-color:" + potentialWorkers[i].avatar + "'></div><div class='potentialWorkerInfo'><b>" + potentialWorkers[i].firstName + " " + potentialWorkers[i].lastName + "<br>" + potentialWorkers[i].age + " (" + potentialWorkers[i].gender + ")" + "<br>Coding: " + potentialWorkers[i].codePoints + "<br>Art: " + potentialWorkers[i].artPoints + "<br>Audio: " + potentialWorkers[i].audioPoints + "<br>Salary: $" + potentialWorkers[i].salary + "<br><button class='recruitButton' data-recruitId='" + i + "'>Recruit</button></div></div>");
			}
		});

		$(document).on("click", ".recruitButton", function(){
			var newRecruit = parseInt($(this).attr("data-recruitId"));

			workers[workers.length] = potentialWorkers[newRecruit];
			potentialWorkers.splice(newRecruit, 1);

			$(".recruit").trigger("click");
		});

		$(".shop").click(function(){
			$(".window").fadeOut(0);
			$(".shopWindow").fadeIn(100);
			$(".newHardware").empty();

			var xx = hardwareDb().get();

			for(i = 0; i < xx.length; i++){
				$(".newHardware").append("<div class='hardwareItem' data-hardwareId='" + xx[i].id + "'>" + xx[i].name + "<br>$" + xx[i].price + "</div>");
			}
		});

		$(document).on("click", ".hardwareItem", function(){
			hardwareInv[hardwareInv.length] = parseInt($(this).attr("data-hardwareId"));
			console.log(hardwareInv);
		});

		$(".stats").click(function(){
			$(".window").fadeOut(0);
			$(".statsWindow").fadeIn(100);
			$(".list").empty();

			$(".statsGameCount").text(games.length);      

			for(i = 0; i < games.length; i++){
				$(".gameHistory").append("<div class='releasedGameWrap'><div class='releasedGame'><div class='releasedGameName'>" + games[i].name + "</div><div class='releasedGameGenresTopics'>" + genres[games[i].genre].name + " | " + topics[games[i].topic].name + "</div><div class='releasedGameDate'>" + games[i].releaseDate[2] + "/" + games[i].releaseDate[1] + "/" + games[i].releaseDate[0] + "</div></div></div>");
			} 
		});
        
	});

})(window, window.jQuery);