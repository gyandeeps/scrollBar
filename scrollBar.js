/**
    This is the main function for the custom scroll bar
    @dependencies : jQuery
    @dependencies : jQuery UI
    
    @author : Gyandeep Singh
    @version : 1.0.0
*/

$.mpScrollBar = function(options){
    var dragHandle = new scrollMpage(options);
    dragHandle.init();
    
    return dragHandle;
}

function scrollMpage(options){
    //reference to the element which is actually dragged
    this.scrollElem = null;
    
    //scrollElem body color
    this.scrollElemOptions = {
        "borderColor" : "blue",
        "borderWidth" : 1,
        "color" : "rgba(33,233,247,0.3)",
        "scrollAxis" : "x",
        "delay" : 200
    };
    
    //reference to the element which contains the scrollElem
    //REQUIRED
    this.scrollContainerElem = null;
    
    //scrollContainerElem body color
    this.scrollContainerElemOptions = {
        // not used
    };
    
    //refrence to the element which contains the data
    //i.e. the element which actually moves
    //REQUIRED
    this.contentElem = null;
    
    //contentElem body color
    this.contentElemOptions = {
        // not used
    };
    
    //reference to the element which contains the contentElem
    //REQUIRED
    this.contentContainerElem = null;
    
    //contentContainerElem body color
    this.contentContainerElemOptions = {
        // not used
    };
    
    //reference to different properties of the scroll items
    this.scrollItemsOptions = {
        //empty on initialization
    };
    
    //To make the user provide properties to overwrite the defaults
    $.extend(true, this, options);
}

/**
    This function would create the scrollbar
*/
scrollMpage.prototype.init = function(){
    try{
        //to draw the required elements of the API
        this.draw();
        //to adjust the scrollBar size based on the content and the displayable area
        this.setScrollbarSize();
        //Set up the scroll event on the scrollbar    
        this.scrollEvent();
    }
    catch(e){
        alert("ERROR - " + e.message);
    }
}

/**
    This function would create the scrollbar
*/
scrollMpage.prototype.draw = function(){
    //to draw all the contents inside the scrollbar container
    this.drawScrollBarContent();
    
    // calculate dimensions for the scrollElem
    var itemWidth = 20; //this would be set later on by the setscrollwidth function
    var itemHeight = $(this.scrollContainerElem).height() + 15;
    var itemTop = -itemHeight + 7;
    var scrollElemOptions = {
        "height" : itemHeight,
        "width" : itemWidth,
        "top" : itemTop
    };
    //to merge the recent changes with the original
    $.extend(true, this.scrollElemOptions, scrollElemOptions);
    
    //create the scroll element
    this.scrollElem = $(document.createElement('div'))
                        .addClass("drag")
                        .attr({
                            id : "drag"
                        })
                        .css({
                            "height" : itemHeight,
                            "width" : itemWidth,
                            "top" : itemTop,
                            "borderColor" : this.scrollElemOptions.borderColor,
                            "background-color" : this.scrollElemOptions.color
                        });
    
    $(this.scrollContainerElem).append(this.scrollElem);
}

/**
    This function would create the scrollbar
*/
scrollMpage.prototype.scrollEvent = function(){
    //Options to be passed to jquery UI
    var dragOptions = {
        axis: this.scrollElemOptions.scrollAxis
        ,containment: this.scrollContainerElem
        ,scroll: false
        ,delay: this.scrollContainerElem.delay
    };
    //function to call when we scroll
    $(this.scrollElem).on("drag", this, this.onScroll);
    
    //Attach the drag effect/function to the element with options
    $(this.scrollElem).draggable(dragOptions);
}

/**
    This function would create the scrollbar
*/
scrollMpage.prototype.onScroll = function(event, ui){
    var self = event.data;
    var proportion = $(self.contentElem).width() / $(self.contentContainerElem).width();
    $(self.contentElem).css("margin-left", -Math.round(ui.position.left * proportion) + "px");
}

/**
    This function would create the scrollbar
*/
scrollMpage.prototype.setScrollbarSize = function(){
    var proportion = $(this.contentElem).width() / $(this.contentContainerElem).width();
    var handleSize = $(this.contentContainerElem).width() / proportion;
    $(this.scrollElem).css({
        width: handleSize - 10 //error bit... need to device the logic to calculate the error bit
    });
}

/**
    This function would create the scrollbar
*/
scrollMpage.prototype.drawScrollBarContent = function(){
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var len = monthNames.length;
    
    //To calculate the width of each element w.r.t main element
    var itemWidth = $(this.scrollContainerElem).width() / len - 4;
    var itemHeight = $(this.scrollContainerElem).height() - 4;
    var leftCalculate = function(u){
        return u * itemWidth;
    };
    var scrollItemsOptions = {
        "height" : itemHeight,
        "width" : itemWidth,
        "leftCalculate" : leftCalculate
    }
    //to merge the recent changes with the original
    $.extend(true, this.scrollItemsOptions, scrollItemsOptions);
    
    //create the month elements     
    for(var cnt = 0; cnt < len; cnt++){ //TODO - need some work to make it more efficient
        var iconClass = (cnt % 2 == 0)? "icon-down" : "icon-up";
        var item = $(document.createElement('div')) 
                        .addClass("item")
                        .css({
                            "height" : itemHeight,
                            "width" : itemWidth
                        });
        $(item).append('<span>'+ monthNames[cnt] +'</span><br><span class="'+ iconClass +'"></span>');
        
        $(this.scrollContainerElem).append(item);
    }
}
