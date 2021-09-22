const express = require('express')
const app = express()
const Article = require('./db').Article

const port = process.env.PORT || 3000
app.set('port', port)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.send(articles)
  })
})
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.send(article)
  })
})

app.post('/articles', (req, res, next) => {
  const article = { title: req.body.title }
  Article.create(article.title, 'this is a content')
  res.send(article)
})

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.delete(id, err => {
    if (err) return next(err)
    res.send({ message: 'Deleted' })
  })
})

app.listen(app.get('port'), () => {
  console.log('App started on port', app.get('port'))
})

module.exports = app

// app.get('/', (req, res) => {
// 	res.send('Hello world')
// })

// app.listen(port, () => {
// 	console.log(`Express web app available at localhost: ${port}`);
// })
