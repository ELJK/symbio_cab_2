/*
jQuery.ganttView v.0.8.8
Copyright (c) 2010 JC Grubbs - jc.grubbs@devmynd.com
MIT License Applies
*/

/*
Options
-----------------
showWeekends: boolean
data: object
cellWidth: number
cellHeight: number
slideWidth: number
dataUrl: string
behavior: {
	clickable: boolean,
	draggable: boolean,
	resizable: boolean,
	onClick: function,
	onDrag: function,
	onResize: function
}
*/

(function (jQuery) {
	
    jQuery.fn.ganttView = function () {
    	
    	var args = Array.prototype.slice.call(arguments);
    	
    	if (args.length == 1 && typeof(args[0]) == "object") {
        	build.call(this, args[0]);
    	}
    	
    	if (args.length == 2 && typeof(args[0]) == "string") {
    		handleMethod.call(this, args[0], args[1]);
    	}
    };
    
    function build(options) {
    	
    	var els = this;
        var defaults = {
            showWeekends: true,
            /*cellWidth: 101,*/
            cellHeight: 31,
            slideWidth: 400,
            vHeaderWidth: 190,
            /*behavior: {
            	clickable: true,
            	draggable: true,
            	resizable: true
            }*/
        };
        
        var opts = jQuery.extend(true, defaults, options);

		if (opts.data) {
			build();
		} else if (opts.dataUrl) {
			jQuery.getJSON(opts.dataUrl, function (data) { opts.data = data; build(); });
		}

		function build() {


			
			var minDays = Math.floor((opts.slideWidth / opts.cellWidth)  + 5);
			var startEnd = DateUtils.getBoundaryDatesFromData(opts.data, minDays);
			opts.start = startEnd[0];
			opts.end = startEnd[1];
            //opts.cellWidth = Math.floor((opts.totalWidth+2)/((startEnd[1] - startEnd[0])/1000/3600/24/7)-2);
            /*$("div").html(opts.slideWidth + " " + (startEnd[1] - startEnd[0])/1000/3600/24/7 + " " + opts.cellWidth);*/
            opts.cellWidth = 30;
			opts.slideWidth = opts.totalWidth - opts.vHeaderWidth-20;
	        els.each(function () {

	            var container = jQuery(this);
	            var div = jQuery("<div>", { "class": "ganttview" });
	            new Chart(div, opts).render();

				container.append(div);
				
				var w = jQuery("div.ganttview-vtheader", container).outerWidth() +
					jQuery("div.ganttview-slide-container", container).outerWidth();
	            container.css("width", (w + 2) + "px");
	            
	            /* new Behavior(container, opts).apply(); */
                showToday(opts.start, opts.end);

                container.find(".ganttview-hzheader-day").popover({trigger: 'hover'});
                container.find(".ganttview-hzheader-day-weekend").popover({trigger: 'hover'});

                /*$("#d" + dates[y][m][d].getDate() + "m" + dates[y][m][d].getMonth() + "y" + dates[y][m][d].getFullYear()).popover({
                    title: 'A title!',
                    content: 'Some content!'
                })*/


                var todayElement = div.find(".ganttview-day-today").last();
                var currentContainer = div.find(".ganttview-slide-container");
                todayElement.addClass("ganttview-day-today-bottom");
                currentContainer.on('click',function() {
                currentContainer.animate({scrollLeft: todayElement.position().left-$(this).width()/4}, 'slow');
                });
	        });
		}
    }

	function handleMethod(method, value) {
		
		if (method == "setSlideWidth") {
			var div = $("div.ganttview", this);
			div.each(function () {
				var vtWidth = $("div.ganttview-vtheader", div).outerWidth();
				$(div).width(vtWidth + value + 1);
				$("div.ganttview-slide-container", this).width(value);
			});
		}

	}

    function showToday(start, end) {
        var today = new Date();
        if (today < end && today > start) {
            $("div[id='d"+ today.getDate()+"m"+ today.getMonth() +"y"+ today.getFullYear()+"']").addClass("ganttview-day-today");

        }
    }


    var Chart = function(div, opts) {




		function render() {
			addVtHeader(div, opts.data, opts.cellHeight);

            var slideDiv = jQuery("<div>", {
                "class": "ganttview-slide-container",
                "css": { "width": opts.slideWidth + "px" }
            });

            dates = getDates(opts.start, opts.end);
            //console.log(opts.phdata);
            //tdata = treatmentRegimeData(opts.phdata, opts.tprog);
            //console.log(tdata);
            addHzHeader(slideDiv, dates, opts.cellWidth);
            addGrid(slideDiv, opts.data, dates, opts.cellWidth, opts.showWeekends,"grid-primary");
            addBlockContainers(slideDiv, opts.data);
            addBlocks(slideDiv, opts.data, opts.cellWidth, opts.start);
            addInvGrid(slideDiv, opts.data, dates, opts.cellWidth,"grid-invisible");

            div.append(slideDiv);
            applyLastClass(div.parent());
            /*addInvGrid(slideDiv, opts.data, dates, opts.cellWidth, opts.showWeekends);*/


		}
		
		var monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

		// Creates a 3 dimensional array [year][month][day] of every day 
		// between the given start and end dates
        function getDates(start, end) {
            var dates = [];
			dates[start.getFullYear()] = [];
			dates[start.getFullYear()][start.getMonth()] = [start]
			var last = start;
			while (last.compareTo(end) == -1) {
				var next = last.clone().addDays(1);
				if (!dates[next.getFullYear()]) { dates[next.getFullYear()] = []; }
				if (!dates[next.getFullYear()][next.getMonth()]) { 
					dates[next.getFullYear()][next.getMonth()] = []; 
				}
				dates[next.getFullYear()][next.getMonth()].push(next);
				last = next;
			}
            dates[next.getFullYear()][next.getMonth()].push(last.clone().addDays(1));
            dates[next.getFullYear()][next.getMonth()].push(last.clone().addDays(2));
            dates[next.getFullYear()][next.getMonth()].push(last.clone().addDays(3));
            dates[next.getFullYear()][next.getMonth()].push(last.clone().addDays(4));
            dates[next.getFullYear()][next.getMonth()].push(last.clone().addDays(5));
			return dates;
        }

        function addVtHeader(div, data, cellHeight) {
            var headerDiv = jQuery("<div>", {
                                              "class": "ganttview-vtheader",
                                              "css": {"width": opts.vHeaderWidth + "px" }
                                            });
            for (var i = 0; i < data.length; i++) {

                if (i == 0) {
                    var status = "success";
                } else if (i == 1) {
                    var status = "danger";
                } else if (i == 2) {
                    var status = "primary";
                } else if (i == 3) {
                    var status = "info";
                } else {

                }

                var itemDiv = jQuery("<div>", { "class": "ganttview-vtheader-item",
                                                "width": "100%" });
                itemDiv.append(jQuery("<div>", {
                    "class": "ganttview-vtheader-item-name center",
                    "css": { "width": "70%",
                             "padding-top": cellHeight/2,

                            }
                //}).append(data[i].name));

                  }).append($('<span class="label label-'+ status +'">'+ data[i].series[0].name + '</span>')));
                //}).append($('<img src="/assets/'+ data[i].name +'" width="100%">')));
                var seriesDiv = jQuery("<div>", { "class": "ganttview-vtheader-series",
                                                  "width": "30%" });
                for (var j = 0; j < data[i].series.length; j++) {
                    seriesDiv.append(jQuery("<div>", { "class": "ganttview-vtheader-series-name",
                                                      "width": "100%" })
						//.append($('<p class="text-primary">'+ data[i].series[j].name + '</p>')));
                        .append($('<img src="/assets/'+ data[i].name +'" style="height: 100%">')));

                }
                itemDiv.append(seriesDiv);

                headerDiv.append(itemDiv);
            }
            div.append(headerDiv);
        }
        /*
        function addBlocks(div, data, cellWidth, start) {
            var rows = jQuery("div.ganttview-blocks div.ganttview-block-container", div);
            var rowIdx = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    var series = data[i].series[j];
                    var size = DateUtils.daysBetween(series.start, series.end) + 1;
                    var offset = DateUtils.daysBetween(start, series.start);
                    var block = jQuery("<div>", {
                        "class": "ganttview-block",
                        //"title": series.name + ", " + size + " days",
                        "css": {
                            "width": ((size * cellWidth) - 3) + "px",
                            "margin-left": ((offset * cellWidth) + 1) + "px"
                        }
                    });
                    addBlockData(block, data[i], series);
                    if (data[i].series[j].color) {
                        block.css("background-color", data[i].series[j].color);
                    }
                    block.append(jQuery("<div>", { "class": "ganttview-block-text" }).text(size));
                    jQuery(rows[rowIdx]).append(block);
                    rowIdx = rowIdx + 1;
                }
            }
        }
        */
        /*function treatmentRegimeData(boundaries, tprog) {
            var totd = DateUtils.daysBetween(boundaries[0], boundaries[5]);
            console.log(totd)
            var totdDateInfo = [];
            var doseDateInfo = [];

            for (var i= 0; i < totd; i++ ) {
                totdDateInfo.push({n:i+1, d:boundaries[0].addDays(i)});
                //console.log(totdDateInfo[i].d)
                //console.log(i)
                if (totdDateInfo[i].d > boundaries[0] && totdDateInfo[i].d < boundaries[1]) {
                    console.log(totdDateInfo[i].d)
                    if (tprog == "Стандарт - Взрослые") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 5 ,s1: 0 ,s2: 0 ,ss: 1 });
                    } else if (tprog == "Стандарт - Дети") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0,s1: 0 ,s2: 0 ,ss: 0 });
                    } else if (tprog == "Аллергия - Взрослые") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 5 ,s1: 0 ,s2: 0 ,ss: 1 });
                    } else if (tprog == "Аллергия - Дети") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 5 ,s1: 0 ,s2: 0 ,ss: 1 });
                    } else {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps:0 ,s1: 0 ,s2:0 ,ss:0 });
                    }

                }

                else if (totdDateInfo[i].d > boundaries[2] && totdDateInfo[i].d < boundaries[3] ) {

                    if (tprog == "Стандарт - Взрослые") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0 ,s1: 30 ,s2: 0 ,ss: 1 });
                    } else if (tprog == "Стандарт - Дети") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0,s1: 20 ,s2: 0 ,ss: 1 });
                    } else if (tprog == "Аллергия - Взрослые") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 20 ,s1: 20 ,s2: 0 ,ss: 1 });
                    } else if (tprog == "Аллергия - Дети") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 10 ,s1: 20 ,s2: 0 ,ss: 1 });
                    } else {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps:0 ,s1: 0 ,s2:0 ,ss:0 });
                    }

                }

                else if (totdDateInfo[i].d > boundaries[4] && totdDateInfo[i].d < boundaries[5]) {

                    if (tprog == "Стандарт - Взрослые") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0 ,s1: 30 ,s2: 5 ,ss: 1 });
                    } else if (tprog == "Стандарт - Дети") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0,s1: 20 ,s2: 10 ,ss: 1 });
                    } else if (tprog == "Аллергия - Взрослые") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0 ,s1: 20 ,s2: 5 ,ss: 1 });
                    } else if (tprog == "Аллергия - Дети") {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps: 0 ,s1: 20 ,s2: 10 ,ss: 1 });
                    } else {
                        doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps:0 ,s1: 0 ,s2:0 ,ss:0 });
                    }

                }

                else {

                    doseDateInfo.push({d:totdDateInfo[i].d ,n:totdDateInfo[i].n ,ps:0 ,s1: 0 ,s2:0 ,ss:0 });

                }



            }
            return doseDateInfo;
        }*/

        function addHzHeader(div, dates, cellWidth) {
            var headerDiv = jQuery("<div>", { "class": "ganttview-hzheader" });
            var monthsDiv = jQuery("<div>", { "class": "ganttview-hzheader-months" });
            var daysDiv = jQuery("<div>", { "class": "ganttview-hzheader-days" });
            var totalW = 0;
            var dayCounter = 1;
			for (var y in dates) {
				for (var m in dates[y]) {
					var w = dates[y][m].length * cellWidth;
					totalW = totalW + w;
					monthsDiv.append(jQuery("<div>", {
						"class": "ganttview-hzheader-month",
						"css": { "width": (w - 1) + "px" }
					}).append("<h5>" + monthNames[m] + " " + y + "</h5>"));
					for (var d in dates[y][m]) {
                        if (DateUtils.isWeekend(dates[y][m][d])) {
                            daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day-weekend",
                                                             "id":  "d" + dates[y][m][d].getDate() + "m" + dates[y][m][d].getMonth() + "y" + dates[y][m][d].getFullYear(),
                                                             "css": { "width": (cellWidth - 1) + "px"},
                                                             "data-title": "День "+dayCounter+":",
                                                             "data-content": "test"})

                                .append(dates[y][m][d].getDate()));

                        } else {
                            daysDiv.append(jQuery("<div>", { "class": "ganttview-hzheader-day",
                                                             "id": "d" + dates[y][m][d].getDate() + "m" + dates[y][m][d].getMonth() + "y" + dates[y][m][d].getFullYear(),
                                                             "css": { "width": (cellWidth - 1) + "px"},
                                                             "data-title": "День "+dayCounter+":",
                                                             "data-content": "test"})

                                .append(dates[y][m][d].getDate()));
                            dayCounter++;
                        }

					}
				}
			}
            monthsDiv.css("width", totalW + "px");
            daysDiv.css("width", totalW + "px");
            headerDiv.append(monthsDiv).append(daysDiv);
            div.append(headerDiv);
        }

        function addGrid(div, data, dates, cellWidth, showWeekends,gridid) {
            var gridDiv = jQuery("<div>", { "class": "ganttview-grid",
                                             "id":gridid});
            var rowDiv = jQuery("<div>", { "class": "ganttview-grid-row" });
			for (var y in dates) {
				for (var m in dates[y]) {
					for (var d in dates[y][m]) {
						var cellDiv = jQuery("<div>", { "class": "ganttview-grid-row-cell"
                                                       //"id": "d" + dates[y][m][d].getDate() + "m" + dates[y][m][d].getMonth() + "y" + dates[y][m][d].getFullYear()
                                                      });
                        cellDiv.css("width", cellWidth-1+"px");
						if (DateUtils.isWeekend(dates[y][m][d]) && showWeekends) {
							cellDiv.addClass("ganttview-weekend"); 
						}
						rowDiv.append(cellDiv);
					}
				}
			}
            var w = jQuery("div.ganttview-grid-row-cell", rowDiv).length * cellWidth;
            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    gridDiv.append(rowDiv.clone());
                }
            }
            div.append(gridDiv);
        }

        function addInvGrid(div, data, dates, cellWidth, gridid) {
            var gridDiv = jQuery("<div>", { "class": "ganttview-inv-grid",
                "id":gridid});
            var rowDiv = jQuery("<div>", { "class": "ganttview-inv-grid-row" });
            for (var y in dates) {
                for (var m in dates[y]) {
                    for (var d in dates[y][m]) {
                        var cellDiv = jQuery("<div>", { "class": "ganttview-inv-grid-row-cell",
                            "id": "d" + dates[y][m][d].getDate() + "m" + dates[y][m][d].getMonth() + "y" + dates[y][m][d].getFullYear()});
                        cellDiv.css("width", cellWidth-5+"px");
                        rowDiv.append(cellDiv);
                    }
                }
            }
            var w = jQuery("div.ganttview-inv-grid-row-cell", rowDiv).length * cellWidth;
            rowDiv.css("width", w + "px");
            gridDiv.css("width", w + "px");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    gridDiv.append(rowDiv.clone());
                }
            }
            div.append(gridDiv);
        }

        function addBlockContainers(div, data) {
            var blocksDiv = jQuery("<div>", { "class": "ganttview-blocks" });
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    blocksDiv.append(jQuery("<div>", { "class": "ganttview-block-container" }));
                }
            }
            div.append(blocksDiv);
        }

        function addBlocks(div, data, cellWidth, start) {
            var rows = jQuery("div.ganttview-blocks div.ganttview-block-container", div);
            var rowIdx = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].series.length; j++) {
                    var series = data[i].series[j];
                    var size = DateUtils.daysBetween(series.start, series.end) + 1;
					var offset = DateUtils.daysBetween(start, series.start);
					var block = jQuery("<div>", {
                        "class": "ganttview-block",
                        //"title": series.name + ", " + size + " days",
                        "css": {
                            "width": ((size * cellWidth) - 3) + "px",
                            "margin-left": ((offset * cellWidth) + 1) + "px"
                        }
                    });
                    addBlockData(block, data[i], series);
                    if (data[i].series[j].color) {
                        block.css("background-color", data[i].series[j].color);
                    }
                    block.append(jQuery("<div>", { "class": "ganttview-block-text" }).text(size));
                    jQuery(rows[rowIdx]).append(block);
                    rowIdx = rowIdx + 1;
                }
            }
        }
        
        function addBlockData(block, data, series) {
        	// This allows custom attributes to be added to the series data objects
        	// and makes them available to the 'data' argument of click, resize, and drag handlers
        	var blockData = { id: data.id, name: data.name };
        	jQuery.extend(blockData, series);
        	block.data("block-data", blockData);
        }

        function applyLastClass(div) {
            jQuery("div.ganttview-grid-row div.ganttview-grid-row-cell:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-days div.ganttview-hzheader-day:last-child", div).addClass("last");
            jQuery("div.ganttview-hzheader-months div.ganttview-hzheader-month:last-child", div).addClass("last");
        }



		return {
			render: render
		};



	}
    /*
	var Behavior = function (div, opts) {
		
		function apply() {
			
			if (opts.behavior.clickable) { 
            	bindBlockClick(div, opts.behavior.onClick); 
        	}
        	
            if (opts.behavior.resizable) { 
            	bindBlockResize(div, opts.cellWidth, opts.start, opts.behavior.onResize); 
        	}
            
            if (opts.behavior.draggable) { 
            	bindBlockDrag(div, opts.cellWidth, opts.start, opts.behavior.onDrag); 
        	}
		}

        function bindBlockClick(div, callback) {
            jQuery("div.ganttview-block", div).on("click", function () {
                if (callback) { callback(jQuery(this).data("block-data")); }
            });
        }
        
        function bindBlockResize(div, cellWidth, startDate, callback) {
        	jQuery("div.ganttview-block", div).resizable({
        		grid: cellWidth, 
        		handles: "e,w",
        		stop: function () {
        			var block = jQuery(this);
        			updateDataAndPosition(div, block, cellWidth, startDate);
        			if (callback) { callback(block.data("block-data")); }
        		}
        	});
        }
        
        function bindBlockDrag(div, cellWidth, startDate, callback) {
        	jQuery("div.ganttview-block", div).draggable({
        		axis: "x", 
        		grid: [cellWidth, cellWidth],
        		stop: function () {
        			var block = jQuery(this);
        			updateDataAndPosition(div, block, cellWidth, startDate);
        			if (callback) { callback(block.data("block-data")); }
        		}
        	});
        }
        
        function updateDataAndPosition(div, block, cellWidth, startDate) {
        	var container = jQuery("div.ganttview-slide-container", div);
        	var scroll = container.scrollLeft();
			var offset = block.offset().left - container.offset().left - 1 + scroll;
			
			// Set new start date
			var daysFromStart = Math.round(offset / cellWidth);
			var newStart = startDate.clone().addDays(daysFromStart);
			block.data("block-data").start = newStart;

			// Set new end date
        	var width = block.outerWidth();
			var numberOfDays = Math.round(width / cellWidth) - 1;
			block.data("block-data").end = newStart.clone().addDays(numberOfDays);
			jQuery("div.ganttview-block-text", block).text(numberOfDays + 1);
			
			// Remove top and left properties to avoid incorrect block positioning,
        	// set position to relative to keep blocks relative to scrollbar when scrolling
			block.css("top", "").css("left", "")
				.css("position", "relative").css("margin-left", offset + "px");
        }
        
        return {
        	apply: apply	
        };
	}
    /*

     */
    var ArrayUtils = {
	
        contains: function (arr, obj) {
            var has = false;
            for (var i = 0; i < arr.length; i++) { if (arr[i] == obj) { has = true; } }
            return has;
        }
    };

    var DateUtils = {
    	
        daysBetween: function (start, end) {
            if (!start || !end) { return 0; }
            start = Date.parse(start); end = Date.parse(end);
            if (start.getYear() == 1901 || end.getYear() == 8099) { return 0; }
            var count = 0, date = start.clone();
            while (date.compareTo(end) == -1) { count = count + 1; date.addDays(1); }
            return count;
        },
        
        isWeekend: function (date) {
            return date.getDay() % 6 == 0;
        },

		getBoundaryDatesFromData: function (data, minDays) {
			var minStart = new Date(); maxEnd = new Date();
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].series.length; j++) {
					var start = Date.parse(data[i].series[j].start);
					var end = Date.parse(data[i].series[j].end)
					if (i == 0 && j == 0) { minStart = start; maxEnd = end; }
					if (minStart.compareTo(start) == 1) { minStart = start; }
					if (maxEnd.compareTo(end) == -1) { maxEnd = end; }
				}
			}
			
			// Insure that the width of the chart is at least the slide width to avoid empty
			// whitespace to the right of the grid
			if (DateUtils.daysBetween(minStart, maxEnd) < minDays) {
				maxEnd = minStart.clone().addWeeks(minDays);
			}
			
			return [minStart, maxEnd];
		}
    };

})(jQuery);


// Build Gantt chart in the DOM

function ganttCreate(tprog,tph0_s,tph0_e,tph1_s,tph1_e,tph2_s,tph2_e,countid,width) {

    if (tprog == "Стандарт - Взрослые" ) {
        var tps_s = tph0_s;
        var tps_e = tph0_e;
        var ts1_s = tph1_s;
        var ts1_e = tph2_e;
        var ts2_s = tph2_s;
        var ts2_e = tph2_e;
        var tss_s = tph0_s;
        var tss_e = tph2_e;
    }
    else if (tprog == "Стандарт - Дети") {
        var tps_s = tph0_s;
        var tps_e = tph0_e;
        var ts1_s = tph1_s;
        var ts1_e = tph2_e;
        var ts2_s = tph2_s;
        var ts2_e = tph2_e;
        var tss_s = tph1_s;
        var tss_e = tph2_e;

    }
    else if (tprog == "Аллергия - Взрослые") {
        var tps_s = tph0_s;
        var tps_e = tph1_e;
        var ts1_s = tph1_s;
        var ts1_e = tph2_e;
        var ts2_s = tph2_s;
        var ts2_e = tph2_e;
        var tss_s = tph0_s;
        var tss_e = tph2_e;

    }
    else if (tprog == "Аллергия - Дети") {
        var tps_s = tph0_s;
        var tps_e = tph1_e;
        var ts1_s = tph1_s;
        var ts1_e = tph2_e;
        var ts2_s = tph2_s;
        var ts2_e = tph2_e;
        var tss_s = tph0_s;
        var tss_e = tph2_e;
    }
    else {

    }

    /*var phaseBoundaries = new Array();
    phaseBoundaries[0] = new Date(tph0_s);
    phaseBoundaries[1] = new Date(tph0_e);
    phaseBoundaries[2] = new Date(tph1_s);
    phaseBoundaries[3] = new Date(tph1_e);
    phaseBoundaries[4] = new Date(tph2_s);
    phaseBoundaries[5] = new Date(tph2_e);*/


    var ganttData = [
        {
            id: 1, name: "sps_icon.png", series: [
            { name: "ПРО-СИМБИОФЛОР", start: new Date(tps_s), end: new Date(tps_e), color: "#3FB618" }
        ]
        },
        {
            id: 2, name: "ss1_icon.png", series: [
            { name: "СИМБИОФЛОР 1", start: new Date(ts1_s), end: new Date(ts1_e), color: "#FF0039" }
        ]
        },
        {
            id: 3, name: "ss2_icon.png", series: [
            { name: "СИМБИОФЛОР 2", start: new Date(ts2_s), end: new Date(ts2_e), color: "#0066CC" }
        ]
        },
        {
            id: 4, name: "ssan_icon.png", series: [
            { name: "СИМБИОСАН", start: new Date(tss_s), end: new Date(tss_e), color: "#9954BB" }
        ]
        }

    ];

    //$(function () {

    $("#ganttChart-" + countid).ganttView({
        data: ganttData,
        //phdata: phaseBoundaries,
        //tprog: tprog,
        totalWidth: width,
        behavior: {
            onClick: function (data) {
                var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                $("#eventMessage").text(msg);
            },
            onResize: function (data) {
                var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                $("#eventMessage").text(msg);
            },
            onDrag: function (data) {
                var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
                $("#eventMessage").text(msg);
            }
        }
    });

    // $("#ganttChart").ganttView("setSlideWidth", 600);
    //});

};