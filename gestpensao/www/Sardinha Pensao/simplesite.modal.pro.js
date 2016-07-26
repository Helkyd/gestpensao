(function ($) {
    var methods = {
        close: function (options) {
            var $modal = this.closest('.modal-pro');
            var $modalBackdrop = $modal.next();

            $modal.addClass('hidden');
            $modalBackdrop.addClass('hidden');

            $modal.children().eq(1).trigger('close');
        },

        show: function (options) {

            if (this.length === 0) {
                return;
            }

            // keyboard handling
            $(document).one('keyup', function (e) {
                if (e.keyCode == 27) {
                    $('body').modalpro('cancelall', options);
                }
            });

            // close all current modals
            $('.modal-pro').addClass('hidden');
            $('.modal-pro-bd').addClass('hidden');

            var $modal;
            var $modalCloseButton;
            var $modalBackdrop;

            // TODO: If not already initialized once
            var $existingModal = this.closest('.modal-pro');
            if ($existingModal.length === 0) {
                // create modal container elements if not already created
                $modalCloseButton = $('<button id="modal-pro-button-close" class="modal-close"></button>');
                $modal = $('<div class="modal-pro hidden"></div>');
                $modalBackdrop = $('<div class="modal-pro-bd hidden"></div>');

                // set modal contents
                $modal.append($modalCloseButton);
                $modal.append(this);

                // append modal conponents to the body
                $('body').append($modal);
                $('body').append($modalBackdrop);

                // set z-index values
                $modal.css('z-index', '1000');
                $modalBackdrop.css('z-index', '999');

                // setup close events
                var $self = this;

                $modalCloseButton.on('click', function () {
                    $self.trigger('cancel');
                    $self.modalpro('close');
                });

                $modalBackdrop.on('click', function () {
                    $self.trigger('cancel');
                    $self.modalpro('close');
                });

            } else {
                // Just use the existing modal
                $modal = $existingModal;
                $modalBackdrop = $existingModal.next();
                $modalCloseButton = $modal.children().eq(0);
            }

            // show it
            this.removeClass('hidden');
            $modal.removeClass('hidden');
            $modalBackdrop.removeClass('hidden');
        },

        cancelall: function (options) {
            $('.modal-pro').not('.hidden').each(function () {
                // trigger the cancel event
                $(this).children().eq(1).trigger('cancel');

                // close the dialog
                $(this).children().eq(1).modalpro('close');
            });
        }
    };

    $.fn.modalpro = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "show"
            return methods.show.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on modalpro');
        }
    };
}(jQuery));