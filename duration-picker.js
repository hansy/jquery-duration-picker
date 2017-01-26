/**
 * Created by Tartarus762 on 10/13/16.
 */
(function ($) {

    // Constructor for durationpicker 'class'
    var durationPicker = function (element, options) {
        this.settings = options;
        this.template = generate_template(this.settings);
        this.jqitem = $(this.template);
        this.jqchildren = this.jqitem.children();
        this.element = $(element);
        this.setup();
        this.resize();
        this.jqchildren.find(".durationpicker-duration").trigger('change');
        var _self = this;

        var hours   = 0;
        var minutes = 0;
    };

    durationPicker.prototype = {
        constructor: durationPicker,
        setup: function () {
            var el = this.element;

            el.before(this.jqitem);
            el.hide();

            // Initialize selector value to 0 if value is blank
            if (el.val() === '') {
               el.val(0);
            }

            // Calculate hours and minutes, in minutes
            var total = parseInt(el.val(), 10);
            minutes = total % 60;
            total   = Math.floor(total/60);
            hours   = total % 24;

            // Set value of individual inputs (for display purposes on init)
            this.jqitem.find('#duration-hours').val(hours);
            this.jqitem.find('#duration-minutes').val(minutes);

            this.jqchildren.find(".durationpicker-duration").on('change', {ths: this}, function (ev) {
                var element   = ev.data.ths.element;
                var totalTime = 0;
                $(this).parent().parent().find('input').each(function () {
                    var input      = $(this);
                    var val        = 0;
                    var durationEl = input.next();
                    var durationId = input.attr('id');

                    if (input.val() != null && input.val() != ""){
                        // Convert string to int
                        val = parseInt(input.val(), 10); 

                        // Change plurality of label
                        if (val != 1) {
                            makePlural(durationEl, durationId);
                        } else {
                            makeSingular(durationEl, durationId);
                        }

                        // Calculate total time in minutes
                        if (durationId == "duration-hours") {
                            totalTime += val * 60;
                        } else if (durationId == "duration-minutes") {
                            totalTime += val;
                        }
                    }
                });
                // Set input selector value to total time
                element.val(totalTime);
            });
            // $(".durationpicker-duration").trigger();
            window.addEventListener('resize', this.resize);
        },
        resize: function() {
            if (!this.settings.responsive) {
                return
            }
            var padding = parseInt(this.jqitem.css('padding-left').split('px')[0]) + parseInt(this.jqitem.css('padding-right').split('px')[0]);
            var minwidth = padding;
            var minheight = padding;
            this.jqchildren.each(function () {
                var ths = $(this);
                minwidth = minwidth + ths.outerWidth();
                minheight = minheight + ths.outerHeight();
            });
            if (this.jqitem.parent().width() < minwidth) {
                this.jqchildren.each(function () {
                    var ths = $(this);
                    ths.css('display', 'block');
                });
                this.jqitem.css('height', minheight)
            }
            else {
                this.jqchildren.each(function () {
                    var ths = $(this);
                    ths.css('display', 'inline-block');
                });
            }
        },
        getitem: function () {
            return this.jqitem;
        }
    };

    $.fn.durationPicker = function(options){
        if (options == undefined) {
            var settings = $.extend(true, {}, $.fn.durationPicker.defaults, options);
        }
        else {
            var settings = $.extend(true, {}, {classname: 'form-control', responsive: true}, options);
        }

        // return this.each(function () {
        return new durationPicker(this, settings);
        // })
    };

    function makePlural(selector, id) {
        if (id == "duration-hours") {
            selector.html("hours");
        } else if (id == "duration-minutes") {
            selector.html("minutes");
        }
    }

    function makeSingular(selector, id) {
        if (id == "duration-hours") {
            selector.html("hour");
        } else if (id == "duration-minutes") {
            selector.html("minute");
        }
    }

    function generate_template (settings) {
        var stages = [];
        for (var key in Object.keys(settings)){
            if (['classname', 'responsive'].indexOf(Object.keys(settings)[key]) == -1) {
                stages.push(Object.keys(settings)[key]);
            }
        }

        var html = '<div class="durationpicker-container ' + settings.classname + '">';
        for (var item in stages){
            html += '<div class="durationpicker-innercontainer"><input min="' + settings[stages[item]]['min'] + '" max="' + settings[stages[item]]['max'] + '" placeholder="0" type="number" id="duration-' + stages[item] + '" class="durationpicker-duration" ><span class="durationpicker-label">' + settings[stages[item]]['label'] + '</span></div>';
        }
        html += '</div>';

        return html
    }

    $.fn.durationPicker.defaults = {
        hours: {
            label: "hour",
            min: 0,
            max: 24
        },
        minutes: {
            label: "minute",
            min: 0,
            max: 59
        },
        classname: 'form-control',
        responsive: true
    };

    $.fn.durationPicker.Constructor = durationPicker;

})(jQuery);
