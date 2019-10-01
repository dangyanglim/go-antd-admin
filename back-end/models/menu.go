package models
import (
	db "go-antd-admin/database"
	"github.com/jinzhu/gorm"
)
type Menu struct {
	gorm.Model
	Path     string `json:"path"`
	Component      string `json:"component,omitempty"`
	Name string `json:"name"`
	Redirect string `json:"redirect,omitempty"`
	ParentID   int       `json:"parent_id"`
	//Token string `json:"token,omitempty"`
}
// func Config() {
	
// }
func (p *Menu) GetSubMenus(parentID int) (menus []Menu, err error) {
	err=db.Mysql.Where("parent_id=?", parentID).Find(&menus).Error
	return menus, err
}
func (p *Menu) GetMenu(id int) (menu Menu, err error) {
	err=db.Mysql.First(&menu,id).Error
	return menu, err
}
func (p *Menu) AddMenu(temp Menu) (err error) {
	err=db.Mysql.Create(&temp).Error
	return err
}