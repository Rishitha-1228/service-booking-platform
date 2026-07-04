const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");
const cache = require("../utils/cache");

// ======================================
// CREATE BOOKING
// ======================================

exports.createBooking = async (req, res) => {

  try {

    const {
      userId,
      serviceId,
      customerName,
      email,
      phone,
      service,
      bookingDate,
      timeSlot,
      amount
    } = req.body;

    const booking = await Booking.create({

      userId,
      serviceId,

      customerName,

      email,

      phone,

      service,

      bookingDate,

      timeSlot,

      amount,

      bookingId:
        "BOOK" + Date.now(),

      status: "Pending"

    });

    // ==========================
    // EMAIL
    // ==========================

    const html = `
    <div style="font-family:Arial">

    <h2>Booking Confirmation</h2>

    <p>Hello <b>${customerName}</b>,</p>

    <p>Your booking has been created successfully.</p>

    <hr>

    <h3>Booking Details</h3>

    <p><b>Booking ID:</b> ${booking.bookingId}</p>

    <p><b>Service:</b> ${service}</p>

    <p><b>Date:</b> ${bookingDate}</p>

    <p><b>Time:</b> ${timeSlot}</p>

    <p><b>Amount:</b> ₹${amount}</p>

    <p><b>Status:</b> Pending Payment</p>

    <br>

    <h4>
    Thank you for choosing
    SkillConnect Pro ❤️
    </h4>

    </div>
    `;

    await sendEmail(

      email,

      "Booking Confirmation",

      html

    );

    // ==========================
    // DEMO SMS
    // ==========================

    console.log("================================");

    console.log("📱 SMS SENT");

    console.log(`Hello ${customerName}`);

    console.log(
      `Booking Confirmed`
    );

    console.log(
      `Service : ${service}`
    );

    console.log(
      `Date : ${bookingDate}`
    );

    console.log(
      `Time : ${timeSlot}`
    );

    console.log(
      `Amount : ₹${amount}`
    );

    console.log("================================");
cache.del("allBookings");
    res.status(201).json({

      success:true,

      message:
      "Booking Created Successfully",

      booking

    });

  }

  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

// ======================================
// GET BOOKINGS
// ======================================

exports.getBookings = async (req, res) => {
  try {
    // Check cache first
    const cachedBookings = cache.get("allBookings");

    if (cachedBookings) {
      console.log("📦 Returning Cached Bookings");
      return res.json(cachedBookings);
    }

    // Fetch from MongoDB
    const bookings = await Booking.find()
      .populate("userId")
      .populate("serviceId")
      .lean()
      .sort({ createdAt: -1 });

    // Save to cache
    cache.set("allBookings", bookings);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// GET BOOKING
// ======================================

exports.getBookingById =
async(req,res)=>{

try{

const booking =
await Booking.findById(

req.params.id

)

.populate("userId")

.populate("serviceId");

if(!booking){

return res.status(404).json({

message:"Booking Not Found"

});

}

res.json(booking);

}

catch(error){

res.status(500).json({

message:error.message

});

}

};

// ======================================
// UPDATE STATUS
// ======================================

exports.updateBooking =
async(req,res)=>{

try{

const booking =
await Booking.findByIdAndUpdate(

req.params.id,

req.body,

{

new:true

}

);

if(!booking){

return res.status(404).json({

message:"Booking Not Found"

});

}
cache.del("allBookings");
res.json({

success:true,

booking

});

}

catch(error){

res.status(500).json({

message:error.message

});

}

};

// ======================================
// DELETE
// ======================================

exports.deleteBooking =
async(req,res)=>{

try{

const booking =
await Booking.findByIdAndDelete(

req.params.id

);

if(!booking){

return res.status(404).json({

message:"Booking Not Found"

});

}
cache.del("allBookings");
res.json({

success:true,

message:"Booking Deleted"

});

}

catch(error){

res.status(500).json({

message:error.message

});

}

};