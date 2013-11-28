var Reject = (function (undefined) {
    'use strict';

    var isOn = true;

    var RejectException = (function () {
        var RejectException = function (message) {
            this.name = 'RejectException';
            this.message = message || '<no description>';
        };

        RejectException.prototype = new Error();
        RejectException.prototype.toString = function () {
            return this.name + ': ' + this.message;
        };

        return RejectException;
    })();

    /**
     * Creates a new rejector
     * @param comparator
     * @param [numberOfInputArguments] Number of arguments expected by the comparator (defaults to 1).
     */
    var createRejector = function (comparator/*, numberOfInputArguments*/) {
        var numberOfInputArguments = arguments[1] !== undefined ? arguments[1] : 1;

        /**
         * Rejector definition
         * @param input... variable number of input arguments passed to the comparator
         * @param [description] optional message used in the thrown exception
         */
        return function (/*input...[, description]*/) {
            if( !isOn ) {
                return;
            }

            var args = Array.prototype.slice.call( arguments );
            if( args.length !== numberOfInputArguments && args.length !== numberOfInputArguments + 1 ) {
                throw new RejectException( 'expected ' + numberOfInputArguments + ' input arguments' );
            }

            var comparatorArgs = Array.prototype.slice.call( args, 0, numberOfInputArguments ),
                description = args.length !== numberOfInputArguments ? args[args.length - 1] : undefined;
            if( comparator.apply( this, comparatorArgs ) ) {
                throw new RejectException( description );
            }

            return this;
        };
    };

    /** use native trim or shim otherwise */
    var trim = String.prototype.trim || function () {
        return this.replace( /^\s+|\s+$/, '' );
    };

    return {
        'RejectException': RejectException,

        'always': createRejector( function () {
            return true;
        }, 0 ),
        'ifTrue': createRejector( function (input) {
            return input === true;
        } ),

        'ifFalse': createRejector( function (input) {
            return input === false;
        } ),

        'ifTruthy': createRejector( function (input) {
            return !!input;
        } ),

        'ifFalsy': createRejector( function (input) {
            return !input;
        } ),

        'ifEmpty': createRejector( function (input) {
            return input.length === 0;
        } ),

        'ifNotEmpty': createRejector( function (input) {
            return input.length !== 0;
        } ),

        'ifBlank': createRejector( function (input) {
            return trim.call( input ).length === 0;
        } ),

        'ifNotNumeric': createRejector( function (input) {
            return isNaN( parseFloat( input ) ) || !isFinite( input );
        } ),

        /**
         * Create (or replace) a rejector.
         * @param rejectorName The name for the new rejector (suggested pattern is 'ifXyz')
         * @param comparator A function that will receive the input as its first and only argument.
         *     It should return a truthy value if and only if the input shall be rejected.
         * @param [safeMode] Optional. If set to true, the rejector will only be created if no
         *     property with that name exists on the Reject object yet.
         */
        'registerRejector': function (rejectorName, comparator, safeMode) {
            safeMode = safeMode !== undefined ? safeMode : true;
            if( safeMode && this[rejectorName] !== undefined ) {
                // TODO throw exception in this case
                return;
            }

            // TODO expose numberOfInputArguments access for custom rejectors
            this[rejectorName] = createRejector( comparator );
        },

        /**
         * Activate Reject
         * In active mode, Reject is allowed to throw exceptions if the validation in a rejector fails.
         * Note that this is a global configuration that is evaluated at call time of the rejector.
         */
        'on': function () {
            isOn = true;
            return this;
        },

        /**
         * Deactivate Reject
         * In inactive mode, Reject will not throw any exceptions – in other words, Reject has no effect.
         * This mode can be used if you want to use Reject only for testing purposes.
         * Note that this is a global configuration that is evaluated at call time of the rejector.
         */
        'off': function () {
            isOn = false;
            return this;
        }
    };
})();