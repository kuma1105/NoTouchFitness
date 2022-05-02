function fetchh() {
  fetch('/fetch')
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
}

  // package.json 파일에 "proxy": "https://localhost:3000" 를 추가해야 원활히 사용가능함

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