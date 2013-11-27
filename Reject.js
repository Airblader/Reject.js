var Reject = (function (undefined) {
    'use strict';

    var RejectException = (function () {
        var RejectException = function (message) {
            this.name = 'RejectException';
            this.message = message;
        };

        RejectException.prototype = new Error();
        RejectException.prototype.toString = function () {
            return this.name + ': ' + (this.message || '<no description>');
        };

        return RejectException;
    })();

    var createRejector = function (comparator) {
        return function (input, description) {
            if( comparator( input ) ) {
                throw new RejectException( description );
            }
        };
    };

    /** use native trim or shim otherwise */
    var trim = String.prototype.trim || function () {
        return this.replace( /^\s+|\s+$/, '' );
    };

    return {
        'RejectException': RejectException,

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
                return;
            }

            this[rejectorName] = createRejector( comparator );
        }
    };
})();