$(function(){
    var sumsArray = [];
    var numbersArray = [-3,-2,-1,1,2,3];
    var levelStep = 1500;
    var score = 0;
    var currentAnswer;
    const timeInSeconds = 3;
    var startTime;
    var questionTimer;
    var timerInterval;

    $('#playButton').click(function(){
        var gameScreen = $('.game-screen');
        gameScreen.animate({ width: 'toggle'}, 'fast');
        gameScreen.css('display', 'flex');
        $('.splash-screen').animate({ width: 'toggle'}, {
            duration: 500,
            complete: function() {
                loadQuestionPage();
            }
        });
    });

    function startTimer(element, timeInSec) {
        var secondElement = $(element).find('.sec');
        var msElement = $(element).find('.ms');
        startTime = new Date().getTime();
        timerInterval = setInterval(function() {
            var timeSpent = new Date().getTime() - startTime;
            if (timeSpent < timeInSec * 1000) {
                var timeLeft = timeInSec * 1000 - timeSpent;
                secondElement.html(Math.floor(timeLeft / 1000));
                msElement.html(timeLeft % 1000);
            } else {
                secondElement.html(0);
                msElement.html(0);
                clearInterval(timerInterval);
            }
        }, 1);
    }

    function buildThrees(initialNummber,currentIndex,limit,currentString){
        for(var i=0;i<numbersArray.length;i++){
            var sum = initialNummber+numbersArray[i];
            var outputString = currentString+(numbersArray[i]<0?"":"+")+numbersArray[i];
            if(sum>0 && sum<4 && currentIndex==limit){
                sumsArray[limit][sum-1].push(outputString);
            }
            if(currentIndex<limit){
                buildThrees(sum,currentIndex+1,limit,outputString);
            }
        }
    }

    function init() {
        for(var i=1;i<5;i++){
            sumsArray[i]=[[],[],[]];
            for(var j=1;j<=3;j++){
                buildThrees(j,1,i,j);
            }
        }
    }

    function refreshQuestion() {
        var level = Math.round(score/ levelStep) + 1;
        var answerIndex = Math.floor(Math.random(0, 3)* 3);
        var totalQuestions =  sumsArray[level][answerIndex].length;
        var questionIndex = Math.floor(Math.random(0, totalQuestions) * totalQuestions);
        var questionText = sumsArray[level][answerIndex][questionIndex] + ' = ?';
        currentAnswer = answerIndex + 1;
        $('.question').html(questionText);
    }

    function loadQuestionPage() {
        var gameScreen = $('.game-screen');
        gameScreen.css('display', 'flex');
        setupQuestion();
    }

    function setupQuestion() {
        startTimer($('#gameTimer'), timeInSeconds);
        refreshQuestion();
        animateButtons($('.progress-animated'));
        setupAnswerTimeout(timeInSeconds);
    }

    function animateButtons($buttons){
        $buttons.each(function(){
            var element = this;
            var newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
        addAnswerButtonsClickListeners();
    }

    function addAnswerButtonsClickListeners() {
        $('.progress-animated').click(function(){
            var $selected = $(this);
            var selectedAnswer = $selected.attr('data-value');
            if (selectedAnswer == currentAnswer) {
                score += Math.round(Math.max(0, (timeInSeconds * 1000 - (new Date().getTime() - startTime)) / 10));
                setupQuestion();
            } else {
                loadErrorScreen();
                $selected.addClass('wrong-answer');
                clearInterval(timerInterval);
            }
        });
    }

    function loadGameOverScreen() {
        // $('.game-over-screen').animate({ width: 'toggle'}, 'fast');
        // $('.game-over-screen').css('display', 'flex');
        // $('.game-screen').css('display', 'none');
        // var $gameScreen =$('.game-screen');
        // $('.game-screen').animate({ width: 'toggle'},
        //     {
        //     duration: 1000,
        //     complete: function() {
        //         loadGameOverScreenContent();
        //     }
        // });
    }

    function loadGameOverScreenContent() {
        $('.game-over-screen').css('display', 'flex');
    }

    function loadErrorScreen() {
        $('.answer-buttons .btn').prop('disabled', true);
        $('.answer-buttons .btn[data-value="' + currentAnswer + '"]').addClass('correct-answer');
        $('.game-screen').addClass('failed');
        setTimeout(loadGameOverScreen, 1000);
    }

    function setupAnswerTimeout(timeInSeconds) {
        if (questionTimer) {
            clearTimeout(questionTimer);
        }
        questionTimer = setTimeout(function() {
            loadErrorScreen();
        }, timeInSeconds * 1000);
    }

    init();
});