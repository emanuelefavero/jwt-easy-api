const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
  })
})

// TIP: In your frontend you will save the token in local storage after login with fetch/axios.
// EXAMPLE: localStorage.setItem('token', token)
// EXAMPLE: localStorage.getItem('token')
// TIP: That token will be used to access the protected routes
// EXAMPLE: axios.post('/api/posts', post, { headers: { Authorization: `Bearer ${token}` } })

// Protected Route (this route has a middleware that checks for the token)
app.post('/api/posts', verifyToken, (req, res) => {
  // TODO: CREATE POST ON DATABASE HERE

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({
        message: 'Post created...',
        authData,
      })
    }
  })
})

// LOGIN Route (Get the token)
app.post('/api/login', (req, res) => {
  // TODO: SEND USERNAME AND PASSWORD TO THIS ROUTE AND AUTHENTICATE THE USER ON THE DATABASE HERE
  // Mock user
  const user = {
    id: 1,
    username: 'john',
    email: 'john@email.com',
  }

  // TIP: You can also set the token to expire in '30s', '1h', '1d', '1w', '1y'
  // EXAMPLE: jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {})
  jwt.sign({ user }, 'secretkey', (err, token) => {
    // We will get back the token
    // TIP: The token contains all the information we need to access the protected route
    res.json({ token })
  })
})

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// EXAMPLE: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImpvaG4iLCJlbWFpbCI6ImpvaG5AZW1haWwuY29tIn0sImlhdCI6MTY2NzAxNDkxNX0.Yi-FACZirMsMNYaFxg_lfI3YsWDvEqQ77kIm04quE_8

// Verify Token - Middleware
function verifyToken(req, res, next) {
  // Get auth header value (the token)
  const bearerHeader = req.headers['authorization']

  // Check if bearer is not undefined (checks if the token exists)
  if (typeof bearerHeader !== 'undefined') {
    // TIP: the token is prefixed with the word Bearer (bearer = who is carrying the token). We need to split the token from the word bearer
    // Split at the space
    const bearer = bearerHeader.split(' ')
    // Get token from array
    const bearerToken = bearer[1]
    // Set the token
    req.token = bearerToken
    // Next middleware
    next()
  } else {
    // Forbidden
    res.sendStatus(403)
  }
}

app.listen(4000, () => console.log('Server started on port 4000'))
