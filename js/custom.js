
 $(document).ready(function () { 

    const jointWaitlistInput = document.querySelector('#email2') 
    document.getElementById('jointWatchlist').addEventListener('click', ()=>{
        jointWaitlistInput.focus()
    })

    $(".preloader").fadeOut(5000);
  
    $("#owl-testimonials").owlCarousel({ 
       items: 2,
       slideBy: 2,
       loop:false, 
       dots: true,
       loop: true,
       margin:20,
       responsiveClass:true,
       responsive:{
           0:{
               items:1,  
           },
           600:{
               items:1,  
           },
           1000:{
               items:2,  
           }
       }
    }); 
});

function toTop() {
    // let JoinWaitlist = document.getElementById('JoinWaitlist')
    $(window).scrollTop(0)
  }
  


(function(){
  let addItems = document.querySelectorAll('.addItem')
  let removeItems = document.querySelectorAll('.removeItem')  

  addItems.forEach(el => { 
    el.addEventListener('click',(e)=>{   
        e.target.parentElement.classList.toggle("ItemSelected")  
        let activeItems = document.querySelectorAll('.ItemSelected')
        if(activeItems.length <= 3){
            e.target.classList.toggle("d-none")
            e.target.nextElementSibling.classList.toggle("d-none") 
        }else{
            e.target.parentElement.classList.toggle("ItemSelected")
            new bootstrap.Modal(document.querySelector("#CareScoreModal")).show();
        }
    }) 
  });
  removeItems.forEach(el=>{
    el.addEventListener('click',(e)=>{   
        e.target.parentElement.classList.toggle("ItemSelected")  
        e.target.classList.toggle("d-none")
        e.target.previousElementSibling.classList.toggle("d-none") 
    }) 
  })
})()
 



// video popup

$('.play-video').on('click', function(e){
    e.preventDefault();
    $('#video-overlay').addClass('open');
    $("#video-overlay").append('<iframe class="videoPopup" src="https://player.vimeo.com/video/817872782?h=5a2153fc80" frameborder="0" allowfullscreen></iframe>');
  });
  
  $('.video-overlay, .video-overlay-close').on('click', function(e){
    e.preventDefault();
    close_video();
  });
  
  $(document).keyup(function(e){
    if(e.keyCode === 27) { close_video(); }
  });
  
  function close_video() {
    $('.video-overlay.open').removeClass('open').find('iframe').remove();
  };


//  form submit

const SubmitEmail = document.getElementById('SubmitEmail');
 

 


 
(function() {

    function validEmail(email) { // see:
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
      }
      
      function validateHuman(honeypot) {
        if (honeypot) {  //if hidden form filled up
          console.log("Robot Detected!");
          return true;
        } 
      }


    // get all data in form and return object
    function getFormData(form) {
      var elements = form.elements;
      var honeypot; 
  
      var fields = Object.keys(elements).filter(function(k) { 
        if (elements[k].name === "honeypot") {
          honeypot = elements[k].value;  
          return false;
        }
        return true;
      }).map(function(k) { 
        if(elements[k].name !== undefined) {
          return elements[k].name;
        // special case for Edge's html collection
        }else if(elements[k].length > 0){
          return elements[k].item(0).name;
        }
      }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
      });
  
      var formData = {};
      fields.forEach(function(name){
        var element = elements[name];
        
        // singular form elements just have one value
        formData[name] = element.value;
  
        // when our element has multiple items, get their values
        if (element.length) {
          var data = [];
          for (var i = 0; i < element.length; i++) {
            var item = element.item(i);
            if (item.checked || item.selected) {
              data.push(item.value);
            }
          }
          formData[name] = data.join(', ');
        }
      });
  
      // add form-specific values into the data
      formData.formDataNameOrder = JSON.stringify(fields);
      formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
      formData.formGoogleSendEmail
        = form.dataset.email || ""; // no email by default
  
      return {data: formData, honeypot: honeypot};
    }
  
    function handleFormSubmit(event) {  // handles form submit without any jquery
      event.preventDefault();           // we are submitting via xhr below 
      
          var form = event.target;  
          var formData = getFormData(form);
          var data = formData.data; 

          if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
            return false;
          }
          
 
         
        // If a honeypot field is filled, assume it was done so by a spam bot.
      if (formData.honeypot) { 
        return false;
      }

      let emailInput = document.querySelectorAll('.emailInput') 

      if(!validEmail(data.email) ) {   // if email is not valid show error
        emailInput &&  emailInput.forEach(element => { 
            element.classList.add("border-danger")
        });
        return false;
      } else {
        emailInput &&  emailInput.forEach(element => { 
            element.classList.remove("border-danger")
        }); 
      disableAllButtons(form);
      var url = form.action;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            form.reset();
            var formElements = form.querySelector(".form-elements")
            if (formElements) {
              formElements.style.display = "none"; // hide form
            }
            var thankYouMessage = document.querySelector(".thankyou_message");
            if (thankYouMessage) {
              thankYouMessage.classList.add("show")
              setTimeout(()=>{
                thankYouMessage.classList.remove("show")
              },5000)
            }
          }
      }
    }
      // url encode form data for sending as post data
      var encoded = Object.keys(data).map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      }).join('&');
      xhr.send(encoded);
    }
    
    function loaded() {
      // bind to the submit event of our form
      var forms = document.querySelectorAll("form.gform"); 
      for (var i = 0; i < forms.length; i++) { 
        forms[i].addEventListener("submit", handleFormSubmit , false);
      }
    };

    
    document.addEventListener("DOMContentLoaded", loaded, false);
  
    function disableAllButtons(form) {
      var buttons = form.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  })();