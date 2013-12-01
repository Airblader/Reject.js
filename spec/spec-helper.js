var testRejector = function (rejector, spec, expectThrow) {
    Object.keys( spec ).forEach( function (current) {
        var test = function () {
            rejector.apply( this, spec[current].concat( description ) );
        };

        it( ( expectThrow ? 'throws' : 'passes' ) + ' for ' + current, function () {
            if( expectThrow ) {
                expect( test ).toThrow( description );
            } else {
                test();
            }
        } );
    } );
};