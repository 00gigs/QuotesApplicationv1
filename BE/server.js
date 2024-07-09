const dotenv = require("dotenv");
const pool = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const keys = require("./keys");
const jwt_decode = require('jwt-decode')
const fs = require('fs');
const { json } = require("stream/consumers");

app.use(express.json());
app.use(cors());
dotenv.config();

//AUTH ROUTE HANDLERS

//Register
app.post("/auth", async (req, res) => {
  //body
  const { email, name_user, password } = req.body;
  //bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedpass = await bcrypt.hash(password, salt);
  try {
    const createAccount = await pool.query(
      "INSERT INTO users(email,name_user,hashedpass) VALUES($1,$2,$3)",
      [email, name_user, hashedpass]
    );
    console.log(createAccount);
    res.status(200).json({ message: "User Created" });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "User creation failed" });
  }
});

// Login
app.post("/signIn", async (req, res) => {
  const { userEmail, userPassword } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      userEmail,
    ]);
    if (user.rows.length === 0) {
      res.status(400).json({ message: "no user found" });
    }
    const userPass = user.rows[0];
    const compare = await bcrypt.compare(userPassword, userPass.hashedpass);

    if (!compare) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userSession = await jwt.sign(
      { currentUser: userEmail },
      keys.JWT_HASH_KEY,
      { expiresIn: "1800s" }
    );

    res.status(200).json({ message: "Login Success", userToken: userSession });
  } catch (error) {
    console.log("Error->", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.post("/logout", async (req, res) => {});





//insert quotes into DB
async function insertQuotesIntoDB() {


    const quoteData = fs.readFileSync('../BE/qouteDB.json')

    const jsonData = JSON.parse(quoteData)

    for (let columns of jsonData) {
      const checkDuplicate = await pool.query(
        "SELECT * FROM quotes WHERE id = $1",
        [columns._id]
      );

      if (checkDuplicate.rows.length === 0) {
        await pool.query(
          "INSERT INTO quotes(id,quote,author,authorSlug,characters,category) VALUES($1,$2,$3,$4,$5,$6)",
          [
            columns._id,
            columns.content,
            columns.author,
            columns.authorSlug,
            columns.length,
            columns.tags.join(", "),
          ]
        );
      }
    }
  }


insertQuotesIntoDB();
//QUOTE DATA RETRIEVAL
app.get("/randomQuote", async (req, res) => {
  try {
    const randomQuote = await pool.query(
      "SELECT * FROM quotes ORDER BY random() LIMIT 1"
    );
    if (randomQuote.rows.length > 0) {
      const data = randomQuote.rows[0];
      res.json({
        quote: data.quote,
        author: data.author,
        category: data.category,
        id: data.id,
      });
      console.log("DATA-->", data);
    } else {
      res.status(500).json({ message: "failed to retrieve quote" });
    }
  } catch (error) {
    console.log("ERROR:", error);
    res
      .status(500)
      .json({ message: "Internal server error,failed to get quote" });
  }
});

//upvote-downvote-quote
//LIKE
app.post("/like/:id", async (req, res) => {
  // Update the upvote count and return the new upvote count in one query
  const id = req.params.id;

  try {
    //check to see if vote data is available for quote_id if not INSERT into table with a vote
    const checkData = await pool.query(
      "SELECT * FROM votes WHERE quote_id = $1",
      [id]
    );
    let voteRes;

    if (checkData.rowCount === 0) {
      voteRes = await pool.query(
        "INSERT INTO votes(quote_id,upvote) VALUES($1,1) RETURNING upvote",
        [id]
      );
    } else {
      //if the quote_id is in the table just update vote count
      voteRes = await pool.query(
        "UPDATE votes SET upvote = upvote + 1 WHERE quote_id = $1 RETURNING upvote",
        [id]
      );
    }
    // Send the updated upvote count in the response
    res.json({ likes: voteRes.rows[0].upvote });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//DISLIKE
app.post("/dislike/:id", async (req, res) => {
  // Update the upvote count and return the new upvote count in one query
  const id = req.params.id;

  try {
    //check to see if vote data is available for quote_id if not INSERT into table with a vote
    const checkData = await pool.query(
      "SELECT * FROM votes WHERE quote_id = $1",
      [id]
    );
    let voteRes;

    if (checkData.rowCount === 0) {
      voteRes = await pool.query(
        "INSERT INTO votes(quote_id,downvote) VALUES($1,1) RETURNING downvote",
        [id]
      );
    } else {
      //if the quote_id is in the table just update vote count
      voteRes = await pool.query(
        "UPDATE votes SET downvote = downvote + 1 WHERE quote_id = $1 RETURNING downvote",
        [id]
      );
    }
    // Send the updated downvote count in the response
    res.json({ dislikes: voteRes.rows[0].downvote });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//then use get  method to show realtime vote data

app.get('/votes/:id',async(req,res) =>{
  const id = req.params.id
  try {
    const votes = await pool.query('SELECT upvote , downvote FROM votes WHERE quote_id = $1 ',[id])
    if(votes.rows.length === 0){
    return res.json({likes:0,dislikes:0})
    }else{
      res.json({likes:votes.rows[0].upvote,dislikes:votes.rows[0].downvote})
    }
  } catch (error) {
    console.log('err',error)
    res.status(500).json({message:'internal server error'})
  }
})

// user save Quotes
app.post("/saveQuote", async (req, res) => {
  const { user, _quote_ } = req.query;
  try {
    //get token of session at time of http endpoint is sent 
    const tokenDecode = jwt_decode.jwtDecode(user)
   const userCurrent = tokenDecode.currentUser
    const checkdupl = await pool.query('SELECT quote_ FROM user_favorites WHERE quote_ = $1',[userCurrent])
    if(checkdupl.rows.length === 0){
      const query  = await pool.query('INSERT INTO user_favorites(quote_,user_Email) VALUES($1,$2)',[_quote_,userCurrent]) 
      res.status(200).json({userFav:query, message:'saved'})
    }else{
      res.status(200).json({'Already saved':checkdupl})
    }
  } catch (error) {
    console.log('err',error)
    res.status(500).json({message:'internal server error'})
  }
});

//retrieve user favorite quote
app.get("/userfav/:logged", async (req, res) => {
  const { logged } = req.params;
  try {
      const token = jwt_decode.jwtDecode(logged)
    const email = token.currentUser
    const savedQid = await pool.query('SELECT quote_ FROM user_favorites WHERE user_email = $1',[email])
    console.log('Fetched quote IDs:', savedQid.rows);
    const fetched =  savedQid.rows.map(row => row.quote_)
    if(fetched.length === 0){
      return res.status(400).json({message:'no quotes found'})
    }
    const quote = await pool.query('SELECT quote FROM quotes WHERE id = ANY($1)',[fetched])
    console.log(quote.rows)
    res.status(200).json({quotes:quote.rows})
  } catch (error) {
    res.status(500).json({message:'internal service error(500)'})
  }
});

//upload user quote

app.post('/uploadQuote/:user/:quotes', async(req,res)=>{
try {
    const {user,quotes} = req.params
  console.log(quotes)
    const tkn = jwt_decode.jwtDecode(user)
    const loggedUser = tkn.currentUser
    const queryCreate = await pool.query('INSERT INTO user_quotes(user_quote,username) VALUES($1,$2) RETURNING *',[quotes,loggedUser])
    res.status(200).json({savedAs:queryCreate.rows[0]})
} catch (error) {
  res.status(400).json({message:'internal service error(500)',Error:error})
}
})


//SELECT user_quote FROM user_quotes WHERE current user is 
//retrieve user quote
app.get('/userQuotesFetch/:currentLogged', async(req,res)=>{
  try {
    const {currentLogged} = req.params
    const decoder = jwt_decode.jwtDecode(currentLogged)
    const user_Email = decoder.currentUser
    const GetMadeQuotes = await pool.query('SELECT user_quote FROM user_quotes WHERE username = $1',[user_Email])
    res.status(200).json({UserQuotes:GetMadeQuotes.rows})
  } catch (error) {
    res.status(500).json({message:'internal server Error 500', _error:error})
  }
})

//port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
