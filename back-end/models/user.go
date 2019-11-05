package models
import (
	db "go-antd-admin/database"
	"github.com/jinzhu/gorm"
	"fmt"
)
type User struct {
	gorm.Model
	Name     string `json:"name"`
	Tel      string `json:"tel"`
	Pwd string `json:"pwd"`
	//Token string `json:"token,omitempty"`
}
func Config() {
	db.Mysql.Set("gorm:table_options", "ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;").AutoMigrate(&User{})
	db.Mysql.Set("gorm:table_options", "ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;").AutoMigrate(&Menu{})
	db.Mysql.Set("gorm:table_options", "ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;").AutoMigrate(&Department{})
	var menu Menu
	var depart Department
	
	if err:=db.Mysql.First(&menu).Error;err!=nil{
		fmt.Println(err)
		db.Mysql.Save(&Menu{Path:"/",Name:"首页",ParentID:0})
	}
	if err:=db.Mysql.First(&depart).Error;err!=nil{
		fmt.Println(err)
		db.Mysql.Save(&Department{Name:"公司"})
	}
}
func (p *User) GetUserByName(name string) (user User, err error) {
	err=db.Mysql.Where("name=?", name).Find(&user).Error
	return user, err
}
func (p *User) AddUser(temp User) (user User, err error) {
	err=db.Mysql.Create(&temp).Error
	return temp, err
}