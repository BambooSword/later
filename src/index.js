const express = require('express')
const path = require('path')
const read = require('node-readability')

const app = express()
const Article = require('./db').Article
 app.set('view engine', 'ejs')
 app.set('views', path.join(__dirname, '../views'))
 app.use('/static',express.static(path.join(__dirname+'/static')))

const port = process.env.PORT || 3000
app.set('port', port)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  '/css/bootstrap.css',
  express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)

app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.format({
      html: () => {
        res.render('articles.ejs', { articles })
      },
      json: () => {
        res.send(articles)
      },
    })
  })
})
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.format({
      html: () => {
        res.render('article.ejs', { article })
      },
      json: () => {
        res.send(article)
      },
    })
  })
})

app.post('/articles', (req, res, next) => {
  const url = req.body.url
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('Error downloading article')
    Article.create(
      { title: result.title, content: result.content },
      (err, article) => {
        if (err) return next(err)
        res.send('OK')
      }
    )
  })
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
