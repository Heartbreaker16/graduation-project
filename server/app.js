const express = require('express')
const multer = require('multer')
const mysql = require('mysql')

const FilePath = require('path').join(__dirname, 'files')
const strFilter = str => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
}
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${FilePath}/news`)
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
const correctTime = (myDate, format = 'date') => {
  const twoNum = num => {
    return ('0' + num).slice(-2)
  }
  switch (format) {
    case 'date':
      return `${myDate.getFullYear()}-${twoNum(myDate.getMonth() + 1)}-${twoNum(myDate.getDate())}`
    case 'full':
      return `${myDate.getFullYear()}-${twoNum(myDate.getMonth() + 1)}-${twoNum(myDate.getDate())} ${twoNum(myDate.getHours())}:${twoNum(myDate.getMinutes())}`
    case 'DateObj':
      return myDate
  }
}
const connectSQLConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'calendar',
  charset: 'utf8mb4'
}
const upload = multer({ storage })

const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(FilePath))

// app.get('/', (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html' })
//   fs.readFile(`${FilePath}/html/list.html`, 'utf-8', (err, data) => {
//     if (err) throw err
//     res.end(data)
//   })
// })
app.get('/register', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const user = req.query
  let SQL = `
    SELECT *
    FROM users
    WHERE openid = '${user.openid}'
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    if (row.length > 0) res.send('ok')
    else {
      SQL = `
        INSERT INTO users ( openid )
        VALUES ('${user.openid}')
      `
      connection.query(SQL, (err, row) => {
        if (err) throw err
        res.send('ok')
      })
    }
    connection.end()
  })
})
app.post('/login', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const SQL = 'SELECT * FROM admin_password'
  connection.query(SQL, (err, row) => {
    if (err) throw err
    if(row[0].password === req.body.password) res.send('ok')
    else res.send('deny')
    connection.end()
  })
})
app.get('/addTag', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const data = req.query
  let SQL = `
    SELECT *
    FROM tags
    WHERE name = '${data.tag}'
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    if (row.length > 0) res.send([{text:'标签已存在',code: 0}])
    else {
      SQL = `
        INSERT INTO tags ( name )
        VALUES ('${data.tag}')
      `
      connection.query(SQL, (err, row) => {
        if (err) throw err
        res.send([{text:'添加成功',code: 1}])
      })
    }
    connection.end()
  })
})
app.get('/allTags', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const SQL = `
    SELECT TGID, name
    FROM tags
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send(row)
    connection.end()
  })
})
app.get('/deleteTag', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const data = req.query
  const SQL = `
    DELETE from tags
    WHERE TGID = ${data.TGID}
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send([{text:'删除成功',code: 1}])
    connection.end()
  })
})
app.get('/updateTag', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const data = req.query
  const SQL = `
    UPDATE tags
    SET name = '${data.name}'
    WHERE TGID = ${data.TGID}
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send([{text:'添加成功',code: 1}])
    connection.end()
  })
})
app.get('/addNews', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const news = req.query
  const SQL = `
      INSERT INTO news(title,detail,display_time,TGID)
      VALUES ('${strFilter(news.title)}','${strFilter(news.detail)}','${news.display_time}','${news.TGID}')`
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send([{ NSID: row.insertId ,code: 1}])
    connection.end()
  })
})
app.post('/addNewsImg', upload.single('file'), (req, res) => {
  res.send('ok')
})
app.get('/updateNews', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const news = req.query
  const SQL = `
      UPDATE news
      SET title='${strFilter(news.title)}',detail='${strFilter(news.detail)}',display_time='${news.display_time}',TGID=${news.TGID}
      WHERE NSID = ${news.NSID}
    `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send([{ NSID: news.NSID ,code: 1}])
    connection.end()
  })
})
app.get('/getNewsByDate', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  let SQL = `
    SELECT news.*, name
    FROM tags,news
    WHERE display_time = '${req.query.date}' AND news.TGID = tags.TGID
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    const openid = req.query.openid
    
    if (openid) {
      SQL = `
        SELECT likes.* 
        FROM likes, users
        WHERE openid = '${openid}' AND users.USID = likes.USID
      `
      const likes = {}, shares = {}
      connection.query(SQL,(err, row1) => {
        if (err) throw err
        row1.forEach(v => likes[v.NSID] = true)
        SQL = `
          SELECT shares.* 
          FROM shares, users
          WHERE openid = '${openid}' AND users.USID = shares.USID
        `
        connection.query(SQL, (err, row2) => {
          if (err) throw err
          row2.forEach(v => shares[v.NSID] = true)
          row.forEach(v => {
            v.likes = likes[v.NSID]
            v.shares = shares[v.NSID]
          })
          res.send(row)
          connection.end()
        })
      })
    } else {
      res.send(row)
      connection.end()
    }
  })
})
app.get('/changeLike', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const data = req.query
  const SQL = parseInt(data.targetStatus) ? 
  `
    INSERT INTO likes ( NSID, USID )
    VALUES (${data.NSID}, (SELECT USID FROM users WHERE openid = '${data.openid}'))
  `:
  `
    DELETE FROM likes 
    WHERE NSID = ${data.NSID} AND likes.USID = (SELECT USID FROM users WHERE openid = '${data.openid}')
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send('ok')
    connection.end()
  })
})
app.get('/mylikes', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const SQL =  `
    SELECT news.*
    FROM news, users, likes
    WHERE news.NSID = likes.NSID AND users.USID = likes.USID AND openid = '${req.query.openid}'
    ORDER BY likes.add_time DESC
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    row.forEach(v => {
      [v.year,v.month,v.day] = v.display_time.split(/\D/).map(Number)
      v.likes = true
    })
    res.send(row)
    connection.end()
  })
})
app.get('/deleteNews', (req, res) => {
  const connection = mysql.createConnection(connectSQLConfig)
  connection.connect()
  const SQL = `
    DELETE FROM news
    WHERE NSID = ${req.query.NSID}
  `
  connection.query(SQL, (err, row) => {
    if (err) throw err
    res.send('ok')
    connection.end()
  })
})

app.listen(3000, () => console.log('ok...'))