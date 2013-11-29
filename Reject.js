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
        /** Exception thrown if input is rejected by a rejector */
        'RejectException': RejectException,

        /** Will always throw */
        'always': createRejector( function () {
            return true;
        }, 0 ),

        /** Throws if and only if the input is true (strict equality) */
        'ifTrue': createRejector( function (input) {
            return input === true;
        } ),

        /** Throws if and only if the input is false (strict equality) */
        'ifFalse': createRejector( function (input) {
            return input === false;
        } ),

        /** Throws if and only if the input is truthy (lose equality) */
        'ifTruthy': createRejector( function (input) {
            return !!input;
        } ),

        /** Throws if and only if the input is falsy (lose equality) */
        'ifFalsy': createRejector( function (input) {
            return !input;
        } ),

        /** Throws if and only if the length property of the input is 0 */
        'ifEmpty': createRejector( function (input) {
            return input.length === 0;
        } ),

        /** Throws if and only if the length property of the input is not 0 */
        'ifNotEmpty': createRejector( function (input) {
            return input.length !== 0;
        } ),

        /** Throws if the input string is empty or contains only whitespaces */
        'ifBlank': createRejector( function (input) {
            return trim.call( input ).length === 0;
        } ),

        /** Throws if and only if the input is null (strict equality) */
        'ifNull': createRejector( function (input) {
            return input === null;
        } ),

        /** Throws if and only if the input is not null (strict equality) */
        'ifNotNull': createRejector( function (input) {
            return input !== null;
        } ),

        /**
         * Throws if the input is not a numeric value.
         * Note that this allows for string inputs that can be parsed to numbers etc.
         */
        'ifNotNumeric': createRejector( function (input) {
            return isNaN( parseFloat( input ) ) || !isFinite( input );
        } ),

        /**
         * Create (or replace) a rejector.
         * @param rejectorName The name for the new rejector (suggested pattern is 'ifXyz')
         * @param comparator A function that will receive the input as its first and only argument.
         *     It should return a truthy value if and only if the input shall be rejected.
         * @param [numberOfInputArguments] Number of arguments expected by the comparator (defaults to 1).
         */
        'registerRejector': function (rejectorName, comparator/*, numberOfInputArguments*/) {
            this[rejectorName] = createRejector.apply( this, Array.prototype.slice.call( arguments, 1 ) );
            return this;
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