package models
import (
	db "go-antd-admin/database"
	"github.com/jinzhu/gorm"
)
type Department struct {
	gorm.Model
	Name string `json:"name"`
	ParentID   int       `json:"parent_id"`
	Deleted bool `json:"deleted,default:'false'"`
}
// func Config() {
	
// }
func (p *Department) GetSubDepartments(parentID int) (departments []Department, err error) {
	err=db.Mysql.Where("parent_id=? AND deleted=false", parentID).Find(&departments).Error
	return departments, err
}
func (p *Department) GetDepartment(id int) (department Department, err error) {
	err=db.Mysql.Where("deleted=false").First(&department,id).Error
	return department, err
}
func (p *Department) AddDepartment(temp Department) (err error) {
	err=db.Mysql.Create(&temp).Error
	return err
}
func (p *Department) DeleteDepartment(id uint) (err error) {
	temp:=Department{}
	temp.ID=id
	err=db.Mysql.Model(&temp).Update("deleted", true).Error
	return err
}
func (p *Department) UpdateDepartment(temp Department) (temp2 Department,err error) {

	err=db.Mysql.Model(&temp).Updates(temp).Error
	db.Mysql.First(&temp2, temp.ID)
	return temp2,err
}