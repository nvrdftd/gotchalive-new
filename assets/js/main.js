var swiper = undefined;
var IMG_BASE_URL = 'https://image.tmdb.org/t/p/w154';
var context = {};
var input;

if (window.speechSynthesis != undefined) {
  var synthesis = window.speechSynthesis;
  var voiceList = [];
  var utter = new SpeechSynthesisUtterance();
}

$(function() {
  $('input[type="submit"]').click(function() {
    input = $('input[type="text"]').val();
    $.ajax({
      type: 'POST',
      url: '/conversation',
      processData: false,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        input: input,
        context: context
      }),
      dataType: 'json'
    }).done(function(json) {
      context = json.context;
      message = json.output.text[0];
      console.log(json);

      typewriter(message, '#bot');
      syn(message, loadToSpeak);
      if (swiper == undefined) {
          swiper = new Swiper('.swiper-container', {
          effect: 'coverflow',
          grabCursor: true,
          slidesPerView: 3,
          loop: true,
          coverflow: {
              rotate: 50,
              stretch: -50,
              depth: 150,
              modifier: 1,
              slideShadows : true
          }
        });
      }

      showSlide(json.results, swiper, function() {
        $('.swiper-slide').click(function() {
          $.ajax({
            type: 'GET',
            url: '/api/videos/' + $('.swiper-slide').eq(swiper.clickedIndex).attr('data-id'),
            dataType: 'json'
          }).done(function(json) {
            if (json != undefined && json.keys.length != 0) {
              message = "Excellent choice! Let's watch the trailer.";
              $('.trailer-window').html('<div class="trailer-container"><iframe width="853" height="480" id="player-1" src="https://www.youtube.com/embed/' + json.keys[0] + '?playlist=' + json.keys.join(',') + '&enablejsapi=1&autoplay=1&loop=1&rel=0&controls=0&showinfo=0&modestbranding=1" frameborder="0" allowfullscreen></iframe></div><div class="trailer-overview">' + $('.swiper-slide').eq(swiper.clickedIndex).attr('data-overview') + '</div>');
              $('.trailer-window').addClass('in-view');
              $('.shiny-button').addClass('in-view');
            } else {
              message = "Sorry, I can't find any relevant videos!";
            }
            typewriter(message, '#bot');
            syn(message, loadToSpeak);
          });
        });
      });

    });
  });

  blinking('.shiny-button');

  $('.shiny-button').click(function() {
    $('.conversation-window').addClass('in-view');
    $('.main').addClass('in-view');
  });


  $('input[type="submit"], input[type="button"]').click(function(event) {
    event.preventDefault();
    $('.conversation-window, .main').removeClass('in-view');
    $('.trailer-window, .trailer-container').empty().removeClass('in-view');
    $('.shiny-button').removeClass('in-view');
  });
  $('input[type="submit"]').trigger('click');
});


function loadToSpeak(text) {
  utter.voice = voiceList[48];
  utter.rate = 1.0;
  utter.pitch = 1.0;
  utter.text = text;
  synthesis.speak(utter);
}

function syn(text, callback) {
  if (voiceList.length >= 66) {
    return callback(text);
  } else {
    voiceList = synthesis.getVoices();
    return callback(text);
  }
}

function showGenre(array) {
  var arr = [];
  for (var i = 0; i < array.length; i++) {
    arr.push(array[i]);
  }
  return arr.join('|');
}

function showSlide(array, swiper, callback) {
  swiper.removeAllSlides();
  for (var i = 0; i < array.length; i++) {
    swiper.prependSlide(
      '<div class="swiper-slide" data-overview="' + array[i].overview + '" data-id="' + array[i].id + '"><img src="' + IMG_BASE_URL + array[i].poster_path + '"><div>' + (array[i].title || array[i].name) + '</div></div>'
    );
  }
  swiper.update(true);
  return callback()
}

function blinking(_selector) {
  $(_selector).toggleClass('shining');
  setTimeout(blinking, 2000, _selector)
};
