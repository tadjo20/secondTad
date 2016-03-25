Resolutions = new Mongo.Collection('resolutions');

//Meteor.startup(function(){
//    console.log("Startup ");

    //Meteor.call("Personal");
    //Personal(true);

//});

if (Meteor.isClient) {
    Session.setDefault("templateName", "homeTemplate");

    Meteor.subscribe("resolutions");

    Template.body.helpers({
        template_name: function(){
            return Session.get("templateName")
        }
    });


//Template.body.helpers({
//    askThePup:function(){
//        return Resolutions.find();
//    }
//});


    Template.askThePup.helpers({
        resolutions: function () { // return JUST the users entries
            var userIs = Meteor.userId();
            console.log("resolutions");
            return Resolutions.find();
            //return Resolutions.find({createdBy: userIs});

        }
    });

    Template.askThePup.helpers({ //return Not the users entries
        resolutions2: function () {
            var userIs = Meteor.userId();
            return Resolutions.find({createdBy: {$ne: userIs}});
            console.log("you got it " + title + " " + Meteor.userId());

        }
    });

    Template.askThePup.helpers({ //return Not the users entries
        resolutions3: function () {
            var userSR = Accounts.user().emails[0].address;

            if (userSR == "tadjo20@yahoo.com" || userSR == "tadjo") {
                return Resolutions.find();
                console.log("you got it " + title + " " );
                //return [title:"Ho"];
            }
        }
    });

    Template.body.events({
        "submit .new-resolution": function (event) {
            var title = event.target.title.value;
            event.target.title.value = "";
            var body = event.target.body.value;
            event.target.body.value = "";

            var ztitle = "";
            var zbody = "";

            console.log("you got it " + title + " " + body + "   ");
            Meteor.call("addResolutions", title, body, ztitle, zbody);
            return false;

        }
    });
    Template.body.events({
        "submit .super-resolution": function (event) {
            var ztitle = event.target.ztitle.value;
            var zbody = event.target.zbody.value;
            var title = event.target.title.value;
            //event.target.title.value = "";
            var body = event.target.body.value;
            //event.target.body.value = "";
            Meteor.call("updateResolution", this._id, title, body, ztitle, zbody);
            console.log("super event " + title + " " + this._id + "  ");
            return false;
            //user.profile.name = user.services[service].username;
        }
    });



    Template.resolution.events({
        "click .delete": function () {
            Meteor.call("removeResolution", this._id);
        }


    });
    Template.resolution.events({
        "click .delete": function () {
            Meteor.call("removeResolution", this._id);

        }

    });
    Template.navigation.events({
        "click .navBtn":function(){
            //console.log("home clicked " + event.target.innerHTML);

            var navBtn = event.target.innerHTML.toString();

            if(navBtn == "Home"){
                Session.set("templateName", "homeTemplate");

            }else if(navBtn == "Projects"){
                Session.set("templateName", "projectTemplate");

            }else if(navBtn == "Personal"){
                Session.set("templateName", "personalTemplate");
            }

        }
        //home:function(){console.log("home clicked");}
    });

    Template.resolution_Super.events({
        "click .delete": function () {
            Meteor.call("removeResolution", this._id);
        },

        //"click .edit": function (event) {// read text from somewhere and input it into zobieIntro ZobieBodie   NOT IN USE
        //    event.target.title.value = "Test title";
        //    event.target.body.value = "Test body";
        //    console.log("in edit function");
        //
        //}


    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        process.env.MAIL_URL = 'smtp://postmaster%40sandbox653b6630248442e987d71d5440f63ea5.mailgun.org:fe44c318f05b55d2eae87313c6ea7630:@smtp.mailgun.org:587';
        Accounts.config({
            sendVerificationEmail:true
        });


    });
    Meteor.publish("resolutions" , function(){
        return Resolutions.find();
    });
    Meteor.methods({
        sendEmail: function (to, from, subject, text) {
            check([to, from, subject, text], [String]);

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
            });
        }
    });

//smtp://USERNAME:PASSWORD@HOST:PORT/.


    //public static ClientResponse SendSimpleMessage() {
    //  Client client = Client.create();
    //  client.addFilter(new HTTPBasicAuthFilter("api",
    //      "key-ff82908586dac4cd666e19580892f6ff"));
    //  WebResource webResource =
    //      client.resource("https://api.mailgun.net/v3/sandbox653b6630248442e987d71d5440f63ea5.mailgun.org/messages");
    //  MultivaluedMapImpl formData = new MultivaluedMapImpl();
    //  formData.add("from", "Mailgun Sandbox <postmaster@sandbox653b6630248442e987d71d5440f63ea5.mailgun.org>");
    //  formData.add("to", "Steven Etter <tadjo20@yahoo.com>");
    //  formData.add("subject", "Hello Steven Etter");
    //  formData.add("text", "Congratulations Steven Etter, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free.");
    //  return webResource.type(MediaType.APPLICATION_FORM_URLENCODED).
    //      post(ClientResponse.class, formData);
    //}


}

Meteor.methods({
    addResolutions: function (title, body, ztitle, zbody) {
        //console.log("insert " + Meteor.userId() );

        if(body == ""){
            alert("Come on, you gotta ask something first.");
        }else{
            if(title == ""){
                title = "Dogs like titles, yes we do!!!";
            }
            if (zbody == ""){
                zbody = "Woof! That is a tough bone to chew! Let me take a nap and think about it.";
            }
            Resolutions.insert({
                Title: title,
                Body: body,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                zobieIntro: ztitle,
                zobieBodie: zbody
            });
        }

    },
    updateResolution: function (thisId, title, body, ztitle, zbody) {
        Resolutions.upsert((thisId), {$set: {Title: title, Body: body, zobieIntro: ztitle, zobieBodie: zbody}});
    },
    removeResolution: function (thisId) {
        Resolutions.remove(thisId);
    }
});
Meteor.methods({
    secureReturn:  function(userSR){

        if (userSR == "tadjo20@yahoo.com" || userSR == "tadjo") {
            //return Resolutions.find();
            //console.log("you got it sever " + title + " " );
            //return [title:"Ho"];
            //callback(true);
            //retMan(true);
            return true;
        } else{ false}
    }
});

//
//Meteor.methods({
//    Personal:function(){
//        if(setString == "Personel"){
//            console.log("Personal body function " + setString);
//            return true;
//        }else{false}
//
//    }
//});

/*
 Meteor.methods({
 sendEmail: function (to, from, subject, text) {
 check([to, from, subject, text], [String]);

 // Let other method calls from the same client start running,
 // without waiting for the email sending to complete.
 this.unblock();

 Email.send({
 to: to,
 from: from,
 subject: subject,
 text: text
 });
 }
 });

 // In your client code: asynchronously send an email
 Meteor.call('sendEmail',
 'alice@example.com',
 'bob@example.com',
 'Hello from Meteor!',
 'This is a test of Email.send.');

 */