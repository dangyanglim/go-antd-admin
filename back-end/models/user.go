package models
import (
	db "go-antd-admin/database"
	"github.com/jinzhu/gorm"
)
type User struct {
	gorm.Model
	Name     string `json:"name"`
	Tel      string `json:"tel"`
	Pwd string `json:"pwd"`
	//Token string `json:"token,omitempty"`
}
func Config() {
	db.Mysql.AutoMigrate(&User{})
}
func (p *User) GetUserByName(name string) (user User, err error) {
	err=db.Mysql.Where("name=?", name).Find(&user).Error
	return user, err
}
func (p *User) AddUser(temp User) (user User, err error) {
	err=db.Mysql.Create(&temp).Error
	return temp, err
}