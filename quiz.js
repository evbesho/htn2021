(function() {

    var agreeance = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    
    var questions = [{
      question: "Canada’s anti-hate speech laws infringe on free speech rights.",
      choices: agreeance,
    }, {
      question: "There should be more federal regulations over what Canadians can say online.",
      choices: agreeance,
    }, {
      question: "The federal government should be providing more financial relief to Canadians who lost their jobs during the pandemic.",
      choices: agreeance,
    }, {
      question: "The government should provide Universal Basic Income to all Canadians.",
      choices: agreeance,
    }, {
      question: "There should not be any new oil pipelines developed in Canada.",
      choices: agreeance,
    }, {
      question: "Canada should do more to reduce its carbon footprint.",
      choices: agreeance,
    }, {
      question: "Canadians should pay for their greenhouse gas emissions (i.e Carbon Tax).",
      choices: agreeance,
    }, {
      question: "The federal government should make an effort to hire more visible minorities.",
      choices: agreeance,
    }, {
      question: "Universal affordable childcare should be made available to Canadian families.",
      choices: agreeance,
    }, {
      question: "Proof of COVID-19 vaccination should be required to go to restaurants, gyms, public events, etc.",
      choices: agreeance,
    }, {
      question: "Universal Pharmacare should be available to all Canadians.",
      choices: agreeance,
    }, {
      question: "Abortion services should be more accessible throughout Canada.",
      choices: agreeance,
    }, {
      question: "Private healthcare should have a bigger role in the Canadian healthcare system.",
      choices: agreeance,
    }, {
      question: "Canada should open its borders to more immigrants.",
      choices: agreeance,
    }, {
      question: "Indigenous languages should be recognized as official languages.",
      choices: agreeance,
    }, {
      question: "The possession of illicit drugs for personal use should be decriminalized.",
      choices: agreeance,
    }, {
      question: "Funding for police services in Canada should be decreased.",
      choices: agreeance,
    }, {
      question: "Quebec should become an independent country.",
      choices: agreeance,
    }, {
      question: "Large corporations should pay more in taxes.",
      choices: agreeance,
    }, {
      question: "Wealthier Canadians should pay more in taxes.",
      choices: agreeance,
    }];
    
    var questionsAnswered = 0; 
    var userAnswers = []; 
    var quiz = $('#quiz');
  
    
    // Party stances
    var lpc = [0,4,2,1,1,3,3,4,4,3,3,4,2,3,2,1,2,0,3,3];
    var cpc = [3,0,1,0,0,2,1,0,1,1,1,1,3,2,2,1,1,0,2,2];
    var ndp = [0,4,3,4,4,4,2,4,4,3,4,4,0,4,4,4,2,1,4,4];
    var gpc = [0,4,3,3,4,4,4,3,3,1,4,4,0,4,4,4,3,2,4,3];
    var bq =  [0,2,2,1,4,4,3,1,2,1,3,4,1,2,4,3,2,4,4,3];
    
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
      if (isNaN(userAnswers[questionsAnswered])) {
        alert('Please make a selection!');
      } else {
        questionsAnswered++;
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
      questionsAnswered--;
      displayNext();
    });
    
    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
      e.preventDefault();
      
      if(quiz.is(':animated')) {
        return false;
      }
      questionsAnswered = 0;
      userAnswers = [];
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
      userAnswers[questionsAnswered] = +$('input[name="answer"]:checked').val();
    }
    
    // Displays next requested element
    function displayNext() {
      quiz.fadeOut(function() {
        $('#question').remove();
        
        if(questionsAnswered < questions.length){
          var nextQuestion = createQuestionElement(questionsAnswered);
          quiz.append(nextQuestion).fadeIn();
          if (!(isNaN(userAnswers[questionsAnswered]))) {
            $('input[value='+userAnswers[questionsAnswered]+']').prop('checked', true);
          }
          
          // Controls display of 'prev' button
          if(questionsAnswered === 1){
            $('#prev').show();
          } else if(questionsAnswered === 0){
            
            $('#prev').hide();
            $('#return').hide();
            $('#start').hide();
            $('#next').show();
          }
        } else {
          var scoreElem = displayScore();
          quiz.append(scoreElem).fadeIn();
          $('#next').hide();
          $('#prev').hide();
          $('#start').show();
          $('#return').show();
        }
      });
    }
  
    function compareToParty(party) {
      var totalDistance = 0;
      for (var i = 0; i < userAnswers.length; i++) {
        totalDistance += Math.abs(userAnswers[i] - party[i])
      }
      return totalDistance;
    }
    
    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
      var score = $('<p>',{id: 'question'});
      
      var numCorrect = 0;
      for (var i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] === questions[i].correctAnswer) {
          numCorrect++;
        }
      }
  
      var largestDistance = 0;
      for (var i = 0; i < userAnswers.length; i++) {
        largestDistance += (Math.abs(userAnswers[i] - 2) + 2);
      }
  
      var comparedLPC = (Math.round((1 - (compareToParty(lpc) / largestDistance)) * 100));
      var comparedCPC = (Math.round((1 - (compareToParty(cpc) / largestDistance)) * 100));
      var comparedNDP = (Math.round((1 - (compareToParty(ndp) / largestDistance)) * 100));
      var comparedGPC = (Math.round((1 - (compareToParty(gpc) / largestDistance)) * 100));
      var comparedBQ = (Math.round((1 - (compareToParty(bq) / largestDistance)) * 100));

      var bestMatch = Math.max(comparedLPC, comparedCPC, comparedNDP, comparedGPC, comparedBQ);

      switch (bestMatch) {
        case comparedLPC:
            score.append('The Liberal Party is the best match! Your views are ' + comparedLPC + "% similar.");
            break;
        case comparedCPC:
            score.append('The Conservative Party is the best match! Your views are ' + comparedCPC + "% similar.");
            break;
        case comparedNDP:
            score.append('The New Democratic Party is the best match! Your views are ' + comparedNDP + "% similar.");
            break;
        case comparedGPC:
            score.append('The Green Party is the best match! Your views are ' + comparedGPC + "% similar.");
            break;
        case comparedBQ:
            score.append('The Bloc Quebecois is the best match! Your views are ' + comparedBQ + "% similar.");
            break;
        default:
            score.append('LPC: ' + comparedLPC + ' CPC: ' + comparedCPC + ' NDP: ' + comparedNDP + ' GPC: ' + comparedGPC + ' BQ: ' + comparedBQ);
            break
      }
      
      return score;
    }

  })();