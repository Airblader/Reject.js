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
            // TODO use numberOfInputArguments = 0 when it is exposed
            Reject.registerRejector( rejectorName, function () {
                return true;
            } );

            // sanity check
            expect(function () {
                Reject[rejectorName]( true, description );
            } ).toThrow( description );

            Reject.registerRejector( rejectorName, function () {
                return false;
            }, false );

            Reject[rejectorName]( true, description );
        } );

        it( 'can not replace an existing rejector in safe mode', function () {
            // TODO use numberOfInputArguments = 0 when it is exposed
            Reject.registerRejector( rejectorName, function () {
                return true;
            } );

            // sanity check
            expect(function () {
                Reject[rejectorName]( true, description );
            } ).toThrow( description );

            Reject.registerRejector( rejectorName, function () {
                return false;
            }, true );

            expect(function () {
                Reject[rejectorName]( true, description );
            } ).toThrow( description );
        } );

        xit( 'can create rejectors with a custom number of input arguments', function () {
            // TODO
        } );
    } );
} );

describe( 'Rejector', function () {
    describe( 'always', function () {
        it( 'should throw', function () {
            expect(function () {
                Reject.always( description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifTrue', function () {
        it( 'should pass for false', function () {
            Reject.ifTrue( false );
        } );

        it( 'should pass for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            Reject.ifTrue( truthy );
        } );

        it( 'should pass for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            Reject.ifTrue( falsy );
        } );

        it( 'should throw for true', function () {
            expect(function () {
                Reject.ifTrue( true, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifFalse', function () {
        it( 'should pass for true', function () {
            Reject.ifFalse( true );
        } );

        it( 'should pass for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            Reject.ifFalse( truthy );
        } );

        it( 'should pass for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            Reject.ifFalse( falsy );
        } );

        it( 'should throw for false', function () {
            expect(function () {
                Reject.ifFalse( false, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifTruthy', function () {
        var description = 'Exception thrown for ifTruthy';

        it( 'should pass for false', function () {
            Reject.ifTruthy( false );
        } );

        it( 'should throw for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            expect(function () {
                Reject.ifTruthy( truthy, description );
            } ).toThrow( description );
        } );

        it( 'should pass for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            Reject.ifTruthy( falsy );
        } );

        it( 'should throw for true', function () {
            expect(function () {
                Reject.ifTruthy( true, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifFalsy', function () {
        it( 'should pass for true', function () {
            Reject.ifFalsy( true );
        } );

        it( 'should pass for truthy value other than true', function () {
            var truthy = 'I am truthy';
            expect( truthy ).toBeTruthy();

            Reject.ifFalsy( truthy );
        } );

        it( 'should throw for falsy value other than false', function () {
            var falsy = '';
            expect( falsy ).toBeFalsy();

            expect(function () {
                Reject.ifFalsy( falsy, description );
            } ).toThrow( description );
        } );

        it( 'should throw for false', function () {
            expect(function () {
                Reject.ifFalsy( false, description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifEmpty', function () {
        it( 'should pass for non-empty string', function () {
            Reject.ifEmpty( 'I am not empty' );
        } );

        it( 'should pass for non-empty array', function () {
            Reject.ifEmpty( ['I', 'am', 'not', 'empty'] );
        } );

        it( 'should throw for empty string', function () {
            expect(function () {
                Reject.ifEmpty( '', description );
            } ).toThrow( description );
        } );

        it( 'should throw for empty array', function () {
            expect(function () {
                Reject.ifEmpty( [], description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifNotEmpty', function () {
        it( 'should pass for empty string', function () {
            Reject.ifNotEmpty( '' );
        } );

        it( 'should pass for empty array', function () {
            Reject.ifNotEmpty( [] );
        } );

        it( 'should throw for non-empty string', function () {
            expect(function () {
                Reject.ifNotEmpty( 'I am not empty', description );
            } ).toThrow( description );
        } );

        it( 'should throw for non-empty array', function () {
            expect(function () {
                Reject.ifNotEmpty( ['I', 'am', 'not', 'empty'], description );
            } ).toThrow( description );
        } );
    } );

    describe( 'ifBlank', function () {
        it( 'should pass for non-empty string', function () {
            Reject.ifBlank( 'I am not empty' );
        } );

        it( 'should pass for non-empty string with leading whitespace', function () {
            Reject.ifBlank( ' I am not empty' );
        } );

        it( 'should pass for non-empty string with trailing whitespace', function () {
            Reject.ifBlank( 'I am not empty ' );
        } );

        it( 'should throw for empty string', function () {
            expect(function () {
                Reject.ifBlank( '', description );
            } ).toThrow( description );
        } );

        it( 'should throw for non-empty string with whitespaces only', function () {
            expect(function () {
                Reject.ifBlank( ' ', description );
            } ).toThrow( description );
        } );
    } );
} );