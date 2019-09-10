/* global User */
describe( 'AuthController', () => {
  // before( done => {
  //   sails.testData.login( done );
  // } );

  it( 'signin: should test signin', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .post( '/auth/signin' )
      .send( {
        email: sails.testData.fixtures.user[0].email,
        password: sails.testData.testUser.password
      } )
      .expect( 200 )
      .then( res => {
        sails.testData.should( res.body.token ).not.be.null();
        sails.testData.should( res.body.user ).have.property( 'email', sails.testData.fixtures.user[0].email );
      } )
      .finally( done );
  } );

  it( 'signup: should test the signup process', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .post( '/auth/signup' )
      .send( {
        email: sails.testData.testUser.email,
        username: sails.testData.testUser.username
      } )
      .expect( 200 )
      .then( async res => {
        const testUser = await User.findOne( {
          email: sails.testData.testUser.email,
          isEnabled: true
        } );

        sails.testData.should( testUser ).not.be.null();
        sails.testData.should( testUser.email ).equal( sails.testData.testUser.email );
      } )
      .finally( done );
  } );

  it( 'sendMagicLink: should test DB password change of magic link.', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .get( '/auth/sendMagicLink/?e=' + encodeURI( sails.testData.fixtures.user[0].email ) )
      .expect( 200 )
      .then( async res => {
        const foundUser = await User.findOne( { email: sails.testData.fixtures.user[0].email } );

        sails.testData.testUser.password.should.not.equal( foundUser.password );

        // Reset the fixtures
        await sails.testData.clearFixtures();
      } )
      .finally( done );
  } );
} );
