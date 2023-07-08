$(document).ready(function(){

        // first check the charges already booked
        checkchargesBooked();

        // apply jQuery UI Redmond theme to 'Book charges' button
        $("#submit").button();

        // calculateTotalPrice on keyup or on change of charge/date/charges
        $("#charge_name, #date, #charges_time").keyup(calculateTotalPrice);
        $("#charge_name, #date, #charges_time").change(calculateTotalPrice);

        // on form submit
        $("#book_charges").submit(function(event){

            // prevent on submit page refresh
            event.preventDefault();

            // check locally stored data
            if(window.localStorage){
                var chargesListJson = localStorage.getItem('charges_list');
                var charges_list = chargesListJson ? JSON.parse(chargesListJson) : [];
                var charge = $("#charge_name").val();
                charges_list.push(charge);
                localStorage.setItem('charges_list', JSON.stringify(charges_list));
            }

            // clear the form
            $( '#book_charges' ).each(function(){
                this.reset();
            });

            // reset (enter data first) message
            $("#total_price").html("(enter data first)");

            // update charges booked list
            checkchargesBooked();
        });

        // set minimum date in datepicker as today
        var today = new Date().toISOString().split('T')[0];
        document.getElementsByName("date")[0].setAttribute('min', today);

    });

    function calculateTotalPrice(){
        if($("#charges_time").val() != "" && $("#charge_name").val() != "" && $("#date").val() != ""){
            if(window.Worker){
                // create web worker
                var blob = new Blob(
                    [document.querySelector("#worker").textContent],
                    {type: 'text/javascript'});
                var worker = new Worker(window.URL.createObjectURL(blob));

                worker.onmessage = function(event){
                    $("#total_price").html(event.data);
                }
                worker.onerror = function(errorObject){
                    $("#total_price").html("Error: " + errorObject.message);
                }

                // get date
                var date = new Date($('#date').val());

                // get day
                var day = date.getDay();

                // get number of booked shows
                var number_booked_shows;
                if(window.localStorage){
                    // check if charges_list is present already
                    if(localStorage.getItem('charges_list')){
                        var chargeListJson = localStorage.getItem('charges_list');
                        var charges_list = JSON.parse(chargeListJson);
                        number_booked_shows = charges_list.length;
                    }
                    else
                        number_booked_shows = 0;
                }

                // send JSON data to worker
                var jsonData = {'day': day,  'number_booked_shows': number_booked_shows, 'charges_time': Number($("#charges_time").val())};
                worker.postMessage(jsonData);
            }
        }
    }

    // fetch details of charges booked
    function checkchargesBooked(){
        $("#charges_list").html("<span id='none'>(none)</span>");
        if(window.localStorage){
            if(localStorage.getItem('charges_list')){
                $("#none").remove();
                var chargeListJson = localStorage.getItem('charges_list');
                var charges_list = JSON.parse(chargeListJson);
                var sr_no = 0;
                $.each(charges_list,function(key,value){
                    $("#charges_list").append(++sr_no + ". " + value + "<br>");
                });
            }
        }
    }
