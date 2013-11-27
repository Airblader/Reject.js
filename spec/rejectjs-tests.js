describe( 'ifTrue', function () {
    var description = 'Exception thrown for ifTrue';

    it( 'should pass for false', function () {
        Reject.ifTrue( false, description );
    } );

    it( 'should pass for truthy value other than true', function () {
        var truthy = 'I am truthy';
        expect( truthy ).toBeTruthy();

        Reject.ifTrue( truthy, description );
    } );

    it( 'should pass for falsy value other than false', function () {
        var falsy = '';
        expect( falsy ).toBeFalsy();

        Reject.ifTrue( falsy, description );
    } );

    it( 'should throw for true', function () {
        expect(function () {
            Reject.ifTrue( true, description );
        } ).toThrow( description );
    } );
} );

describe( 'ifFalse', function () {
    var description = 'Exception thrown for ifFalse';

    it( 'should pass for true', function () {
        Reject.ifFalse( true, description );
    } );

    it( 'should pass for truthy value other than true', function () {
        var truthy = 'I am truthy';
        expect( truthy ).toBeTruthy();

        Reject.ifFalse( truthy, description );
    } );

    it( 'should pass for falsy value other than false', function () {
        var falsy = '';
        expect( falsy ).toBeFalsy();

        Reject.ifFalse( falsy, description );
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
        Reject.ifTruthy( false, description );
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

        Reject.ifTruthy( falsy, description );
    } );

    it( 'should throw for true', function () {
        expect(function () {
            Reject.ifTruthy( true, description );
        } ).toThrow( description );
    } );
} );

describe( 'ifFalsy', function () {
    var description = 'Exception thrown for ifFalsy';

    it( 'should pass for true', function () {
        Reject.ifFalsy( true, description );
    } );

    it( 'should pass for truthy value other than true', function () {
        var truthy = 'I am truthy';
        expect( truthy ).toBeTruthy();

        Reject.ifFalsy( truthy, description );
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