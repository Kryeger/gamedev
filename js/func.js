(function (window, $) {
	
	//TODO: DEPARTAMENTS
	//TODO: remove inspectPc when respective worker has been fired
	//TODO: Implement game types: Normal, MMO(FTP, PTP), Sequel
	//TODO: custom consoles
	//TODO: tropes to be common within sequels

	$.fn.digits = function(){ 
		return this.each(function(){ 
			$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
		})
	}

	//VARS

	var money = 20000;
	var codeBits = 0;
	var artBits = 0;
	var audioBits = 0;
	var researchBits = 0;
	var inDev = 0;
	var inDevType = 'none';
	var selling = [];
	var fans = 0;
	
	var paused = 0;

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
	var newEngCode, newEngArt, newEngGraph, newEngAudio; //TODO: useless, remove those

	var platforms = [1];

	var genres = [
		{name: "Action", owned: 1},
		{name: "Shooter", owned: 1},
	  	{name: "Platformer", owned: 1},
		{name: "Fighting", owned: 1},
		{name: "Stealth", owned: 1},
		{name: "Survival Horror", owned: 1},
		{name: "Adventure", owned: 1},
		{name: "RPG", owned: 1},
		{name: "Simulation", owned: 1},
		{name: "Strategy", owned: 1},
		{name: "Casual", owned: 1},
		{name: "Tabletop", owned: 1},
		{name: "Educational", owned: 1},

	];
	var topics = [
		{name: "Aliens", owned: 1},
		{name: "Alternate History", owned: 1},
		{name: "Amusement Park", owned: 1},
		{name: "Animals", owned: 1},
		{name: "Apocalypse", owned: 1},
		{name: "City", owned: 1},
		{name: "Crime", owned: 1},
		{name: "Fantasy", owned: 1},
		{name: "Fashion", owned: 1},
		{name: "Flying", owned: 1},
		{name: "Detective", owned: 1},
		{name: "Dungeon", owned: 1},
		{name: "Dystopian", owned: 1},
		{name: "Medical", owned: 1},
		{name: "Military", owned: 1},
		{name: "Mythology", owned: 1},
		{name: "Naval", owned: 1},
		{name: "Ninja", owned: 1},
		{name: "Parkour", owned: 1},
		{name: "Pirate", owned: 1},
		{name: "Police", owned: 1},
		{name: "Racing", owned: 1},
		{name: "Robot", owned: 1},
		{name: "School", owned: 1},
		{name: "Sci-Fi", owned: 1},
		{name: "Space", owned: 1},
		{name: "Sports", owned: 1},
		{name: "Spy", owned: 1},
		{name: "Superheroes", owned: 1},
		{name: "Time Travel", owned: 1},
		{name: "Vampires", owned: 1},
		{name: "Zombie", owned: 1},
	];
	
	var sizes = [1, 1.5, 2.3];
	var devTimes = [10, 30, 60]; //TODO: Game's size should affect these
	var sellingTime = [10, 20, 30]; //TODO: very temp, should be affected by the reviews

	var devTime = 0;

	var compatibility = [
		[8, 8, 7, 6, 5, 10, 10, 8, 2, 7, 2, 3, 2], [6, 7, 1, 2, 6, 7, 6, 6, 2, 10, 1, 8, 6], [3, 1, 7, 1, 2, 6, 5, 5, 1, 10, 8, 4, 8], [3, 1, 7, 3, 1, 6, 10, 7, 4, 2, 10, 7, 10], [7, 6, 4, 4, 8, 10, 8, 7, 2, 6, 1, 2, 2], [2, 4, 1, 1, 1, 2, 8, 2, 1, 10, 4, 8, 2], [10, 10, 2, 6, 7, 9, 6, 4, 1, 8, 1, 1, 2], [2, 1, 7, 2, 1, 5, 10, 10, 2, 3, 4, 6, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 10, 3, 10], [6, 10, 3, 1, 5, 1, 10, 3, 10, 5, 7, 1, 7], [10, 9, 3, 2, 10, 9, 7, 3, 1, 1, 1, 4, 3], [2, 2, 6, 1, 5, 8, 7, 10, 1, 1, 3, 10, 1], [8, 8, 4, 3, 7, 10, 9, 8, 3, 5, 1, 7, 4], [4, 1, 1, 2, 1, 7, 3, 6, 10, 10, 6, 1, 10], [8, 10, 3, 8, 7, 4, 8, 7, 8, 10, 2, 1, 4], [6, 2, 3, 8, 2, 5, 8, 9, 2, 8, 3, 9, 7], [6, 8, 4, 1, 3, 5, 8, 6, 9, 10, 4, 7, 6], [8, 2, 7, 9, 10, 6, 8, 8, 1, 1, 1, 3, 5], [8, 2, 10, 9, 8, 4, 10, 2, 2, 1, 1, 1, 3], [8, 3, 5, 7, 2, 8, 9, 9, 3, 8, 1, 7, 5], [10, 10, 1, 8, 8, 8, 6, 2, 1, 4, 1, 1, 5], [6, 4, 1, 2, 1, 1, 6, 8, 10, 1, 8, 1, 8], [8, 10, 7, 8, 2, 8, 8, 8, 2, 6, 2, 3, 5], [2, 1, 4, 1, 2, 8, 8, 4, 1, 10, 7, 2, 10], [8, 6, 3, 7, 3, 9, 10, 7, 3, 6, 1, 4, 2], [3, 7, 1, 1, 1, 6, 10, 6, 10, 8, 2, 1, 7], [2, 1, 6, 8, 1, 1, 1, 1, 10, 8, 8, 1, 8], [9, 10, 3, 5, 10, 10, 4, 3, 2, 7, 1, 1, 3], [8, 6, 3, 10, 3, 2, 6, 3, 1, 1, 7, 7, 3], [6, 3, 5, 2, 7, 6, 10, 4, 6, 7, 3, 1, 4], [8, 2, 6, 6, 7, 10, 7, 8, 1, 1, 1, 5, 1], [8, 10, 3, 1, 10, 10, 6, 8, 1, 5, 1, 1, 1]
	];

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
								audioBits += Math.floor(factor * workers[i].audioPoints);
								
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
	
	function getReview(game){
		var artRating = game.art * 100 / engines[game.engine].art;
		var codeRating = game.code * 100 / engines[game.engine].code;
		var audioRating = game.audio * 100 / engines[game.engine].audio;
		var combo = 10 * compatibility[game.topic][game.genre];
		//TODO: each rating will have a different importance depending on the genre/topic
		var baseReview = (((artRating + codeRating + audioRating) + combo) / 4);
		var review = (baseReview / 10).toFixed(1);
		if(review < 1.0) review = 1.0;
		if(review > 10) review = 10;
		return review;
	}
	
	function resetContrib(){
		for(i = 0; i < workers.length; i++){
			workers[i].artContrib = 0;
			workers[i].audioContrib = 0;
			workers[i].codeContrib = 0;
		}
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
	
	function setDecelTimeout(callback, factor, times){
		var internalCallback = function(t, counter){
			return function(){
				if (--t > 0){
					window.setTimeout(internalCallback, ++counter * factor);
					callback();
				}
			}
		}(times, 0);
		window.setTimeout(internalCallback, factor);
	};

	//FUNCTIONS//UI

	function updateHeader(){
		$(".money span").text(Math.floor(money)).digits();
		$(".codeBits span").text(codeBits).digits();
		$(".artBits span").text(artBits).digits();
		$(".audioBits span").text(audioBits).digits();
		$(".researchBits span").text(researchBits).digits();
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

	function zeroPad(num, places){
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	function updateEngineCost(){
		newEngine.cost = newEngine.graphicsCost + newEngine.artCost + newEngine.audioCost + newEngine.codeCost;
		$(".newEngineCost").html("Total Cost: " + newEngine.cost + "<img class='headerItem' title='RB' src='res/RB.png'>");
	}
	
	function updateStats(){
		$(".gameHistory").empty();
		$(".statsGameCount").text(games.length);      

		for(var j = 0; j < games.length; j++){
			$(".gameHistory").append("<div class='releasedGameWrap'><div class='releasedGame'><div class='releasedGameName'>" + games[j].name + "</div><div class='releasedGameGenresTopics'>" + genres[games[j].genre].name + " | " + topics[games[j].topic].name + "</div><div class='releasedGameDate'>" + games[j].releaseDate[2] + "/" + games[j].releaseDate[1] + "/" + games[j].releaseDate[0] + "<br>" + games[j].copies + " copies sold</div></div></div>");
		} 
	}

	$(document).ready(function(){

		updateHeader();
		$(".fans").text(fans + " fans");

		setInterval(function(){
			if(!paused){
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
									inDevGame.art = artBits;
									inDevGame.code = codeBits;
									inDevGame.audio = audioBits;
									break;
								}
								gatherBits(inDevType);
								updateHeader();
								moveProgressBar(inDevGame.progress);
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
						$(".finishedGameWrap").fadeIn(0);
						$(".finishedGameName").html(inDevEngine.name + "<br>(Engine)");
						$(".inDevGameName").text("");
						engines[engines.length] = inDevEngine;
						inDevEngine = {};
						inDev = 0;
						inDevType = "none";
						$(".inDevGameReq").empty();
						moveProgressBar(0);
						paused = 1;
					}
					if(inDevGame.progress == 100){
						inDevGame.review = getReview(inDevGame);
						$(".finishedGameWrap").fadeIn(0);
						$(".finishedGameName").html(inDevGame.name + "<br>(" + genres[inDevGame.genre].name + " | " + topics[inDevGame.topic].name + ")");
						var rev = getReview(inDevGame);
						//TODO: fix this mess into a fn
						var factor1 = rev * chance.floating({min: 0.8, max: 1.2});
						if(factor1 > 10) factor1 = 10;
						if(factor1 < 1) factor1 = 1;
						var factor2 = rev * chance.floating({min: 0.8, max: 1.2});
						if(factor2 > 10) factor2 = 10;
						if(factor2 < 1) factor2 = 1;
						var factor3 = rev * chance.floating({min: 0.8, max: 1.2});
						if(factor3 > 10) factor3 = 10;
						if(factor3 < 1) factor3 = 1;
						var factor4 = rev * chance.floating({min: 0.8, max: 1.2});
						if(factor4 > 10) factor4 = 10;
						if(factor4 < 1) factor4 = 1;
						
						$(".reviewNr").not(".review4Nr").empty();

						var minNr = 1;
						var maxNr = 10;
						
						setDecelTimeout(function(){
							if(minNr < factor1) minNr += factor1/10;
							if(maxNr > factor1) maxNr -= factor1/10;
							$(".review1Nr").text((chance.floating({min: minNr, max: maxNr})).toFixed(1));
						}, 20, 10);
						
						
						setTimeout(function(){
							$(".review1Nr").text((factor1).toFixed(1));
							setDecelTimeout(function(){
								$(".review2Nr").text((chance.floating({min: (factor2/2) + 1, max: 10})).toFixed(1));
							}, 20, 10);
						}, 1000);
						
						setTimeout(function(){
							$(".review2Nr").text((factor2).toFixed(1));
							setDecelTimeout(function(){
								$(".review3Nr").text((chance.floating({min: (factor3/2) + 1, max: 10})).toFixed(1));
							}, 20, 02);
						}, 2000);
						
						setTimeout(function(){
							$(".review3Nr").text((factor3).toFixed(1));
							setDecelTimeout(function(){
								$(".reviewStars").css("width", chance.floating({min: (factor4/2) + 1, max: 10}).toFixed(1) + "%");
							}, 20, 10);
						}, 3000);
						
						setTimeout(function(){
							//$(".review4Nr").text((factor4).toFixed(1));
							$(".reviewStars").css("width", ((factor4).toFixed(1) * 10) + "%");
						}, 4000);
						
						inDev = 0;
						inDevType = "none";
						//TODO: reviews come here, to be added as an attribute
						inDevGame.releaseDate = [y, m, d];
						games[games.length] = inDevGame;
						console.log(games);
						
						selling[selling.length] = games.length - 1;
						games[games.length - 1].copies = 0;
						games[games.length - 1].sellTime = sellingTime[games[games.length - 1].size];
						$(".currentSaleTitle").text(games[games.length - 1].name);
						$(".currentSaleCopies").text(games[games.length - 1].copies + " copies sold");
						
						inDevGame = {};
						$(".newGame").fadeIn(0);
						$(".inDevGameName").text("");
						$(".inDevGameStatusStage").empty();
						moveProgressBar(0);
						updateStats();
						paused = 1;
					}
					if(selling.length){
						for(i = 0; i < selling.length; i++){
							games[selling[i]].sellTime --;
							var soldCopies = (fans + 1) * chance.floating({min:0.95, max: 1.25}) * games[selling[i]].review;
							games[selling[i]].copies += Math.floor(soldCopies);
							money += games[selling[i]].price * soldCopies;

							console.log(games[selling[i]].review);
							if(games[selling[i]].review >= 5){
								fans += Math.floor(fans/12 + soldCopies/1000);
								$(".fans").text(fans + " fans");
							}
							if (games[selling[i]].review < 5){
								fans += Math.floor(soldCopies / 2000);//TODO: these should be proportional with the history of games
								$(".fans").text(fans + " fans");
							}
							
							$(".currentSaleCopies").text(games[selling[i]].copies + " copies sold").digits();
							updateHeader();
							updateStats();
							if(games[selling[i]].sellTime <= 0) {
								selling.splice(i, 1);
								$(".currentSaleCopies").empty();
								$(".currentSaleTitle").empty();
							}
						}
					}
					if(d > 30){
						m++;
						d = 1;
						var totalSalary = 0;
						for(i = 0; i < workers.length; i++){
							totalSalary += workers[i].salary;
						}
						if(totalSalary){
							//$.playSound("../res/monthlypayment");
							$(".notif").text("-$" + totalSalary).fadeIn(0);
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
			}
		}, 250);
		
		$(".expandLeftMenu").click(function(){
			$(".leftWrap").toggleClass("expanded"); 
		});

		$(".main").click(function(){
			$(".window").fadeOut(0);
			$(".mainWindow").fadeIn(0);

			$(".currentWorkers").empty();

			for(i = 0; i < workers.length; i++){
                $(".currentWorkers").append('<div class="potentialWorker mainWorker"><i class="material-icons" id="fireWorker" data-id="'+ i +'" title="Fire">close</i><div class="potentialWorkerAvatar" style="background-color:' + workers[i].avatar + '"></div><div class="potentialWorkerName">'+ workers[i].firstName +' '+ workers[i].lastName +'</div><div class="potentialWorkerLevel">LEVEL ' + workers[i].level +'</div><div class="potentialWorkerInfo">' + workers[i].age + ' ('+ workers[i].gender +')<br>Coding: '+ workers[i].codePoints +'<br>Art: '+ workers[i].artPoints +'<br>Audio: '+ workers[i].audioPoints +'<br>Salary: $'+ workers[i].salary +'<br><button class="inspectPc" data-workerpcid="'+ i +'">Inspect PC</button></div><div class="newPoints"><div class="newCode" data-id="'+ i +'"></div><div class="newArt" data-id="'+ i +'"></div><div class="newAudio" data-id="'+ i +'"></div></div></div>');
			}
		});

		$(document).on("click", ".inspectPc", function(){
			$(".inspectPcWindow").fadeIn(0);

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
			$(".newGameWindow").fadeIn(0);

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
			resetContrib();
			var newGameEngine = 0; //TEMP
			inDevGame = {
				name: document.getElementById("newGameName").value,
				size: $(".newGameSize").attr("data-size"),
				price: $(".newGamePrice").attr("data-price"),
				genre: $(".newGameGenreList option:selected").val(),
				topic: $(".newGameTopicsList option:selected").val(),
				progress: 0,
				engine: newGameEngine,
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

		$(document).on("click", ".priceOption", function(){
			document.getElementById("newGamePrice").setAttribute("data-price", $(this).attr("data-price"));
			$(".priceOption").removeClass("selectedPrice");
			$(this).addClass("selectedPrice");
		});

		$(".sizeOption").click(function(){
			document.getElementById("newGameSize").setAttribute("data-size", $(this).attr("data-size"));
			$(".sizeOption").removeClass("selectedSize");
			$(this).addClass("selectedSize");
			$(".priceOption").remove();
			switch($(this).attr("data-size").toString()){
				case "0":
					$(".newGamePrice").append("<div class='priceOption' data-price='1'> $0.99 </div><div class='priceOption' data-price='5'> $4.99 </div><div class='priceOption' data-price='10'> $9.99 </div>");
					break;
				case "1":
					$(".newGamePrice").append("<div class='priceOption' data-price='15'> $14.99 </div><div class='priceOption' data-price='20'> $19.99 </div><div class='priceOption' data-price='30'> $29.99 </div>");
					break;
				case "2":
					$(".newGamePrice").append("<div class='priceOption' data-price='40'> $39.99 </div><div class='priceOption' data-price='50'> $49.99 </div><div class='priceOption' data-price='60'> $59.99 </div>");
			}
		});

		$(".closeFinishedGame").click(function(){
			$(".finishedGameWrap").fadeOut(100);
			paused = 0;
		});

		$(".research").click(function(){
			$(".window").fadeOut(0);
			$(".researchWindow").fadeIn(0);

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
				$(".newEngine" + xz[0].domain).append("<option selected='selected' value='" + features[i] + "'>" + xz[0].name + "</option><br>");
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
					newEngine.graphicsCost = xx[0].points;
					break;
				case "Code":
					newEngCode = zz;
					newEngine.codeCost = xx[0].points;
					break;
				case "Art":
					newEngArt = zz;
					newEngine.artCost = xx[0].points;
					break;
				case "Audio":
					newEngAudio = zz;
					newEngine.audioCost = xx[0].points;
					break;
				default:
					console.log("unhandled domain case");
					break;
			}
			features.sort(function(a, b){return a-b});
			$(this).remove();
			updateEngineCost();
			$(".research").trigger("click");
		});

		$(".newEngineGraphics").change(function(){                  //TODO: those 4 events should be only 1 
			newEngGraph = parseInt($(this).val());
			var xx = featuresDb({id: newEngGraph}).get();
			newEngine.graphicsCost = xx[0].points;
			updateEngineCost();
			$(".newEngineGraphicsDetails").text(" (Cost: " + xx[0].points + "RP)");
		});

		$(".newEngineCode").change(function(){
			newEngCode = parseInt($(this).val());
			var xx = featuresDb({id: newEngCode}).get();
			newEngine.codeCost = xx[0].points;
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
			$(".upgradesWindow").fadeIn(0);

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
				$(".potentialWorkersList").append("<div class='potentialWorker'><div class='potentialWorkerAvatar' style='background-color:" + potentialWorkers[i].avatar + "'></div><div class='potentialWorkerInfo'><b>" + potentialWorkers[i].firstName + " " + potentialWorkers[i].lastName + "</b><br>" + potentialWorkers[i].age + " (" + potentialWorkers[i].gender + ")" + "<br>Coding: " + potentialWorkers[i].codePoints + "<br>Art: " + potentialWorkers[i].artPoints + "<br>Audio: " + potentialWorkers[i].audioPoints + "<br>Salary: $" + potentialWorkers[i].salary + "<br><button class='recruitButton' data-recruitId='" + i + "'>Recruit</button></div></div>");
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
			$(".shopWindow").fadeIn(0);
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
			$(".statsWindow").fadeIn(0);
			$(".list").empty();

			$(".statsGameCount").text(games.length);      

			for(i = 0; i < games.length; i++){
				$(".gameHistory").append("<div class='releasedGameWrap'><div class='releasedGame'><div class='releasedGameName'>" + games[i].name + "</div><div class='releasedGameGenresTopics'>" + genres[games[i].genre].name + " | " + topics[games[i].topic].name + "</div><div class='releasedGameDate'>" + games[i].releaseDate[2] + "/" + games[i].releaseDate[1] + "/" + games[i].releaseDate[0] + "<br>" + games[i].copies + " copies sold</div></div></div>");
			} 
		});
        
	});

})(window, window.jQuery);