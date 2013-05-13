function CustomSelect(custom, original, autoSearch, scrollPane) {
    if(!custom || !original) return false;

    this.autoSearch = ( autoSearch === null || autoSearch === undefined || autoSearch === false) ? false : autoSearch;
    this.scrollPane = ( this.autoSearch ) ? scrollPane.data('jsp') : false;
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
CustomSelect.prototype.findItem = function(value) {
    if( !this.scrollPane ) return;

    var top;

    for(var i = 0; i < this.items.length; i++) {
        if(this.items.eq(i).html().toLowerCase().match(value)) {
            this.items.removeClass('hover');
            this.items.eq(i).addClass('hover');
            
            top = parseInt(this.items.eq(i).position().top) - this.customSelect.height()/2;

            this.scrollPane.scrollTo( 0, top, false );
            return;
        }
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
CustomSelect.prototype.handleEnter = function() {
    var target = this.items.filter('.hover');
    this.handleClick(target);
};
CustomSelect.prototype.handleClick = function(target) {
    var val, text;
    val = target.attr('rel');
    text = target.html();

    this.originalSelect.get(0).selectedIndex = this.findIndex(target);
    this.originalSelect.trigger('change');
    
    if( this.autoSearch ) {
        this.defaultVisible.val(text);
    }
    else {
        this.defaultVisible.html(text);
    }
    this.closeMenu(true);
};
CustomSelect.prototype.init = function() {
    var _this = this;
    var pos = this.customSelect.parent();

    this.items.bind('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        _this.handleClick($(this));
    });

    this.container.bind('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if(evt.target.className.match('jsp'))
            return;

        _this.toggleMenu();
    });

    if( this.autoSearch ) {
        this.defaultVisible.bind({
            keyup: function(evt) {
                _this.findItem($(this).val());
            },
            keydown: function(evt) {
                if( evt.keyCode == '13' ) {
                    _this.handleEnter();
                }
                else {
                    _this.findItem($(this).val());
                }
            }
        });
    }

    $(document).bind('click', function(evt) {
        evt.stopPropagation();

        if(_this.customSelect.hasClass('opened')) {
            _this.closeMenu(true);
        }
    });

    // If jScrollPane is preset, hack the world and initialize it
    if(this.customSelect.jScrollPane) {
        this.customSelect
            .show()
            .appendTo($('body'))
            .jScrollPane({
                'verticalGutter':0,
                'verticalDragMinHeight': 20,
                'verticalDragMaxHeight': 20,
                'horizontalDragMinWidth': 0,
                'horizontalDragMaxWidth': 0
            })
            .hide();
        this.customSelect.appendTo(pos);
    }
};
$.fn.customSelect = function(original, autoSearch, scrollPane) {
    return this.each(function() {
        var orig = $(this).find(original);
        var cSelect = new CustomSelect($(this), orig, autoSearch, scrollPane);
        $(this).data('customSelect', cSelect);
    });
};