$("document").ready(function(){
    $.ajaxSetup ({
		cache: false
	});
    $(".ui-menu-item")
       .live('mouseover', function(){
           $(this).children('a').addClass('ui-state-hover');
       })
       .live('mouseout', function(){
           $(this).children('a').removeClass('ui-state-hover');
       })
       .live('click', function(){
           $("#attending_dropdown").slideUp(100);
       })

    loadEvents("");
    loadCalendar("");

    $(".cal_cell_events").live('mouseover',function(){
        el = this;
        var position = $(el).position();
        var data = '{"action":"getEvents","d":"'+$(el).attr('id')+'"}';
        $.post('controllers/ajaxEventsController.php', {json_data: data}, function(data_back){
            if(data_back.status==1&&data_back.count>0)
                $("#event_tooltip").css({"left": position.left+20+"px","top": position.top+20+"px"}).html(data_back.events).show();
        }, "json");
    })
    
    $(".cal_cell_next_month,.next,.cal_cell_last_month,.last").live('click', function(){
        loadEvents($(this).attr('id'));
        loadCalendar($(this).attr('id'));
    })

    $(".cal_cell_events").live('click', function(){
        location.href= 'events.php?d='+$(this).attr('id');
    })

    $(".cal_table, .cal_cell_events").live('mouseleave',function(){
        $("#event_tooltip").hide();
    })
})

function updateTooltips(){
    $(".cal_cell_no_events").qtip({
       delay: 90,
       content: '{-$events_no_events}',
       show: {
           solo: true
       },
       position: {
           corner: {
               target: 'topRight',
               tooltip: 'bottomLeft'
           }
       },
       style: {
          width: 100,
          padding: 3,
          background: '#111',
          color: 'white',
          textAlign: 'left',
          border: {
             width: 1,
             radius: 5,
             color: '#111'
          },
          tip: {
              corner: 'bottomLeft'
          }
       },
       hide: {
           when: {
               target: $(".cal_table")
           }
       }
    });
}

function loadEvents(q){
    var data = '{"action":"getEventsList","q":"'+q+'"}';
    $.post('controllers/ajaxEventsController.php', {json_data: data}, function(data_back){
        if(data_back.status==1){
            $("#events_list").html(data_back.events);
            refreshButtons();
            $("#events_list").show();
        }
    }, "json");
}

function loadCalendar(q){
    var data = '{"action":"getCalendar","q":"'+q+'"}';
    $.post('controllers/ajaxEventsController.php', {json_data: data}, function(data_back){
        if(data_back.status==1){
            $("#cal_wrapper").html(data_back.calendar);
            updateTooltips();
        }

    }, "json");
}

function respondInvitation(event_id, attending,newText){
    var data = '{"action":"respondRequest", "event_id":"'+event_id+'","status":"'+attending+'"}';
    $.post('controllers/ajaxEventsController.php', {json_data:data},function(data_back){
        if(data_back.status==1)
            $("#event_"+event_id+" .attending_button").button('option', 'label',newText);
        else if(data_back.status==2)
            $("#event_"+event_id).fadeOut().remove();
        else if(data_back.status==0)
            apprise(data_back.error);
    },"json")
}

function attendingDropDown(){
    if($("#attending_dropdown").is(':visible'))
	   $("#attending_dropdown").slideUp(100);
	else
	   $("#attending_dropdown").slideDown(100);
}