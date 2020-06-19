$(document).ready(function() {
    var $navItems = $(".nav-item");
    var $pageContainers = $(".container");
    
    function showContainer() {
        $pageContainers.hide();
        $pageContainers.each(function() {
            if ( $(this).hasClass("active") ) {
                $(this).show();
            }
        });
    }
    
    showContainer()
    
    $navItems.each(function() {
        $(this).click(function() {
            $navItems.removeClass("active");
            $(this).addClass("active");
            $pageContainers.removeClass("active");
            $("#" + $(this).attr("id").replace("-nav-item", "") + "-container").addClass("active");
            showContainer()
        });
    });
});