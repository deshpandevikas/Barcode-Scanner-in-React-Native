const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

const SELECT_ALL_PRODUCTS_QUERY = 'select * from Product';


var db_config = {
  host    : 'us-cdbr-iron-east-01.cleardb.net',
  user    : 'b932fe2f1d313d',
  password: 'a0ed22ce',
  database: 'heroku_8183bf598a513fc'
};

var connection = mysql.createConnection(db_config);


function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

connection.connect(err => {
  if(err) {
    return err;
  }
});

console.log(connection);
app.use(cors());

app.get('/', (req, res) => {
  res.redirect('/products');
});


app.get('/products/add', (req, res) => {
  const { Name, code } = req.query;
  const INSERT_PRODUCTS_QUERY = `insert into product(Name, code) values('${Name}','${code}')`;
  connection.query(INSERT_PRODUCTS_QUERY, (err,results) => {
    if(err){
      return res.send(err);
    }
    else {
      return res.send('successfully added product ');
    }
  });
});

app.get('/products', (req, res) => {
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.json({
        data: results
      })
    }
  });
});


app.get('/products/:code', (req, res) => {
  let SELECT_ONE_PRODUCT_QUERY = `select Name from Product where code = '${req.params.code}'`;
  connection.query(SELECT_ONE_PRODUCT_QUERY, (err, result) => {
    if(err) {
      return res.send(err);
    } else {
      return res.json({
        data: result
      })
    }
  });
});


app.get('/productDelete/:code', (req, res) => {
  let DELETE_ONE_PRODUCT_QUERY = `delete from Product where code = '${req.params.code}'`;
  connection.query(DELETE_ONE_PRODUCT_QUERY, (err, result) => {
    if(err) {
      return res.send(err);
    } else {
      return res.json({
        data: result
      })
    }
  });
});


app.listen(process.env.PORT || 4000, () => {
  console.log('Product server listening on 4000');
});
