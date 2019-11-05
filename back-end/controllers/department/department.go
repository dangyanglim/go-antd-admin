package department
import (
	"github.com/gin-gonic/gin"
	//"net/http"
	//"fmt"
	"go-antd-admin/utils/result"
	"go-antd-admin/utils/e"
	"go-antd-admin/models"
	"strconv"
	//"go-antd-admin/middleware/jwt"
)
func Index(c *gin.Context) {
	c.String(200, "Hello World2")
}

var departmentModel = new(models.Department)
// @Summary 注册用户
// @Produce  json
// @Param name query string true "name"
// @Param pwd query string true "password"
// @Success 200 {object} result.Response
// @Failure 500 {object} result.Response
// @Router /register [get]
// 注册信息
type DepartmentInfo struct {
	Name string `form:"name" binding:"required"`

	ParentID int `form:"parent_id" binding:"required"`

}

func CreateDepartment(c *gin.Context) {
	var dataIn DepartmentInfo
	if c.ShouldBind(&dataIn) == nil {
		data:=models.Department{Name:dataIn.Name,ParentID:dataIn.ParentID}
		if departmentModel.AddDepartment(data)==nil{
			result.Success(c,e.GetMsg(e.SUCCESS))
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}	
}
func GetDepartment(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		if data,err:=departmentModel.GetDepartment(id);err==nil{
			result.SuccessWithData(c,e.GetMsg(e.SUCCESS),data)
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}	
}
func DeleteDepartment(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		if err:=departmentModel.DeleteDepartment(uint(id));err==nil{
			result.Success(c,e.GetMsg(e.SUCCESS))
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{
		result.Error(c,e.INVALID_PARAMS)
	}	
}
// type TreeList struct {
// 	models.Department
//     Routes []*TreeList	`json:"routes"`
// }
type DepartmentManage struct{
	ID uint
	Key string	`json:"key"`
	Title string	`json:"title"`
}
type TreeListManage struct {
	ID uint `json:"id"`
	Key string	`json:"key"`
	Title string	`json:"title"`
	ParentID int `json:"parent_id"`
    Children []*TreeListManage	`json:"children,omitempty"`
}
// func getSubMenus(id int)[]*TreeList{
// 	menus,_:=menuModel.GetSubMenus(id)
// 	//fmt.Println(menus)
// 	treeList := []*TreeList{}
// 	for _,v:=range menus {
// 		if int(v.ID)!=id {	
// 			child := getSubMenus(int(v.ID))
// 				node := &TreeList{
// 					Menu:v,
// 				}
// 			node.Routes = child
// 			treeList = append(treeList, node)
// 		}
// 	}
// 	return treeList
// }
func getSubDepartmentsManage(id int)[]*TreeListManage{
	menus,_:=departmentModel.GetSubDepartments(id)
	//fmt.Println(menus)
	treeList := []*TreeListManage{}
	for _,v:=range menus {
		if int(v.ID)!=id {	
			child := getSubDepartmentsManage(int(v.ID))
				node := &TreeListManage{
					ID:v.ID,
					Key:strconv.Itoa(int(v.ID)),
					Title:v.Name,
					ParentID:v.ParentID,
				}
			node.Children = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}
// type Menus struct{
// 	models.Menu
// }
// func GetMenus(c *gin.Context) {
// 	id,err2:=strconv.Atoi(c.Query("id"))
// 	if err2==nil {
// 		treeList:=getSubMenus(id)
// 		result.SuccessWithData(c,e.GetMsg(e.SUCCESS),treeList)
// 	}else{

// 		result.Error(c,e.INVALID_PARAMS)
// 	}
// }
func GetDepartmentsManage(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		treeList:=getSubDepartmentsManage(id)
		result.SuccessWithData(c,e.GetMsg(e.SUCCESS),treeList)
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}
}
func GetAllDepartments(c *gin.Context) {
	department,_:=departmentModel.GetDepartment(1)
	treeList := []*TreeListManage{}
	node := &TreeListManage{
		ID:department.ID,
		Key:strconv.Itoa(int(department.ID)),
		Title:department.Name,
	}
		child:=getSubDepartmentsManage(1)
	node.Children=child
	treeList = append(treeList, node)
		result.SuccessWithData(c,e.GetMsg(e.SUCCESS),treeList)

}
type EditDepartmentInfo struct {
	Name string `form:"name" binding:"required"`
	ID uint `form:"id" binding:"required"`

}
func EditDepartment(c *gin.Context) {
	var info EditDepartmentInfo

	if c.ShouldBind(&info) == nil {
		depart:=models.Department{Name:info.Name}
		depart.ID=info.ID
		if depart2,err:=departmentModel.UpdateDepartment(depart);err==nil{
			result.SuccessWithData(c,e.GetMsg(e.SUCCESS),DepartmentManage{Key:strconv.Itoa(int(depart.ID)),Title:depart2.Name,})
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}	
}