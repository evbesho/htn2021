(function() {
  var questions = [{
    question: "Canada’s anti-hate speech laws infringe on free speech rights.",
    choices: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  }, {
    question: "There should be more federal regulations over what Canadians can say online.",
    choices: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  }, {
    question: "The federal government should be providing more financial relief to Canadians who lost their jobs during the pandemic.",
    choices: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  }, {
    question: "The government should provide Universal Basic Income to all Canadians.",
    choices: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  }, {
    question: "There should not be any new oil pipelines developed in Canada.",
    choices: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  }];
  
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object

  var lpc = [0,3,1,1,0];
  var cpc = [3,0,0,0,0];
  var ndp = [0,3,3,3,0];
  var gpc = [0,3,3,3,0];
  var bq = [0,2,1,3,0];
  
  // Display initial question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }

  function compareToParty(party) {
    var totalDistance = 0;
    for (var i = 0; i < selections.length; i++) {
      totalDistance += Math.abs(selections[i] - party[i])
    }
    return totalDistance;
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>',{id: 'question'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }

    var largestDistance = 0;
    for (var i = 0; i < selections.length; i++) {
      largestDistance += (Math.abs(selections[i] - 2) + 2);
    }

    var comparedLPC = (Math.round((1 - (compareToParty(lpc) / largestDistance)) * 100));
    var comparedCPC = (Math.round((1 - (compareToParty(cpc) / largestDistance)) * 100));
    var comparedNDP = (Math.round((1 - (compareToParty(ndp) / largestDistance)) * 100));
    var comparedGPC = (Math.round((1 - (compareToParty(gpc) / largestDistance)) * 100));
    var comparedBQ = (Math.round((1 - (compareToParty(bq) / largestDistance)) * 100));

    score.append('LPC: ' + comparedLPC + ' CPC: ' + comparedCPC + ' NDP: ' + comparedNDP + ' GPC: ' + comparedGPC + ' BQ: ' + comparedBQ);
    return score;
  }
})();