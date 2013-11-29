var description = 'Test-Dummy Description for Assertions';
beforeEach( function () {
    Reject.on();
} );

describe( 'RejectException', function () {
    it( 'can be thrown', function () {
        expect(function () {
            throw new Reject.RejectException( description );
        } ).toThrow( description );
    } );

    it( 'is stringified correctly', function () {
        expect( new Reject.RejectException( 'Dummy' ).toString() ).toBe( 'RejectException: Dummy' );
    } );
} );

describe( 'Reject', function () {
    it( 'can chain rejectors', function () {
        Reject.ifTrue( false ).ifFalse( true );
    } );

    it( 'works with a custom description', function () {
        expect(function () {
            Reject.always( description );
        } ).toThrow( description );
    } );

    it( 'works without a custom description', function () {
        expect(function () {
            Reject.always();
        } ).toThrow( '<no description>' );
    } );

    describe( 'off', function () {
        it( 'prevents throwing', function () {
            Reject.off().always();
        } );

        it( 'is idempotent', function () {
            Reject.off().off().always();
        } );
    } );

    describe( 'on', function () {
        it( 'allows throwing', function () {
            expect(function () {
                Reject.on().always( description );
            } ).toThrow( description );
        } );

        it( 'is idempotent', function () {
            expect(function () {
                Reject.on().on().always( description );
            } ).toThrow( description );
        } );

        it( 'overwrites off', function () {
            expect(function () {
                Reject.off().on().always( description );
            } ).toThrow( description );
        } );
    } );

    describe( 'registerRejector', function () {
        var i = 1,
            rejectorName;
        beforeEach( function () {
            rejectorName = 'custom' + (i++);
        } );

        it( 'can create a new rejector', function () {
            Reject.registerRejector( rejectorName, function (input) {
                return input === 42;
            } );

            Reject[rejectorName]( -1337 );
            expect(function () {
                Reject[rejectorName]( 42, description );
            } ).toThrow( description );
        } );

        it( 'can replace an existing rejector', function () {
            Reject.registerRejector( rejectorName, function () {
                return true;
            }, 0 );

            // sanity check
            expect(function () {
                Reject[rejectorName]( description );
            } ).toThrow( description );

            Reject.registerRejector( rejectorName, function () {
                return false;
            }, 0 );

            Reject[rejectorName]( description );
        } );

        xit( 'can create rejectors with a custom number of input arguments', function () {
            // TODO
        } );
    } );
} );

describe( 'Rejector', function () {
    describe( 'always', function () {
        it( 'throws', function () {
            expect(function () {
                Reject.always( description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifTrue', function () {
        it( 'passes for false', function () {
            Reject.ifTrue( false );
        } );

        it( 'passes for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            Reject.ifTrue( truthy );
        } );

        it( 'passes for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            Reject.ifTrue( falsy );
        } );

        it( 'throws for true', function () {
            expect(function () {
                Reject.ifTrue( true, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifFalse', function () {
        it( 'passes for true', function () {
            Reject.ifFalse( true );
        } );

        it( 'passes for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            Reject.ifFalse( truthy );
        } );

        it( 'passes for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            Reject.ifFalse( falsy );
        } );

        it( 'throws for false', function () {
            expect(function () {
                Reject.ifFalse( false, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifTruthy', function () {
        var description = 'Exception thrown for ifTruthy';

        it( 'passes for false', function () {
            Reject.ifTruthy( false );
        } );

        it( 'throws for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            expect(function () {
                Reject.ifTruthy( truthy, description );
            } ).toThrow( description );
        } );

        it( 'passes for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            Reject.ifTruthy( falsy );
        } );

        it( 'throws for true', function () {
            expect(function () {
                Reject.ifTruthy( true, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifFalsy', function () {
        it( 'passes for true', function () {
            Reject.ifFalsy( true );
        } );

        it( 'passes for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            Reject.ifFalsy( truthy );
        } );

        it( 'throws for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            expect(function () {
                Reject.ifFalsy( falsy, description );
            } ).toThrow( description );
        } );

        it( 'throws for false', function () {
            expect(function () {
                Reject.ifFalsy( false, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifEmpty', function () {
        it( 'passes for non-empty string', function () {
            Reject.ifEmpty( 'I am not empty' );
        } );

        it( 'passes for non-empty array', function () {
            Reject.ifEmpty( ['I', 'am', 'not', 'empty'] );
        } );

        it( 'throws for empty string', function () {
            expect(function () {
                Reject.ifEmpty( '', description );
            } ).toThrow( description );
        } );

        it( 'throws for empty array', function () {
            expect(function () {
                Reject.ifEmpty( [], description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifNotEmpty', function () {
        it( 'passes for empty string', function () {
            Reject.ifNotEmpty( '' );
        } );

        it( 'passes for empty array', function () {
            Reject.ifNotEmpty( [] );
        } );

        it( 'throws for non-empty string', function () {
            expect(function () {
                Reject.ifNotEmpty( 'I am not empty', description );
            } ).toThrow( description );
        } );

        it( 'throws for non-empty array', function () {
            expect(function () {
                Reject.ifNotEmpty( ['I', 'am', 'not', 'empty'], description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifBlank', function () {
        it( 'passes for non-empty string', function () {
            Reject.ifBlank( 'I am not empty' );
        } );

        it( 'passes for non-empty string with leading whitespace', function () {
            Reject.ifBlank( ' I am not empty' );
        } );

        it( 'passes for non-empty string with trailing whitespace', function () {
            Reject.ifBlank( 'I am not empty ' );
        } );

        it( 'throws for empty string', function () {
            expect(function () {
                Reject.ifBlank( '', description );
            } ).toThrow( description );
        } );

        it( 'throws for non-empty string with whitespaces only', function () {
            expect(function () {
                Reject.ifBlank( ' ', description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifNull', function () {
        it( 'passes for a value other than null', function () {
            Reject.ifNull( 'I am not null' );
        } );

        it( 'throws for null', function () {
            expect(function () {
                Reject.ifNull( null, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifNotNull', function () {
        it( 'passes for null', function () {
            Reject.ifNotNull( null );
        } );

        it( 'throws for a value other than null', function () {
            expect(function () {
                Reject.ifNotNull( 'I am not null', description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifNotNumeric', function () {
        // Test cases taken from http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric

        var shouldPass = {
            'a negative string literal': '-10',
            'the zero string literal': '0',
            'a positive string literal': '5',
            'a negative number literal': -16,
            'the zero literal': 0,
            'a positive number literal': 32,
            'an octal number string literal': '040',
            'an octal number literal': 0144,
            'a hexadecimal string literal': '0xFF',
            'a hexadecimal number literal': 0xFFF,
            'a negative floating point string literal': '-1.6',
            'a positive floating point string literal': '4.536',
            'a negative floating point number literal': -2.6,
            'a positive floating point number literal': 3.1415,
            'an exponential notation number literal': 8e5,
            'an exponential notation string literal': '123e-2'
        };

        Object.keys( shouldPass ).forEach( function (current) {
            it( 'passes for ' + current, function () {
                Reject.ifNotNumeric( shouldPass[current] );
            } );
        } );

        var shouldFail = {
            'an empty string': '',
            'an empty string with whitespaces': '    ',
            'a string with tabs': '\t\t',
            'an alphanumeric string': 'abc123',
            'a string without any digits': 'ajnsovppjc',
            'true': true,
            'false': false,
            'a string with a trailing floating point number': 'bcdef5.2',
            'a string with a leading floating point number': '7.2aspa',
            'undefined': undefined,
            'null': null,
            'NaN': NaN,
            'Infinity': Infinity,
            'POSITIVE_INFINITY': Number.POSITIVE_INFINITY,
            'NEGATIVE_INFINITY': Number.NEGATIVE_INFINITY,
            'a date object': new Date( 2012, 8, 22 ),
            'an empty object': {},
            'an empty array': [],
            'a function': function () {
            }
        };

        Object.keys( shouldFail ).forEach( function (current) {
            it( 'throws for ' + current, function () {
                expect(function () {
                    Reject.ifNotNumeric( shouldFail[current], description );
                } ).toThrow( description );
            } );
        } );
    } );
} );