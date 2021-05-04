// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// Configure chai
chai.use(chaiHttp);
chai.should();

// Globals
// Note : Change them as per requirement
const firstName =  "ft1"
const lastName = "lt1"
const email = "jitendert4@upgrad.com"
const password = "password@123"
const mobileNo = "4"

// Sign Up Test Case
describe("Authorization", () => {

    // ++ Sign Up New User
    it("Sign Up New User", (done) => {
        chai.request(app)
            .post('/hirewheels/v1/users')
            .set('content-type', 'application/json')
            .send({firstName, lastName, email, password, mobileNo})
            .end((err, res) => {

                // Check Expected Results
                res.should.have.status(200);

                // Test Case Done
                done();
            });
    });

    // -- Sign Up New User => Email Already Exists
    it("Sign Up New User", (done) => {
        chai.request(app)
            .post('/hirewheels/v1/users')
            .set('content-type', 'application/json')
            .send({firstName, lastName, email, password, mobileNo})
            .end((err, res) => {

                // Check Expected Results
                res.should.have.status(400);

                // Test Case Done
                done();
            });
    });

});

// Sign Up Test Case
describe("Login", () => {

    // ++ Login
    it("Login", (done) => {
        chai.request(app)
            .post('/hirewheels/v1/users/access-token')
            .set('content-type', 'application/json')
            .send({email, password})
            .end((err, res) => {

                // Check Expected Results
                res.should.have.status(200);

                // Test Case Done
                done();
            });
    });

    // -- Login => User Not Registered
    it("Login", (done) => {
        chai.request(app)
            .post('/hirewheels/v1/users/access-token')
            .set('content-type', 'application/json')
            .send({email, password: "wrong_password"})
            .end((err, res) => {

                // Check Expected Results
                res.should.have.status(401);

                // Test Case Done
                done();
            });
    });

    // -- Login => Unauthorized User
    it("Login", (done) => {
        chai.request(app)
            .post('/hirewheels/v1/users/access-token')
            .set('content-type', 'application/json')
            .send({email:"wrong_email", password:"wrong_password"})
            .end((err, res) => {

                // Check Expected Results
                res.should.have.status(404);

                // Test Case Done
                done();
            });
    });
});