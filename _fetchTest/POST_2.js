fetch('/fetch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'User 1'
  })
})
  .then(res => {
    if (res.ok) {
      console.log('SUCCESS')
    } else {
      console.log('Not Successful')
    }
    return res.json()
  })
  .then(data => console.log(data))
  .catch(error => console.log('ERROR'))

  // <fetch API TEST>
// router.get('/fetch', function(req, res) {
//   res.json(200, {
//     name: 1,
//     age: 2
//   })
// })

// router.post('/fetch', function(req, res) {
//   console.log(req.body)
//   res.json(200, {name: "fetch POST"})
// })
// </fetch API TEST>