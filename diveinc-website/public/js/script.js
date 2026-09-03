/*
  Script for accordion
*/
$('.itenary-title').click(function(){
    $(this).children('.itenary-title .fas').toggleClass('active');
    $(this).parent().children('.itenary-content').toggleClass('active');
});

$('.accordion-title').click(function(){
    $(this).children('.accordion-title .fas').toggleClass('active');
    $(this).parent().children('.accordion-content').toggleClass('active');
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function loginRequired(){
    Swal.fire({
        title: "Login Required",
        text: "Please login to continue your order."
    }).then(function() {
        window.location.replace("/signin");
    });
}

function formatRupiah(angka){
    var number_string = angka.toString(),
    sisa     		= number_string.length % 3,
    rupiah     		= number_string.substr(0, sisa),
    ribuan     		= number_string.substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    return rupiah
}

function reverseDate(tanggal){
    // notes ini cmn berlaku buat tanggal/tahun di depan,
    //klo tanggal tengah string ga bisa misal "Sunday 20-01-2020"
    return tanggal.toString().substring(0,10).split('-').reverse().join('-');
}

function dateFormatSM(tanggal){
    let tgl = tanggal.toString().substring(0,10).split('-');
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return tgl[2]+' '+monthNamesShort[tgl[1]-1]+' '+tgl[0];
}

function dateFormatForDB(tanggal){
    let bulan = [];
    bulan["january"] = '01';      bulan["july"] = '07';
    bulan["february"] = '02';     bulan["august"] = '08';
    bulan["march"] = '03';        bulan["september"] = '09';
    bulan["april"] = '04';        bulan["october"] = '10';
    bulan["may"] = '05';         bulan["november"] = '11';
    bulan["june"] = '06';         bulan["december"] = '12';
    
    tanggal = $.trim(tanggal).toLowerCase();
    let tgl_break = tanggal.split(' ');
    return tgl_break['2']+'-'+bulan[tgl_break[1]]+'-'+tgl_break[0];
}

function dateFormatMonth(tanggal){
    let tgl = tanggal.toString().substring(0,10).split('-');
    const monthNamesShort = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    return tgl[2]+' '+monthNamesShort[tgl[1]-1]+' '+tgl[0];
}

/*
  Script for SweetAlert
*/
$(document).ready(function() {
  $('.btnConfirmBooking').click(function (){
      Swal.fire({
      title: 'Confirm the booking?',
      text: "We will inform the guest for the booking status.",
      // icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Yes, confirm',
      // animation: false
      }).then((result) => {
      if (result.value) {
          Swal.fire(
          'Booking confirmed!',
          'Added to your calendar. Lets prepare your room and greet your guest!',
          'success'
          )
      }
      })
  })
  $('.btnDeclineBooking').click(function (){
      Swal.fire({
      title: 'Decline the booking?',
      text: "We will inform the guest for the booking status.",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, decline',
      // animation: false
      }).then((result) => {
      if (result.value) {
          Swal.fire(
          'Booking declined!',
          'We know is sad to reject the lovely guest.',
          'success'
          )
      }
      })
  })

  $('#termsConditions').change(function(){
      if($(this).is(":checked")){
         $('#verifyTermsButton').removeClass('disabled');
      }
      else if($(this).is(":not(:checked)")){
          $('#verifyTermsButton').addClass('disabled');
      }
  });

  $('#termsConditions2').click(function(){
    if($(this).is(":checked")){
       $('#verifyTermsButton2').removeClass('disabled');
    }
    else if($(this).is(":not(:checked)")){
        $('#verifyTermsButton2').addClass('disabled');
    }
});
});


// Input Number
//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
  e.preventDefault();
  
  fieldName = $(this).attr('data-field');
  type      = $(this).attr('data-type');
  var input = $("input[name='"+fieldName+"']");
  var currentVal = parseInt(input.val());
  if (!isNaN(currentVal)) {
      if(type == 'minus') {
          
          if(currentVal > input.attr('min')) {
              input.val(currentVal - 1).change();
          } 
          if(parseInt(input.val()) == input.attr('min')) {
              $(this).attr('disabled', true);
          }

      } else if(type == 'plus') {

          if(currentVal < input.attr('max')) {
              input.val(currentVal + 1).change();
          }
          if(parseInt(input.val()) == input.attr('max')) {
              $(this).attr('disabled', true);
          }

      }
  } else {
      input.val(0);
  }
});
$('.input-number').focusin(function(){
 $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {
  
  minValue =  parseInt($(this).attr('min'));
  maxValue =  parseInt($(this).attr('max'));
  valueCurrent = parseInt($(this).val());
  
  name = $(this).attr('name');
  if(valueCurrent >= minValue) {
      $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
  } else {
      alert('Sorry, the minimum value was reached');
      $(this).val($(this).data('oldValue'));
  }
  if(valueCurrent <= maxValue) {
      $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
  } else {
      alert('Sorry, the maximum value was reached');
      $(this).val($(this).data('oldValue'));
  }
});
$(".input-number").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
          // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) || 
          // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
              // let it happen, don't do anything
              return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

// Script for close sidebar menu
$('.sidebar-nav--btn').click(function(){
    $('.sidebar-nav--section').hide();
})
$('.sidebar-nav--btn-open').click(function(){
    $('.sidebar-nav--section').show();
})