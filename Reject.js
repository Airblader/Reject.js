/**
 * Reject.js
 *  Ingo Bürk
 *  http://www.github.com/Airblader/Reject.js
 *
 * Reject.js allows you to easily reject invalid input in your methods. It provides a number
 * of built-in "rejectors" that will throw an exception (RejectException) if the validation fails.
 * You can also pass a custom description to the rejecto which will be used as the exception message,
 * though this is optional (but recommended).
 *
 * Example Usage:
 *
 *  function saveCustomer(customerData) {
 *      Reject
 *          .ifNull( customerData, "customerData must not be null" )
 *          .ifBlank( customerData.getFirstName(), "First name must not be blank" );
 *  }
 *
 *  By calling Reject.off() you can turn off Reject.js altogether (the current state is determined at runtime, so the effect
 *  will be global from the point in time this is called forward), with Reject.on() you can turn it back on. The first is especcialy
 *  useful if you want Reject.js to only work in a development environment, but not in production (since it would require
 *  proper exception handling).
 *  Reject.js is designed to have a fluent API, so all calls can be chained for comfort.
 *
 *  Furthermore, Reject.js allows you to create custom rejectors for more complex situations. Your rejector
 *  can take as many arguments as you want (default 1, if you need more it more the number of arguments needs
 *  to be specified as the last argument) and should return true if the data should be rejected and false otherwise.
 *
 *  Example:
 *
 *  Reject.createRejector( "ifInvalidCustomerData", function (customerData, requiresAddress ) {
 *      if( customerData === null ) {
 *          return true;
 *      }
 *
 *      if( requiresAddress && customerData.getAddress() === undefined ) {
 *          return true;
 *      }
 *
 *      return false;
 *  }, 2 );
 *
 */
var Reject = (function (undefined) {
    'use strict';

    var isOn = true,
        isNot = false;

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
        // TODO add a property "comparator" to access the comparator without throwing (i.e. for chaining)
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
            if( comparator.apply( this, comparatorArgs ) === !isNot ) {
                throw new RejectException( description );
            }

            isNot = false;
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

        /** Throws if and only if the input is truthy (by logically negating the input twice) */
        'ifTruthy': createRejector( function (input) {
            return !!input;
        } ),

        /** Throws if and only if the input is falsy (by logically negating the input) */
        'ifFalsy': createRejector( function (input) {
            return !input;
        } ),

        /** Throws if and only if the length property of the input is 0 */
        'ifEmpty': createRejector( function (input) {
            return input.length === 0;
        } ),

        /** Throws if the input string is empty or contains only whitespaces */
        'ifBlank': createRejector( function (input) {
            return trim.call( input ).length === 0;
        } ),

        /** Throws if and only if the input is null (strict equality) */
        'ifNull': createRejector( function (input) {
            return input === null;
        } ),

        /** Throws if and only if the input is undefined */
        'ifUndefined': createRejector( function (input) {
            return input === undefined;
        } ),

        /**
         * Throws if and only if left and right are equal (strict equality)
         * Note that this will not work with objects (and therefore arrays, …) as the references will be compared.
         */
        'ifEquals': createRejector( function (left, right) {
            return left === right;
        }, 2 ),

        /** Throws if the input is a number literal */
        'ifNumber': createRejector( function (input) {
            return typeof input === 'number';
        } ),

        /**
         * Throws if the input is a numeric value.
         * Note that this allows for string inputs that can be parsed to numbers etc.
         */
        'ifNumeric': createRejector( function (input) {
            return !isNaN( parseFloat( input ) ) && isFinite( input );
        } ),

        /** Throws if the input is a string literal */
        'ifString': createRejector( function (input) {
            return typeof input === 'string';
        } ),

        /** Throws if the input is a boolean (neither true nor false) */
        'ifBoolean': createRejector( function (input) {
            return input === true || input === false;
        } ),

        /** Throws if the input is an array */
        'ifArray': createRejector( function (input) {
            return Array.isArray !== undefined
                ? Array.isArray( input ) : Object.prototype.toString().call( input ) === '[object Array]';
        } ),

        /**
         * Throws if the passed array contains the passed needle.
         * Note that this will only work for Arrays. For objects, use ifContainsKey/ifContainsValue instead.
         */
        'ifContains': createRejector( function (array, needle) {
            return Array.prototype.indexOf.call( array, needle ) !== -1;
        }, 2 ),

        /**
         * Throws if the passed object contains the given key
         * Note that the key has to be a direct property on the object. Properties in the object's prototype
         * are not checked.
         */
        'ifContainsKey': createRejector( function (object, key) {
            return Object.prototype.hasOwnProperty.call( object, key );
        }, 2 ),

        /**
         * Throws if the passed object contains a key with the given value
         * Note that only keys which are direct properties on the object are checked. Properties in the object's
         * prototype are not checked.
         */
        'ifContainsValue': createRejector( function (object, value) {
            for( var key in object ) {
                if( Object.prototype.hasOwnProperty.call( object, key ) && object[key] === value ) {
                    return true;
                }
            }

            return false;
        }, 2 ),

        /** Throws if and only if the provided argument is smaller than the value provided as compareTo */
        'ifLessThan': createRejector( function (argument, compareTo) {
            return argument < compareTo;
        }, 2 ),

        /** Throws if and only if the provided argument is greater than the value provided as compareTo */
        'ifGreaterThan': createRejector( function (argument, compareTo) {
            return argument > compareTo;
        }, 2 ),

        /** Throws if and only if the provided argument is smaller than or equal to the value provided as compareTo */
        'ifLessThanOrEqualTo': createRejector( function (argument, compareTo) {
            return argument <= compareTo;
        }, 2 ),

        /** Throws if and only if the provided argument is greater than or equal to the value provided as compareTo */
        'ifGreaterThanOrEqualTo': createRejector( function (argument, compareTo) {
            return argument >= compareTo;
        }, 2 ),

        /** Throws if and only if the input is positive */
        'ifPositive': createRejector( function (input) {
            return input > 0;
        } ),

        /** Throws if and only if the input is negative */
        'ifNegative': createRejector( function (input) {
            return input < 0;
        } ),

        /**
         * Negates the following rejector
         * By calling not() before a rejector the logic will be inversed.
         * Note that not() will only affect the immediately following rejector.
         */
        'not': function () {
            isNot = true;
            return this;
        },

        /**
         * Create (or replace) a rejector.
         * @param rejectorName The name for the new rejector (suggested pattern is 'ifXyz')
         * @param comparator A function that will receive the input as its first and only argument.
         *     It should return a truthy value if and only if the input shall be rejected.
         * @param [numberOfInputArguments] Number of arguments expected by the comparator (defaults to 1).
         */
        'createRejector': function (rejectorName, comparator/*, numberOfInputArguments*/) {
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