package database

import (
	//"database/sql"
	"fmt"
	"github.com/garyburd/redigo/redis"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	//"gopkg.in/mgo.v2"
	"log"
)
var Redis redis.Conn
var Mysql *gorm.DB
//var MogSession *mgo.Session
func init() {
}

func Config(mysql_url string,redis_url string) {
	var err error
	Mysql, err = gorm.Open("mysql", mysql_url)
	if err != nil {
		log.Fatal(err.Error())
	}
	
	Redis, err = redis.Dial("tcp", redis_url)
	if err != nil {
		fmt.Println("Connect to redis error", err)
		return
	}
	

}