const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);


    const result = await pool.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4)
       RETURNING id,name,email,role`,
      [name, email, hashedPassword, role || "candidate"]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
  
      const user = userResult.rows[0];
  
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );
  
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
  
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
  
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };


module.exports = { register, login };