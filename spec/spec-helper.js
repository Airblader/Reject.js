var testRejector = function (rejector, spec, shouldPass) {
    Object.keys( spec ).forEach( function (current) {
        var test = function () {
            rejector.apply( this, spec[current].concat( description ) );
        };

        it( ( shouldPass ? 'passes' : 'throws' ) + ' for ' + current, function () {
            if( shouldPass ) {
                test();
            } else {
                expect( test ).toThrow( description );
            }
        } );
    } );
};

var testRejectorPasses = function (rejector, spec) {
    return testRejector.call( this, rejector, spec, true );
};

var testRejectorThrows = function (rejector, spec) {
    return testRejector.call( this, rejector, spec, false );
};