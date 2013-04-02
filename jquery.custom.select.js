function CustomSelect(custom, original) {
    if(!custom || !original) return false;

    this.container = custom;
    this.originalSelect = original;
    this.defaultVisible = custom.find('.default');
    this.customSelect = custom.find('.dropDown') || custom.find('ul').eq(0);
    this.items = this.customSelect.find('a');

    this.init();
}
CustomSelect.prototype.openMenu = function() {
    this.customSelect.addClass('opened').slideDown();
};
CustomSelect.prototype.closeMenu = function(fast) {
    this.customSelect.removeClass('opened').slideUp((fast) ? 0 : 'normal');
};
CustomSelect.prototype.toggleMenu = function() {
    if(this.customSelect.hasClass('opened')) {
        this.closeMenu();
    }
    else {
        this.openMenu();
    }
};
CustomSelect.prototype.findIndex = function(clicked) {
    var ind = 0;
    this.items.each(function(index) {
        if( ($(this).attr('rel') == clicked.attr('rel')) && ($(this).html() == clicked.html()) ) {
            ind = index;
        }
    });

    return ind;
};
CustomSelect.prototype.handleClick = function(target) {
    var val, text;
    val = target.attr('rel');
    text = target.html();

    this.originalSelect.get(0).selectedIndex = this.findIndex(target);
    this.originalSelect.trigger('change');
    this.defaultVisible.html(text);

    this.closeMenu(true);
};
CustomSelect.prototype.init = function() {
    var _this = this;

    this.items.bind('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        _this.handleClick($(this));
    });

    this.container.bind('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        _this.toggleMenu();
    });

    $(document).bind('click', function(evt) {
        evt.stopPropagation();

        if(_this.customSelect.hasClass('opened')) {
            _this.closeMenu(true);
        }
    });
};
$.fn.customSelect = function(original) {
    return this.each(function() {
        var orig = $(this).find(original);
        var cSelect = new CustomSelect($(this), orig);
        $(this).data('customSelect', cSelect);
    });
};