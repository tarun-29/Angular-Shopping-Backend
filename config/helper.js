const Mysqli = require('mysqli');

let conn = new Mysqli({
    Host: 'localhost',
    post : 3306,
    user: 'root',
    passwd: '29tarunkantiwal',
    db: 'mega_shop'
})

let db = conn.emit(false, '')

module.exports = {
    database: db
}