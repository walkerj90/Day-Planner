//variables for the rest of the script
var hourlyArray;
var currentTime = moment();
var currentHour;
var textBlock = $(".col-8");
var plannerTask = $("textarea");
$.each(plannerTask, function () {
    this.value = "";
});

if (localStorage.getItem("localHourlyTasks")) {
    hourlyArray = JSON.parse(localStorage.getItem("localHourlyTasks"));
} else {
    hourlyArray = [];
};

// Write current date by "DayofWeek, Month DayofMonth"
$("#currentDay").text(`${currentTime.format('dddd, MMMM Do')}`);

function updateCurrentScheduleTime() {
    textBlock.removeClass('past present future');
    $.each(textBlock, function (scheduleBlockHour) {
        if (scheduleBlockHour < (currentTime.hour() - 9)) {
            $(this).addClass('past');
        } else if (scheduleBlockHour == (currentTime.hour() - 9)) {
            $(this).addClass('present');
        } else {
            $(this).addClass('future');
        }
    });
    currentHour = currentTime.hour();
};

function updateLocalStorage() {
    event.preventDefault();
    let btnIndex = Number($(this).attr('id'));
    $('.alert-success').removeClass('alert-animation');

    if (plannerTask[btnIndex].value.trim() != "") {
        hourlyArray[btnIndex] = {
            time: $(".hour")[btnIndex].textContent.trim(),
            task: plannerTask[btnIndex].value
        };

        localStorage.setItem("localHourlyTasks", JSON.stringify(hourlyArray));
        setTimeout(function () {
            $('.alert-success').addClass('alert-animation');
            $('.alert-success').text(`Successfully saved task at ${$(".hour")[btnIndex].textContent.trim()}!`);
        }, 100);
    };
};

// Write saved tasks to the planner
function writeCurrentTasks() {
    $.each(hourlyArray, function (i) {
        if (hourlyArray[i]) {
            plannerTask[i].value = hourlyArray[i].task;
        };
    });
};

// Updates the current time every minute and planner
setInterval(function () {
    currentTime = moment();
    if (currentHour < currentTime.hour()) {
        updateCurrentScheduleTime();
    } else if (currentHour > currentTime.hour()) {
        updateCurrentScheduleTime();
        $("#currentDay").text(`${currentTime.format('dddd, MMMM Do')}`);
    }
}, 1000);

updateCurrentScheduleTime();
writeCurrentTasks();
$("button").click(updateLocalStorage);