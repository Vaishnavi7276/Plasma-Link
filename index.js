const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const Registerlogin = require("./models/mongodbUser.js");
const Hregisterlogin = require("./models/mongodbHospital.js");
const D_request = require("./models/mongodbDRegister.js");
const Contact = require("./models/mongodbContact.js");

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const session = require('express-session');
const cors = require('cors');
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // use secure: false if you are not using HTTPS
}));

mongoose.connect("mongodb://localhost:27017/PlasmaLink", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("connected to db");
    })
    .catch(err => {
        console.log(err);
    })


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));


//.....home page......
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/plasma_donation", (req, res) => {
    res.render("plasma_donation.ejs");
});

app.get("/blood_donation", (req, res) => {
    res.render("blood_donation.ejs");
});

//....hospital-login-register.....

app.get("/Hlogin", (req, res) => {
    res.render("hospitalLogin.ejs");
});

app.get("/HRegister", (req, res) => {
    res.render("hospitalRegister.ejs");
});

app.get("/h_logout", (req, res) => {
    res.render("home");
})


app.post("/hospitalRegister", async (req, res) => {
    try {
        const newUser = new Hregisterlogin(req.body);  // Using the correct model name here
        await newUser.save();
        res.render("hospitalDashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering new user");
    }
});


let emailid;
app.post("/hospitalLogin", async (req, res) => {

    try {
        const hospital = await Hregisterlogin.findOne({ email: req.body.email });
        if (hospital && hospital.password === req.body.password) {
            // Fetch data for the hospital dashboard here
            emailid = hospital.email;
            const donors = await D_request.find({}); // Assuming D_request is your model for donor registrations
            // Render the hospitalDashboard view and pass the donors data
            res.render("hospitalDashboard", { donors, error: null });
        } else {
            res.send("Wrong Password or Hospital ID");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Login Error");
    }
});


//....user dashboard.....
// app.get("/donation_request", (req, res) => {
//     res.render("donation_request.ejs");
// });

app.post("/donation_request", async (req, res) => {
    try {
        const newDonor = new D_request({
            donorname: req.body.donorname,
            donation_for: req.body.donation_for,
            gender: req.body.gender,
            bloodtype: req.body.bloodtype,
            contact: req.body.contact,
            address: req.body.address,
            email: req.body.email,
        });

        const success = await newDonor.save();

        if (success) {
            res.render("donation_request.ejs");
        }

    }
    catch (error) {
        console.error(error);
    }
});

app.get("/d_register", (req, res) => {
    res.render("home.ejs")
})
//....hospitalDashboard....
//inbox
app.get("/h_inbox", async (req, res) => {
    try {
        // Assuming D_request is your model for donor registrations
        const donors = await D_request.find({}); // Retrieve all donor registrations from the database
        console.log(donors);
        res.render("h_inbox", { donors, error: null }); // Pass the donors data to the template
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching donor data");
    }
});


//.....contact.....
app.get("/contact", (req, res) => {
    res.render("contact");
})

//mail response 
const filePath = path.join(__dirname, '../plasmalink/views/h_inbox_accepted.ejs');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "plasmalinkweb@gmail.com",
        pass: "---"
    }
});


app.post("/sendMail", async (req, res) => {
    try {
        const donorEmail = req.body.email;

        // Fetch hospital details
        const hospital = await Hregisterlogin.findOne({ email: emailid });

        // Check if hospital is found
        if (!hospital) {
            return res.status(404).send("Hospital not found");
        }

        const mailOptions = {
            from: "plasmalinkweb@gmail.com",
            to: donorEmail,
            subject: "Plasma/Blood Donation",
            html: `
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; max-width: 600px; width: 100%; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td bgcolor="#ffffff" style="padding: 20px;">
                                        <h3 style="color: #333;">You have a donation request from ${hospital.hospitalname}</h3>
                                        <p><strong>Hospital Name:</strong> ${hospital.hospitalname}</p>
                                        <p><strong>Hospital ID:</strong> ${hospital.hospitalid}</p>
                                        <p><strong>Email:</strong> ${hospital.email}</p>
                                        <p><strong>Address:</strong> ${hospital.address}</p>
                                        <p><strong>City:</strong> ${hospital.city}</p>
                                        <p><strong>Google-Map :</strong> ${locationlink}</p>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).send("Email successful");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


//.....contact.....
app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/contactSave", async (req, res) => {
    try {
        const newMsg = new Contact(req.body);
        await newMsg.save();

        const emailContent = `
        <div style=" border-radius: 10px;">
            <div style="background-color: #f0f0f0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px;">
                <h2>Contact Details</h2>
                <div>
                    <p><strong>Name:</strong> ${req.body.name}</p>
                    <p><strong>Email:</strong> ${req.body.email}</p>
                    <p><strong>Phone:</strong> ${req.body.phone}</p>
                    <p><strong>Message:</strong> ${req.body.message}</p>
                </div>
            </div>
        </div>
    `;
        const mailOptions = {
            from: "plasmalinkweb@gmail.com",
            to: "plasmalinkweb@gmail.com",
            subject: "New Contact Message",
            html: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent:", info.response);
                res.status(200).send("Email sent successfully");
            }
        });

        res.render("home");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving contact data");
    }
});

//geolocation
const NodeGeocoder = require('node-geocoder');

let locationlink;
//geolocation
const geocoder = NodeGeocoder({
    provider: 'openstreetmap', // Nominatim provider
    userAgent: 'GetLoc', // User agent string
});

// Geolocation endpoint
app.get("/geolocation", async (req, res) => {
    try {
        const locationName = req.query.location; // Get location name from query parameter

        // Getting location details
        const location = await geocoder.geocode(locationName);

        if (location && location.length > 0) {
            const latitude = location[0].latitude;
            const longitude = location[0].longitude;
            
            // Log latitude and longitude to console
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            locationlink = `https:/www.google.com/maps?q=${latitude},${longitude}`;

            // Sending response with location details
            res.json({
                address: location[0].formattedAddress,
                latitude: latitude,
                longitude: longitude
            });
        } else {
            res.status(404).json({ error: "Location not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(8080, () => {
    console.log("Port connected");
});
