 define(['jquery', 'moment', 'jqueryui', 'bootstrap'], function($, moment) {
    //To-Do: Make this not so freaking ugly code. This is all hacked together.
    
    // Init jQuery UI slider
    $(".ui-slider").find('a').tooltip({title:'5', delay: { show: 500, hide: 100 }, trigger: 'hover focus'});
    $(".ui-slider").slider({
        min: 0,
        max: 10,
        value: 5,
        orientation: "horizontal",
        range: "min",
        change: function( event, ui ) {
            //set the input box
            var id = '#' + $(this).attr('data-input');
            $(id).val(ui.value);
            //add a nice tooltip to show value
            $(this).find('a').tooltip('hide').attr('data-original-title', ui.value).delay(500).tooltip('show');
        }
    });

    var toggleHandler = function(toggle) {
        var toggle = toggle;
        var radio = $(toggle).find("input");
        var id = '#' + $(toggle).attr('data-input');

        var checkToggleState = function() {
            if (radio.eq(0).is(":checked")) {
                $(toggle).removeClass("toggle-off");
                $(id).prop('checked', true );
            } else {
                $(toggle).addClass("toggle-off");
                $(id).prop('checked', false);
            }
        };
        
        checkToggleState();


        radio.eq(0).click(function() {
            checkToggleState();
        });

        radio.eq(1).click(function() {
            checkToggleState();
        });
    };

    $(".toggle").each(function(index, toggle) {
        toggleHandler(toggle);
    });

            
    var renderCalTime = function(div) {
        var $div = $(div);
        var time = $div.html();
        time = moment(time).calendar();
        $div.html(time);
    }

    var renderfromNow = function(div) {
        var $div = $(div);
        var time = $div.html();
        time = moment(time).fromNow();
        $div.html(time);
    }

    $('.calendar').each(function() {
        renderCalTime(this);
    });

    $('.fromNow').each(function() {
        renderfromNow(this);
    });
});
