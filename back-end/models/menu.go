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
	Deleted bool `json:"deleted,default:'false'"`
	Icon string `json:"icon,omitempty"`
	//Token string `json:"token,omitempty"`
}
// func Config() {
	
// }
func (p *Menu) GetSubMenus(parentID int) (menus []Menu, err error) {
	err=db.Mysql.Where("parent_id=? AND deleted=false", parentID).Find(&menus).Error
	return menus, err
}
func (p *Menu) GetMenu(id int) (menu Menu, err error) {
	err=db.Mysql.Where("deleted=false").First(&menu,id).Error
	return menu, err
}
func (p *Menu) AddMenu(temp Menu) (err error) {
	err=db.Mysql.Create(&temp).Error
	return err
}
func (p *Menu) DeleteMenu(id uint) (err error) {
	temp:=Menu{}
	temp.ID=id
	err=db.Mysql.Model(&temp).Update("deleted", true).Error
	return err
}
func (p *Menu) UpdateMenu(temp Menu) (temp2 Menu,err error) {

	err=db.Mysql.Model(&temp).Updates(temp).Error
	db.Mysql.First(&temp2, temp.ID)
	return temp2,err
}