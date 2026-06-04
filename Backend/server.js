require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");

const path = require('path');
const fs = require("fs");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({ origin: "http://localhost:5173",credentials: true}));
app.use(express.json());

// ================= DATABASE =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "manageairport"
});

db.connect((err) => {
    if (err) {
        console.log(" DB ERROR:", err);
    } else {
        console.log("Database connected");
    }
});

// ================= JWT FUNCTIONS =================
function createToken(user) {
    return jwt.sign(
        { id: user.userID, email: user.email ,role: user.role},"SECRET_KEY",{ expiresIn: "7d" }
      );
}

function sendToken(user, res) {
    const token = createToken(user);
    
    res.json({
        success: true,
        token,
        user: {
            userID: user.userID,
            email: user.email,
            role: user.role
        }
    });
}

// ================= AUTHENTICATION MIDDLEWARE =================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, "SECRET_KEY", (err, user) => {
        if (err) {
            console.log(" Token verification error:", err.message);
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        
        req.user = user; // Attach user to request object
        next();
    });
}

// ================= SIGNUP (EMAIL/PASSWORD) =================
app.post("/CreateAccount", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
   
    if (err) {
      console.error("❌ SELECT Error in CreateAccount:", err);
      return res.status(500).json({ error: "Database error during email check" });
    }

    if (result && result.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userID = uuidv4();
    const hash = await bcrypt.hash(password, 10);

    db.query("INSERT INTO users (userID, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [userID, email, hash, "passenger"],(insertErr, insertResult) => {  
        if (insertErr) {
          console.error(" INSERT Error in CreateAccount:", insertErr);
          return res.status(500).json({ error: "Failed to create user in database" });
        }
        const user = {
          userID,
          email,
          role: "passenger"
        };
        return sendToken(user, res); 
      }
    );
  });
});

// ================= GOOGLE LOGIN =================
app.post("/google", async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: "No credential provided" });
    }
    try {
        console.log(" Google token received");

        const googleRes = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );

        const { email, name } = googleRes.data;

        console.log("Google email:", email);

        if (!email) {
            return res.status(400).json({ error: "Invalid Google token" });
        }

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, result) => {
                if (err) {
                    console.log(" SELECT ERROR:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                if (result.length > 0) {
                    console.log("USER EXISTS");
                    return sendToken(result[0], res);
                }

                const userID = uuidv4();

                db.query(
                    `INSERT INTO users (userID, email, password_hash, role)
                     VALUES (?, ?, NULL, ?)`,
                    [userID, email, "passenger" || email.split('@')[0]],
                    (err, result2) => {
                        if (err) {
                            console.log(" GOOGLE INSERT ERROR:", err);
                            return res.status(500).json({ error: "Failed to create user" });
                        }
                        const newUser = { userID,email,role: "passenger"};
                        return sendToken(newUser, res);
                    }
                );
            }
        );
    } catch (err) {
        console.log("GOOGLE ERROR:", err.response?.data || err.message);
        res.status(400).json({ error: "Google authentication failed" });
    }
});

// ================= LOGIN (EMAIL/PASSWORD) =================
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?", 
        [email], 
        async (err, result) => {
            if (err) {
                console.log(" SELECT ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (result.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const user = result[0];

            if (!user.password_hash) {
                return res.status(400).json({
                    error: "Please login with Google",
                    useGoogle: true
                });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({ error: "Wrong password" });
            }

            console.log("LOGIN SUCCESS:", email);
            return sendToken(user, res);
        }
    );
});

// ================= SEARCH FLIGHTS =================
app.post("/search", (req, res) => {
    const {from,to,departDate, arrivalDate,passengers,cabinClass,tripType,legs} = req.body;
  
    // Helper function to format date
    function formatDate(date) {
        if (!date) return null;
        
        // If already in YYYY-MM-DD format
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
        
        // Try to parse DD-MM-YYYY
        const parts = date.split("-");
        if (parts.length === 3 && parts[0].length === 2) {
            const [d, m, y] = parts;
            return `${y}-${m}-${d}`;
        }
        
        // Try to parse as Date object
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
            return parsedDate.toISOString().split('T')[0];
        }
        
        return date;
    }

    if (tripType === "oneway") {
        const formattedDepartDate = formatDate(departDate);
        
        if (!formattedDepartDate) {
            return res.status(400).json({ error: "Invalid departure date" });
        }

        let query = `
            SELECT * 
            FROM flights
            WHERE origin LIKE ?
            AND destination LIKE ?
            AND DATE(departure_time) >= ?
        `;

        const params = [
            `%${from}%`,
            `%${to}%`,
            formattedDepartDate
        ];

        // filter cabin class
        if (cabinClass && cabinClass !== "Economy") {
            query += ` AND cabin_class = ?`;
            params.push(cabinClass);
        }

        query += ` ORDER BY price ASC`;

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("❌ Search error:", err);
                return res.status(500).json({ error: "Server error" });
            }

            const formattedFlights = results.map(flight => ({
                id: flight.flightID || flight.flight_id,
                airline: flight.airline,
                flight_number: flight.flight_number,
                origin: flight.origin,
                destination: flight.destination,
                departure_time: flight.departure_time
                    ? new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "00:00",
                arrival_time: flight.arrival_time
                    ? new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "00:00",
                price: Number(flight.price) || 0,
                cabinClass: flight.cabin_class || "Economy",
                available_seats: flight.available_seats || 100,
                duration: flight.duration_minutes || 0,
                stops: flight.stops || 0
            }));

            res.json({
                success: true,
                flights: formattedFlights,
                tripType,
                total: formattedFlights.length
            });
        });
    } 
    else if (tripType === "roundtrip") {
        const formattedDepartDate = formatDate(departDate);
        const formattedReturnDate = formatDate(arrivalDate);
        
        if (!formattedDepartDate || !formattedReturnDate) {
            return res.status(400).json({ error: "Invalid dates provided" });
        }

        // Going flight (A → B)
        const goingQuery = `
            SELECT *
            FROM flights
            WHERE origin LIKE ?
            AND destination LIKE ?
            AND DATE(departure_time) >= ?
            ORDER BY price ASC
        `;

        const goingParams = [
            `%${from}%`,
            `%${to}%`,
            formattedDepartDate
        ];

        // Return flight (B → A)
        const returnQuery = `
            SELECT *
            FROM flights
            WHERE origin LIKE ?
            AND destination LIKE ?
            AND DATE(departure_time) >= ?
            ORDER BY price ASC
        `;

        const returnParams = [
            `%${to}%`,
            `%${from}%`,
            formattedReturnDate
        ];

        db.query(goingQuery, goingParams, (err, goingResults) => {
            if (err) {
                console.error("❌ Going flight error:", err);
                return res.status(500).json({ error: "Server error (going flight)" });
            }

            db.query(returnQuery, returnParams, (err, returnResults) => {
                if (err) {
                    console.error("❌ Return flight error:", err);
                    return res.status(500).json({ error: "Server error (return flight)" });
                }

                res.json({
                    success: true,
                    tripType: "roundtrip",
                    going: goingResults,
                    return: returnResults
                });
            });
        });
    }
    else if (tripType === "multicity" && legs && Array.isArray(legs)) {
        const flightPromises = legs.map(leg => {
            return new Promise((resolve, reject) => {
                const formattedDate = formatDate(leg.date);
                
                if (!formattedDate) {
                    resolve([]);
                    return;
                }

                const query = `
                    SELECT 
                        f.*,
                        COALESCE(a1.city, f.origin) AS origin_city,
                        COALESCE(a2.city, f.destination) AS destination_city
                    FROM flights f
                    LEFT JOIN airports a1 ON f.origin_airport_id = a1.airport_id
                    LEFT JOIN airports a2 ON f.destination_airport_id = a2.airport_id
                    WHERE COALESCE(a1.city, f.origin) LIKE ?
                    AND COALESCE(a2.city, f.destination) LIKE ?
                    AND DATE(f.departure_time) >= ?
                    ORDER BY f.price ASC
                `;

                const params = [
                    `%${leg.from}%`,
                    `%${leg.to}%`,
                    formattedDate
                ];

                db.query(query, params, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.map(flight => ({
                            id: flight.flight_id || flight.flightID,
                            airline: flight.airline_name || flight.airline,
                            flight_number: flight.flight_number,
                            origin: flight.origin_city || flight.origin,
                            destination: flight.destination_city || flight.destination,
                            departure_time: flight.departure_time
                                ? new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "00:00",
                            arrival_time: flight.arrival_time
                                ? new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "00:00",
                            price: Number(flight.price) || 0,
                            cabinClass: flight.cabin_class || "Economy"
                        })));
                    }
                });
            });
        });

        Promise.all(flightPromises)
            .then(allFlights => {
                res.json({
                    success: true,
                    tripType: "multicity",
                    flights: allFlights.flat()
                });
            })
            .catch(err => {
                console.error("❌ Multi-city error:", err);
                res.status(500).json({ error: "Server error" });
            });
    }
    else {
        res.status(400).json({ error: "Invalid trip type or missing parameters" });
    }
});
// ================= SAVE PERSONAL INFORMATION (PROTECTED ROUTE) =================
app.post("/savePersonalInformation", authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { flight, passengers, contact } = req.body;

        console.log("=== SAVING TO DATABASE ===");
        console.log("User ID:", user_id);
        console.log("Flight ID:", flight?.id);

        // ================= VALIDATION =================
        if (!flight || !flight.id) {
            return res.status(400).json({
                success: false,
                error: "Missing flight information"
            });
        }

        if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Missing passenger information"
            });
        }

        // ================= CREATE BOOKING =================
        const bookingID = uuidv4();

        const queryAsync = (sql, values) => {
            return new Promise((resolve, reject) => {
                db.query(sql, values, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        };

        await queryAsync(
            "INSERT INTO booking (reservationID, userID, flightID) VALUES (?, ?, ?)",
            [bookingID, user_id, flight.id]
        );
        console.log("✅ Booking saved:", bookingID);

        // ================= SAVE EACH PASSENGER =================
        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            const passengerID = uuidv4();
            
            // استخراج البيانات مباشرة (بدون أي شروط معقدة)
            const firstName = p.firstname;
            const lastName = p.lastname;
            const passportNumber = p.passportNumber;
            const dateOfBirth = p.dateofbirth;
            const passportExpiryDate = p.passportExpiryDate;
            
            // معالجة issuingCountry - استخراج الاسم من الكائن
            let issuingCountry = p.issuingCountry;
            if (issuingCountry && typeof issuingCountry === 'object') {
                issuingCountry = issuingCountry.name || issuingCountry.code || "Algeria";
            }
            
            
            let nationality = p.nationality;
            if (nationality && typeof nationality === 'object') {
                nationality = nationality.name || nationality.code || "Algeria";
            }
            
       
            console.log(`\n--- Passenger ${i + 1} ---`);
            console.log("firstName:", firstName);
            console.log("lastName:", lastName);
            console.log("passportNumber:", passportNumber);
            console.log("dateOfBirth:", dateOfBirth);
            console.log("passportExpiryDate:", passportExpiryDate);
            console.log("issuingCountry:", issuingCountry);
            console.log("nationality:", nationality);
            
            // تحويل تاريخ الميلاد من DD-MM-YYYY إلى YYYY-MM-DD
            let formattedDateOfBirth = null;
            if (dateOfBirth) {
                const parts = dateOfBirth.split('-');
                if (parts.length === 3) {
                    formattedDateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else {
                    formattedDateOfBirth = dateOfBirth;
                }
            }
            
            
            let formattedExpiryDate = null;
            if (passportExpiryDate) {
                const parts = passportExpiryDate.split('-');
                if (parts.length === 3) {
                    formattedExpiryDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else {
                    formattedExpiryDate = passportExpiryDate;
                }
            }
            
            
            const sql = `INSERT INTO passengers (passengerID,user_id, reservation_id,first_name,last_name,
                    passport_number,date_of_birth,passport_Expiry_Date,issuing_Country,nationality) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          
            const values = [
                passengerID,
                user_id,
                bookingID,
                firstName,
                lastName,
                passportNumber,
                formattedDateOfBirth,
                formattedExpiryDate,
                issuingCountry,
                nationality
            ];
            
            console.log("SQL Values:", values);
            
            await queryAsync(sql, values);
            console.log(` Passenger ${i + 1} saved`);
        }

        console.log("\n ALL PASSENGERS SAVED SUCCESSFULLY");

        return res.json({
            success: true,
            message: "Booking and passengers saved successfully",
            bookingID,
            passengersSaved: passengers.length
        });

    } catch (error) {
        console.log(" ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Server error while saving booking",
            details: error.message
        });
    }
});

// ================= SEATS =================

app.get("/seats", (req, res) => {
  const { flightId } = req.query;

  if (!flightId) {
    return res.status(400).json({
      success: false,
      error: "flightId is required"
    });
  }

  const sql = ` SELECT seat_number, is_booked FROM seats WHERE flightID = ? `;

  db.query(sql, [flightId], (err, result) => {
    if (err) {
      console.log("❌ DB ERROR:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json({
      success: true,
      seats: result
    });
  });
});

// ================= RESERVE SEAT =================
app.post("/reserveSeat", (req, res) => {
  const { reservationID, seatnumber } = req.body;

  if (!reservationID || !seatnumber) {
    return res.status(400).json({
      success: false,
      error: "Missing data"
    });
  }

  const query = `
    UPDATE passengers 
    SET seat_number = ?  
    WHERE reservation_id = ?
  `;

  db.query(query, [seatnumber, reservationID], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true
    });
  });
});

//============================== MAKE PAYMENTS ======================
app.post("/createPaymentIntent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});
//=============== CONFIRM PAYMENT ==================

app.post("/confirmBooking", authenticateToken, async (req, res) => {
  try {
    const {reservationID,selectedSeats } = req.body;
    for (let seat of selectedSeats) {
      await queryAsync(  `  UPDATE seats  SET is_booked = 1  WHERE seat_number = ?  `,  [seat]);
    }
    res.json({
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
});

// ================= VERIFY PAYMENT STATUS =================
app.get("/verifyPayment/:paymentIntentId", authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      success: true,
      status: paymentIntent.status,
      paymentIntent: paymentIntent
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

 //================== COMPLETE PAYMENT AND CHANGE BOOKING STATUS ===========
app.post("/confirm-payment", async (req, res) => {
  try {

    const { bookingID } = req.body;

    const ticketid = uuidv4();

    const ticketNumber =
      "TKT-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // update booking
    db.query(
      "UPDATE booking SET status='confirmed' WHERE reservationID=?",
      [bookingID]
    );

    // create ticket
    const sql =
      "INSERT INTO tickets (ticketID, reservationID, ticket_number) VALUES (?, ?, ?)";

    db.query(sql, [ticketid, bookingID, ticketNumber]);

    res.json({
      ticketId: ticketid
    });

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//========== E-TICKET ===============
//========== E-TICKET ===============
app.get("/ticket/:id", (req, res) => {

  const ticketId = req.params.id;

  const sql = `
    SELECT  
      t.ticketID,
      t.ticket_number,
      p.first_name,
      p.last_name,
      f.flight_number,
      f.origin,
      f.destination,
      f.departure_time
    FROM tickets t
    INNER JOIN booking b ON t.reservationID = b.reservationID
    INNER JOIN passengers p ON p.reservation_id = b.reservationID
    INNER JOIN flights f ON b.flightID = f.flightID
    WHERE t.ticketID = ?;
  `;

  db.query(sql, [ticketId], (err, result) => {
    if (err) return res.sendStatus(500);

    res.json(result[0]); 
  });
});

//================= SEE FLIGHT STATUS =========
app.get("/flightStatus/:flightNumber", (req, res) => {
  const { flightNumber } = req.params;

  const sql = `SELECT  flightID, flight_number,origin,destination,departure_time,arrival_time,status FROM flights
  WHERE flight_number = ? LIMIT 1`;
  db.query(sql, [flightNumber], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.json(result[0]);
  });
});

//============ GENERATE E-Ticket ===========
app.get("/ticket/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM tickets WHERE ticketID = ?",[id],(err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result[0]);
    }
  );
});


// ################################## ADMIN SIDE ########################
//======================== BRING FLIGHTS DATA ======================
app.get('/flightsData', (req, res) => {
    try {
        const getdata = `SELECT * FROM flights`;
        db.query(getdata, (err, result) => {
            if (err) {
                console.log("DATABASE ERROR :", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }
            res.status(200).json({
                success: true,
                flights: result
            });
        });

    } catch (err) {
        console.log("ERROR :", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

});


//================= FETCH ALL USERS DATA =============

app.get("/UsersData", (req, res) => {
    try {
        const getusersdata = `SELECT userID, email, role, created_at FROM users`;
        db.query(getusersdata, (err, result) => {
            if (err) {
                console.log("DATABASE ERROR :", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }
            res.status(200).json({
                success: true,
                users: result
            });
        });

    } catch (err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

//===================== FETCH ALL PASSENGERS DATA ============

app.get("/PassengersData", (req, res) => {

    try {

        const passengersData = `
        SELECT 
            users.userID,
            passengerID,
            passengers.first_name,
            passengers.last_name,
            users.email,
            passengers.passport_number,
            passengers.nationality
        FROM users
        LEFT JOIN passengers 
        ON users.userID = passengers.user_id
        `;

        db.query(passengersData, (err, results) => {

            if (err) {
                console.log("DATABASE ERROR :", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            res.status(200).json({
                success: true,
                passengers: results
            });

        });

    } catch (err) {

        console.log("ERROR : ", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


//==================== FETCH ALL EMPLOYEE DATA ====================
app.get("/EmployeesData", (req, res) => {
    try{
        const employeeData = `SELECT employeeID,first_name,last_name,email,phone,shift,employees.created_at
        FROM employees INNER JOIN users 
        ON employees.userID = users.userID `;

        db.query(employeeData,(err,results)=>{
            if(err){
                console.log("DATABASE ERROR :", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }
            res.status(200).json({
                success: true,
                employees: results
            });

        });

    }
    catch(err){
        console.log("ERROR : ", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
)

//================  DELETE USER FROM THE DATABASE(ADMIN) ===========
app.delete("/deleteUser", (req, res) => {
    const { userID } = req.body;
    const deleteUser = `DELETE FROM users WHERE userID = ?`;
    db.query(deleteUser, [userID], (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    });

});

//======================= DELETE PASSENGER (ADMIN) ============
app.delete("/deletePassenger", (req, res) => {
    const { passengerID } = req.body;
    const deletePassenger = `DELETE FROM passengers WHERE passengerID = ?`;
    db.query(deletePassenger, [passengerID], (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }
        return res.status(200).json({
            success: true,
            message: "Passenger deleted successfully"
        });

    });

});

//=============== DELETE EMPLOYEE (ADMIN) =========
app.delete("/deleteEmployee", (req, res) => {
    const { employeeID } = req.body;
    const deleteEmployee = `DELETE FROM employees WHERE employeeID = ?`;
    db.query(deleteEmployee, [employeeID], (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }
        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    });

});



//=============== UPDATE USERS ===============
app.put('/updateUser',  (req, res) => {
  const { userID, email, role } = req.body;
  const updateUser = "UPDATE users SET email=?, role=? WHERE userID=?";
  try{
    db.query(updateUser,[email, role, userID],(error,result)=>{
    if(error){
        console.log("DATABASE ERROR: ",error);
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
    }
    return res.status(200).json({
        success: true,
        message: "User updated successfully",
    });
    
  });
  
  }
  catch(err){
    console.log("ERROR : ", err);
    res.status(500).json({
        success: false,
        message: "Server error"
    });
}});

// =============== UPDATE PASSENGER ===============
app.put('/updatePassenger', (req, res) => {
  const {passengerID,first_name,last_name,email,passport_number, nationality} = req.body;
  const sql = `UPDATE passengers SET first_name=?, last_name=?, passport_number=?, nationality=? WHERE passengerID=?`;
  db.query(sql,[first_name, last_name, passport_number, nationality, passengerID],(error, result) => {
    if (error) {
        console.log("DATABASE ERROR:", error);
        return res.status(500).json({
          success: false,
          message: "Database error",
    });}

    return res.status(200).json({
        success: true,
        message: "Passenger updated successfully",
      });
    }
  );
});


//================ UPDATE EMPLOYEE ===========
app.put('/updateEmployee', (req, res) => {
  const {employeeID,first_name,last_name,phone,shift} = req.body;
  const sql = `UPDATE employees SET first_name = ? ,last_name = ?, shift = ? WHERE employeeID = ?`;
  db.query(sql, [first_name, last_name, shift, employeeID],(error, result) => {

      if (error) {
        console.log("DATABASE ERROR:", error);
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        affectedRows: result.affectedRows
      });
    }
  );
});


//================== CREATE EMPLOYEE ACCOUNT ===========
app.post("/CreateEmployee", (req, res) => {

  const {
    firstname,
    lastname,
    shift,
    email,
    phone,
    password
  } = req.body;

  const userID = uuidv4();
  const employeeID = uuidv4();

  bcrypt.hash(password, 10, (err, hash) => {

    if (err) {
      console.log("BCRYPT ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Password hashing failed"
      });
    }

    // 1. insert user
    db.query(
      `INSERT INTO users (userID, email, password_hash, role, phone)
       VALUES (?, ?, ?, 'staff', ?)`,
      [userID, email, hash, phone],
      (err, result) => {

        if (err) {
          console.log("USER INSERT ERROR:", err);
          return res.status(500).json({
            success: false,
            message: "USER INSERT FAILED"
          });
        }

        // 2. insert employee AFTER user success
        db.query(
          `INSERT INTO employees (employeeID, userID, first_name, last_name, shift)
           VALUES (?, ?, ?, ?, ?)`,
          [employeeID, userID, firstname, lastname, shift],
          (err2, result2) => {

            if (err2) {
              console.log("EMPLOYEE INSERT ERROR:", err2);
              return res.status(500).json({
                success: false,
                message: "EMPLOYEE INSERT FAILED"
              });
            }

            return res.status(200).json({
              success: true,
              message: "Employee created successfully",
              userID,
              employeeID
            });

          }
        );
      }
    );
  });
});

//============= FETCH AIRLINES NAMES ==========
app.get("/airlines",(req,res)=>{
    try{
        const fetchAirlines = `SELECT airportID , name FROM airports`;
        db.query(fetchAirlines,(error,result)=>{
            if(error){
                console.log("DATABASE ERROR: ",error);
                return res.status(500).json({
                    success: "Error",
                    message: "Fetch airlines failed..."
                });
            }

            return res.status(200).json(result);
        });
    }
    catch(err){
        console.log("SERVER ERROR: ",err);
        return res.status(500).json({
            success: "false",
            message: "SERVER ERROR"
        });
    }
});

//==================== ADD FLIGHT ========
app.post("/addflight", (req, res) => {

  const {departureDate,departureTime,arrivalDate,arrivalTime,airline,flightNumber,origin,destination,price} = req.body;
  const flightID = uuidv4();
  const basePrice = Number(price);
  // FORMAT DATE
  const formatDate = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const departure_time = `${formatDate(departureDate)} ${departureTime}:00`;
  const arrival_time = `${formatDate(arrivalDate)} ${arrivalTime}:00`;

  // SEAT PRICE FUNCTION
  function getSeatFee(basePrice, seatClass) {
    switch (seatClass) {
      case "Economy class":
        return basePrice;
      case "Premium Economy class":
        return basePrice * 1.3;
      case "Business class":
        return basePrice * 1.6;
      case "First class":
        return basePrice * 2;
      default:
        return basePrice;
    }
  }

  // INSERT FLIGHT FIRST
  const sql = `INSERT INTO flights (flightID ,airline, flight_number, origin, destination, departure_time, arrival_time, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql,[flightID,airline,flightNumber,origin,destination,departure_time,arrival_time,basePrice],(err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Database error" });
      }
      // CREATE SEATS AFTER FLIGHT
      const firstSeats = 6;
      const businessSeats = 8;
      const premiumSeats = 12;
      const economySeats = 180 - (firstSeats + businessSeats + premiumSeats);
      const seats = [];
      let seatNumber = 1;

      function addSeats(count, seatClass) {
        for (let i = 0; i < count; i++) {
          seats.push([
            null,
            flightID,
            `${seatNumber++}A`,
            seatClass,
            0,
            getSeatFee(basePrice, seatClass)
          ]);
        }
      }

      addSeats(firstSeats, "First class");
      addSeats(businessSeats, "Business class");
      addSeats(premiumSeats, "Premium Economy class");
      addSeats(economySeats, "Economy class");

      // INSERT SEATS
      db.query(`INSERT INTO seats (id, flightID, seat_number, class, is_booked, seat_fee) VALUES ?`,[seats],(err2) => {

          if (err2) {
            console.log(err2);
            return res.json({
              success: false,
              message: "Flight created but seats failed"
            });
          }

          return res.json({
            success: true,
            message: "Flight and seats added successfully"
          });
        }
      );
    }
  );
});


//=================== UPDATE FLIGHT ================
app.put("/updateFlight", (req, res) => {
  const {flightID,flight_number,airline,origin,destination,status,departure_time,arrival_time,} = req.body;
  const sql = `UPDATE flights SET flight_number = ?, airline = ?, origin = ?, destination = ?, status = ?, departure_time = ?,
   arrival_time = ? WHERE flightID = ?`;

  db.query(sql,[flight_number,airline,origin,destination,status,departure_time,arrival_time,flightID,],(err, result) =>{
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to update flight",
        });
      }
      res.json({
        success: true,
        message: "Flight updated successfully",
      });
    }
  );
});

//============= DELETE FLIGHT ====================
app.delete("/deleteFlight", (req, res) => {
  const { flightID } = req.body;

  if (!flightID) {
    return res.status(400).json({
      success: false,
      message: "flightID is required",
    });
  }

  const sql = "DELETE FROM flights WHERE flightID = ?";

  db.query(sql, [flightID], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete flight",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      });
    }

    res.json({
      success: true,
      message: "Flight deleted successfully",
    });
  });
});

//================== FETCH LATEST FLIGHTS ===========
app.get("/latestFlights",(req,res)=>{
    const fetchLatestFlights = `SELECT flight_number,airline,origin,destination,status FROM flights ORDER BY created_at DESC LIMIT 12;`;
    try{
        db.query(fetchLatestFlights,(err,result)=>{
            if(err){
                 console.log("ERROR: ",err);
                 return res.status(500).json({
                    success:"false",
                    message:"DATABASE ERROR"
                 });
            }

        return res.status(200).json(result);
    });}
    catch(err){
        console.log("SERVER ERROR: ",err);
        return res.status(500).json({
            success: "false",
            message: "SERVER ERROR"
        });
    }});

//================== LATEST RESERVATIONS =============
app.get("/latestReservations",(req,res)=>{
    const fetchLatestReservations = `SELECT booking.reservationID, passengers.first_name, passengers.last_name, flights.flight_number,
    booking.created_at FROM booking
    INNER JOIN passengers ON booking.userID = passengers.user_id
    INNER JOIN flights ON booking.flightID = flights.flightID
    WHERE booking.status = 'confirmed' ORDER BY booking.created_at DESC LIMIT 10;`;

    try{
        db.query(fetchLatestReservations,(error,result)=>{
            if(error){
                console.log("DATABASE ERROR: ",error);
                return res.status(500).jaon({
                    success: "false",
                    message:"failed to fetch the latest reservations"
                })
            }
            return res.status(200).json(result);
        });

    }
    catch(err){
        console.log("SERVER ERROR: ",err);
        return res.status(500).json({
            success: "false",
            message: "SERVER ERROR"
        });
    }
});

//####################### KPIs #######################
// ======== FLIGHT KPI ===========
app.get("/flights",(req,res)=>{
    const FetchNumbersOfFlights = `SELECT COUNT(*) AS value FROM flights`;

  db.query(FetchNumbersOfFlights, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({
      key: "totalFlights",
      label: "Total Flights",
      value: result[0].value
    });
  });
})

//============== TOTAL RESERVATIONS =========
app.get("/TotleReservations",(req,res)=>{
    const sql = `SELECT COUNT(*) AS value FROM booking`;
    db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }
    res.json({
      key: "totalReservations",
      label: "Total Reservations",
      value: result[0].value
    });});
});

//============== TOTAL REVENUE =================
app.get("/TotalRevenue", (req, res) => {
    const totalRevenue = `SELECT SUM(s.seat_fee) AS revenue,SUM(o.tax + d.tax) AS airport_taxes,
    SUM(s.seat_fee + o.tax + d.tax) AS total_collected FROM seats s JOIN flights f ON s.flightID = f.flightID
    JOIN airports o ON f.originID = o.airportID JOIN airports d ON f.destinationID = d.airportID WHERE s.is_booked = 1;`;

  db.query(totalRevenue, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }
    res.json({
      success: true,
      data: result
    });

  });
});

//=================== AVAILABLE SEATES ============
app.get("/AvailableSeats", (req, res) => {
  const availableSeats = `SELECT COUNT(*) AS value FROM seats WHERE is_booked = 0`;
  db.query(availableSeats, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }
    return res.json({
      success: true,
      value: result[0].value || 0
    });
  });
});

//======================= GRAPHICS CHARTS ===========
app.get("/users-distribution", (req, res) => {

  const sql = `
    SELECT role, COUNT(*) as count
    FROM users
    GROUP BY role
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

//=================== BAR CHART =================
app.get("/flightStatusDistribution", (req, res) => {
  const query = `SELECT status, COUNT(*) AS count FROM flights GROUP BY status `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});


//=============== GENERATE PDF FLIGHT REPORTS ==========
app.get("/reportsFlights", (req, res) => {

  db.query("SELECT * FROM flights",(err, flights) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({
        margin: 30,
        size: "A4"
      });
      res.setHeader( "Content-Type", "application/pdf");
      res.setHeader( "Content-Disposition", "inline; filename=NodeAir-Flights-Report.pdf");
      doc.pipe(res);

      // REPORT HEADER
      doc 
        .fontSize(24)
        .fillColor("#0F172A")
        .font("Helvetica-Bold")
        .text("NodeAir Flight Report", {
          align: "center"
        });

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor("gray")
        .font("Helvetica")
        .text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          {
            align: "center"
          }
        );

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("#374151")
        .text(
          `Total Flights: ${flights.length}`,
          {
            align: "right"
          }
        );

      doc.moveDown(2);

      // TABLE SETTINGS
      const tableTop = 150;
      const rowHeight = 25;
      const cols = {
        flightNumber: 35,
        airline: 120,
        origin: 230,
        destination: 330,
        status: 450
      };

      // TABLE HEADER

      doc
        .rect(30, tableTop - 5, 530, 25)
        .fill("#1E40AF");

      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(11);

      doc.text("Flight", cols.flightNumber, tableTop);
      doc.text("Airline", cols.airline, tableTop);
      doc.text("Origin", cols.origin, tableTop);
      doc.text("Destination", cols.destination, tableTop);
      doc.text("Status", cols.status, tableTop);

      let y = tableTop + 30;

      // TABLE DATA

      flights.forEach((flight, index) => {

        // Alternate row color
        if (index % 2 === 0) {
          doc
            .rect(30, y - 4, 530, 22)
            .fill("#F3F4F6");
        }

        doc.fillColor("black");
        doc.font("Helvetica");

        doc.text(
          flight.flight_number || "",
          cols.flightNumber,
          y
        );

        doc.text(
          flight.airline || "",
          cols.airline,
          y
        );

        doc.text(
          flight.origin || "",
          cols.origin,
          y
        );

        doc.text(
          flight.destination || "",
          cols.destination,
          y
        );

        // STATUS COLORS
        const status = flight.status || "";

        switch (status.toLowerCase()) {

          case "scheduled":
            doc.fillColor("green");
            break;

          case "cancelled":
            doc.fillColor("red");
            break;

          case "delayed":
            doc.fillColor("orange");
            break;

          case "completed":
            doc.fillColor("blue");
            break;

          default:
            doc.fillColor("black");
        }

        doc.text(
          status,
          cols.status,
          y
        );

        doc.fillColor("black");

        // Row separator
        doc
          .moveTo(30, y + 18)
          .lineTo(560, y + 18)
          .strokeColor("#D1D5DB")
          .stroke();

        y += rowHeight;

        // New page if needed
        if (y > 730) {

          doc.addPage();

          y = 50;

          doc
            .rect(30, y - 5, 530, 25)
            .fill("#1E40AF");

          doc
            .fillColor("white")
            .font("Helvetica-Bold");

          doc.text("Flight", cols.flightNumber, y);
          doc.text("Airline", cols.airline, y);
          doc.text("Origin", cols.origin, y);
          doc.text("Destination", cols.destination, y);
          doc.text("Status", cols.status, y);

          y += 30;
        }
      });
      doc.moveDown(2);

      doc
        .fontSize(9)
        .fillColor("gray")
        .text(
          "Generated by NodeAir Management System",
          {
            align: "center"
          }
        );

      doc.end();
    }
  );
});

//================== FLIGHT REPORT FOR CANCELLED FLIGHTS =========
app.get("/reportsFlightsCancelled", (req, res) => {

  db.query(
    "SELECT * FROM flights WHERE status = 'Canceled'",
    (err, flights) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      const PDFDocument = require("pdfkit");

      const doc = new PDFDocument({
        margin: 30,
        size: "A4"
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=Cancelled-Flights-Report.pdf"
      );

      doc.pipe(res);

      // TITLE
      doc
        .fontSize(24)
        .fillColor("#DC2626")
        .font("Helvetica-Bold")
        .text("Cancelled Flights Report", {
          align: "center"
        });

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor("gray")
        .font("Helvetica")
        .text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          { align: "center" }
        );

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("#374151")
        .text(
          `Total Cancelled Flights: ${flights.length}`,
          { align: "right" }
        );

      doc.moveDown(2);

      // TABLE SETTINGS
      const tableTop = 150;
      const rowHeight = 25;

      const cols = {
        flightNumber: 35,
        airline: 120,
        origin: 230,
        destination: 330,
        status: 450
      };

      // HEADER
      doc
        .rect(30, tableTop - 5, 530, 25)
        .fill("#DC2626");

      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(11);

      doc.text("Flight", cols.flightNumber, tableTop);
      doc.text("Airline", cols.airline, tableTop);
      doc.text("Origin", cols.origin, tableTop);
      doc.text("Destination", cols.destination, tableTop);
      doc.text("Status", cols.status, tableTop);

      let y = tableTop + 30;

      // DATA
      flights.forEach((flight, index) => {

        if (index % 2 === 0) {
          doc
            .rect(30, y - 4, 530, 22)
            .fill("#FEE2E2"); // light red background
        }

        doc.fillColor("black").font("Helvetica");

        doc.text(flight.flight_number || "", cols.flightNumber, y);
        doc.text(flight.airline || "", cols.airline, y);
        doc.text(flight.origin || "", cols.origin, y);
        doc.text(flight.destination || "", cols.destination, y);

        // status always red
        doc.fillColor("red");
        doc.text("cancelled", cols.status, y);

        doc.fillColor("black");

        doc
          .moveTo(30, y + 18)
          .lineTo(560, y + 18)
          .strokeColor("#D1D5DB")
          .stroke();

        y += rowHeight;
      });

      // FOOTER
      doc.moveDown(2);

      doc
        .fontSize(9)
        .fillColor("gray")
        .text(
          "Generated by NodeAir Management System",
          { align: "center" }
        );

      doc.end();
    }
  );
});

//===================== SCHEDULED FLIGHT REPORT =========
app.get("/reportsFlightScheduled", (req, res) => {

  db.query(
    "SELECT * FROM flights WHERE status = 'scheduled'",
    (err, flights) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      const PDFDocument = require("pdfkit");

      const doc = new PDFDocument({
        margin: 30,
        size: "A4"
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=Scheduled-Flights-Report.pdf"
      );

      doc.pipe(res);

      // TITLE
      doc
        .fontSize(24)
        .fillColor("#16A34A")
        .font("Helvetica-Bold")
        .text("Scheduled Flights Report", {
          align: "center"
        });

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor("gray")
        .font("Helvetica")
        .text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          { align: "center" }
        );

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("#374151")
        .text(
          `Total Scheduled Flights: ${flights.length}`,
          { align: "right" }
        );

      doc.moveDown(2);

      // TABLE SETTINGS
      const tableTop = 150;
      const rowHeight = 25;

      const cols = {
        flightNumber: 35,
        airline: 120,
        origin: 230,
        destination: 330,
        status: 450
      };

      // HEADER
      doc
        .rect(30, tableTop - 5, 530, 25)
        .fill("#16A34A");

      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(11);

      doc.text("Flight", cols.flightNumber, tableTop);
      doc.text("Airline", cols.airline, tableTop);
      doc.text("Origin", cols.origin, tableTop);
      doc.text("Destination", cols.destination, tableTop);
      doc.text("Status", cols.status, tableTop);

      let y = tableTop + 30;

      // DATA
      flights.forEach((flight, index) => {

        if (index % 2 === 0) {
          doc
            .rect(30, y - 4, 530, 22)
            .fill("#DCFCE7"); // light green
        }

        doc.fillColor("black").font("Helvetica");

        doc.text(flight.flight_number || "", cols.flightNumber, y);
        doc.text(flight.airline || "", cols.airline, y);
        doc.text(flight.origin || "", cols.origin, y);
        doc.text(flight.destination || "", cols.destination, y);

        doc.fillColor("green");
        doc.text("scheduled", cols.status, y);

        doc.fillColor("black");

        doc
          .moveTo(30, y + 18)
          .lineTo(560, y + 18)
          .strokeColor("#D1D5DB")
          .stroke();

        y += rowHeight;
      });

      // FOOTER
      doc.moveDown(2);

      doc
        .fontSize(9)
        .fillColor("gray")
        .text(
          "Generated by NodeAir Management System",
          { align: "center" }
        );

      doc.end();
    }
  );
});

//================= REPORT FOR THE COMPLETED FLIGHT ========
app.get("/reportsFlightsCompleted", (req, res) => {

  db.query(
    "SELECT * FROM flights WHERE status = 'Landed'",
    (err, flights) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      const PDFDocument = require("pdfkit");

      const doc = new PDFDocument({
        margin: 30,
        size: "A4"
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=Completed-Flights-Report.pdf"
      );

      doc.pipe(res);


      // TITLE

      doc
        .fontSize(24)
        .fillColor("#2563EB")
        .font("Helvetica-Bold")
        .text("Completed Flights Report", {
          align: "center"
        });

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor("gray")
        .font("Helvetica")
        .text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          { align: "center" }
        );

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("#374151")
        .text(
          `Total Completed Flights: ${flights.length}`,
          { align: "right" }
        );

      doc.moveDown(2);


      // TABLE SETTINGS

      const tableTop = 150;
      const rowHeight = 25;

      const cols = {
        flightNumber: 35,
        airline: 120,
        origin: 230,
        destination: 330,
        status: 450
      };


      // HEADER

      doc
        .rect(30, tableTop - 5, 530, 25)
        .fill("#2563EB");

      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(11);

      doc.text("Flight", cols.flightNumber, tableTop);
      doc.text("Airline", cols.airline, tableTop);
      doc.text("Origin", cols.origin, tableTop);
      doc.text("Destination", cols.destination, tableTop);
      doc.text("Status", cols.status, tableTop);

      let y = tableTop + 30;


      // DATA

      flights.forEach((flight, index) => {

        if (index % 2 === 0) {
          doc
            .rect(30, y - 4, 530, 22)
            .fill("#DBEAFE"); // light blue
        }

        doc.fillColor("black").font("Helvetica");

        doc.text(flight.flight_number || "", cols.flightNumber, y);
        doc.text(flight.airline || "", cols.airline, y);
        doc.text(flight.origin || "", cols.origin, y);
        doc.text(flight.destination || "", cols.destination, y);

        doc.fillColor("blue");
        doc.text("completed", cols.status, y);

        doc.fillColor("black");

        doc
          .moveTo(30, y + 18)
          .lineTo(560, y + 18)
          .strokeColor("#D1D5DB")
          .stroke();

        y += rowHeight;
      });
      //footer
      doc.moveDown(2);

      doc
        .fontSize(9)
        .fillColor("gray")
        .text(
          "Generated by NodeAir Management System",
          { align: "center" }
        );

      doc.end();
    }
  );
});


//=============== REVENUE REPORT ==============
app.get("/reportsRevenue", (req, res) => {
  db.query("SELECT * FROM flights", (err, flights) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({
      margin: 30,
      size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=Revenue-Report.pdf"
    );

    doc.pipe(res);
    // CALCULATIONS
    
    let totalRevenue = 0;
    flights.forEach(f => {totalRevenue += Number(f.price || 0); });
    const avgRevenue = flights.length
    ? totalRevenue / flights.length
      : 0;

    // TITLE
    doc
      .fontSize(24)
      .fillColor("#F59E0B")
      .font("Helvetica-Bold")
      .text("NodeAir Revenue Report", {
        align: "center"
      });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, {
        align: "center"
      });

    doc.moveDown(2);

    // SUMMARY BOX

    doc
      .rect(30, 140, 530, 80)
      .fill("#FEF3C7");

    doc
      .fillColor("#111827")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Total Revenue: $${totalRevenue}`, 50, 160);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Flights Count: ${flights.length}`, 50, 180);

    doc
      .text(`Average Revenue: $${avgRevenue.toFixed(2)}`, 50, 200);

    let y = 250;

    // TABLE HEADER

    const cols = {
      flight: 40,
      airline: 140,
      origin: 260,
      destination: 380,
      price: 480
    };

    doc
      .rect(30, y - 5, 530, 25)
      .fill("#F59E0B");

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("Flight", cols.flight, y);
    doc.text("Airline", cols.airline, y);
    doc.text("Origin", cols.origin, y);
    doc.text("Destination", cols.destination, y);
    doc.text("Price", cols.price, y);

    y += 30;

    // DATA

    flights.forEach((f, index) => {

      if (index % 2 === 0) {
        doc
          .rect(30, y - 4, 530, 22)
          .fill("#FFFBEB");
      }

      doc.fillColor("black").font("Helvetica");

      doc.text(f.flight_number || "", cols.flight, y);
      doc.text(f.airline || "", cols.airline, y);
      doc.text(f.origin || "", cols.origin, y);
      doc.text(f.destination || "", cols.destination, y);

      doc.fillColor("#16A34A");
      doc.text(`$${f.price || 0}`, cols.price, y);

      doc.fillColor("black");

      doc
        .moveTo(30, y + 18)
        .lineTo(560, y + 18)
        .strokeColor("#E5E7EB")
        .stroke();

      y += 25;
    });

    // FOOTER

    doc.moveDown(2);

    doc
      .fontSize(9)
      .fillColor("gray")
      .text("Generated by NodeAir Management System", {
        align: "center"
      });

    doc.end();
  });
});

// ==================RevenueChart============
app.get("/RevenueChart", (req, res) => {
  db.query(` SELECT  DATE_FORMAT(created_at, '%Y-%m') AS month,SUM(price) AS revenue FROM flights WHERE price IS NOT NULL
    GROUP BY month ORDER BY month ASC`,(err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }
      res.json(result);
    }
  );
});

//============== FLIGHT BY DESTINATION CHART =====
app.get("/statsDestinations", (req, res) => {
  db.query(
    `SELECT destination, COUNT(*) AS count FROM flights GROUP BY destination ORDER BY count DESC `,(err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }
      res.json(result);
    }
  );

});


//=================== SETTINGS = ========
app.post("/api/backup", async (req, res) => {
  try {

    const [users] = await db.promise().query("SELECT * FROM users");
    const [flights] = await db.promise().query("SELECT * FROM flights");
    const [reservations] = await db.promise().query("SELECT * FROM booking");
    const [tickets] = await db.promise().query("SELECT * FROM tickets");

    const backupData = {
      backupDate: new Date(),
      users,
      flights,
      reservations,
      tickets,
    };

    const backupFolder = path.join(__dirname, "backups");
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true }); 
    }

    const fileName = `NodeAir_Backup_${Date.now()}.json`;
    const filePath = path.join(backupFolder, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), "utf8");

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error during file download:", err);
      }
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

  } catch (error) {
    console.error("Backup system error details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during backup generation",
    });
  }
});

// ================= TEST ROUTE =================
app.get("/test", (req, res) => {
    res.json({ 
        message: "Server is working",
        timestamp: new Date().toISOString()
    });
});

// ================= ERROR HANDLING MIDDLEWARE =================
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ 
        error: "Internal server error",
        message: err.message 
    });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});