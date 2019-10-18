package menu
import (
	"github.com/gin-gonic/gin"
	//"net/http"
	"fmt"
	"go-antd-admin/utils/result"
	"go-antd-admin/utils/e"
	"go-antd-admin/models"
	"strconv"
	//"go-antd-admin/middleware/jwt"
)
func Index(c *gin.Context) {
	c.String(200, "Hello World2")
}

var menuModel = new(models.Menu)
// @Summary 注册用户
// @Produce  json
// @Param name query string true "name"
// @Param pwd query string true "password"
// @Success 200 {object} result.Response
// @Failure 500 {object} result.Response
// @Router /register [get]
// 注册信息
type MenuInfo struct {
	Name string `form:"name" binding:"required"`
	Path string `form:"path" binding:"required"`
	ParentID int `form:"parent_id" binding:"required"`
	Component string `form:"component"`
	Icon string `form:"icon"`
}

func CreateMenu(c *gin.Context) {
	var menuInfo MenuInfo
	if c.ShouldBind(&menuInfo) == nil {
		menu:=models.Menu{Icon:menuInfo.Icon,Name:menuInfo.Name,Path:menuInfo.Path,ParentID:menuInfo.ParentID,Component:menuInfo.Component}
		if menuModel.AddMenu(menu)==nil{
			result.Success(c,e.GetMsg(e.SUCCESS))
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{
		fmt.Println(c.ShouldBind(&menuInfo))
		fmt.Println(menuInfo)
		result.Error(c,e.INVALID_PARAMS)
	}	
}
func GetMenu(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		if menu,err:=menuModel.GetMenu(id);err==nil{
			result.SuccessWithData(c,e.GetMsg(e.SUCCESS),menu)
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}	
}
func DeleteMenu(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		if err:=menuModel.DeleteMenu(uint(id));err==nil{
			result.Success(c,e.GetMsg(e.SUCCESS))
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}	
}
type TreeList struct {
	models.Menu
    Routes []*TreeList	`json:"routes"`
}
type MenuManage struct{
	ID uint
	Key string	`json:"key"`
	Title string	`json:"title"`
	Path string	`json:"path"`
	Component      string `json:"component,omitempty"`
	Icon string `json:"icon,omitempty"`
}
type TreeListManage struct {
	ID uint
	Key string	`json:"key"`
	Title string	`json:"title"`
	Path string	`json:"path"`
	Component      string `json:"component,omitempty"`
	Icon string `json:"icon,omitempty"`
    Children []*TreeListManage	`json:"children"`
}
func getSubMenus(id int)[]*TreeList{
	menus,_:=menuModel.GetSubMenus(id)
	//fmt.Println(menus)
	treeList := []*TreeList{}
	for _,v:=range menus {
		if int(v.ID)!=id {	
			child := getSubMenus(int(v.ID))
				node := &TreeList{
					Menu:v,
				}
			node.Routes = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}
func getSubMenusManage(id int)[]*TreeListManage{
	menus,_:=menuModel.GetSubMenus(id)
	//fmt.Println(menus)
	treeList := []*TreeListManage{}
	for _,v:=range menus {
		if int(v.ID)!=id {	
			child := getSubMenusManage(int(v.ID))
				node := &TreeListManage{
					ID:v.ID,
					Key:strconv.Itoa(int(v.ID)),
					Title:v.Name,
					Path:v.Path,
					Component:v.Component,
					Icon:v.Icon,
				}
			node.Children = child
			treeList = append(treeList, node)
		}
	}
	return treeList
}
type Menus struct{
	models.Menu
}
func GetMenus(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		treeList:=getSubMenus(id)
		result.SuccessWithData(c,e.GetMsg(e.SUCCESS),treeList)
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}
}
func GetMenusManage(c *gin.Context) {
	id,err2:=strconv.Atoi(c.Query("id"))
	if err2==nil {
		treeList:=getSubMenusManage(id)
		result.SuccessWithData(c,e.GetMsg(e.SUCCESS),treeList)
	}else{

		result.Error(c,e.INVALID_PARAMS)
	}
}
func GetAllMenus(c *gin.Context) {
	menu,_:=menuModel.GetMenu(1)

	node := &TreeListManage{
		ID:menu.ID,
		Key:strconv.Itoa(int(menu.ID)),
		Title:menu.Name,
		Path:menu.Path,
		Component:menu.Component,
		Icon:menu.Icon,
	}
		child:=getSubMenusManage(1)
	node.Children=child

		result.SuccessWithData(c,e.GetMsg(e.SUCCESS),node)

}
type EditMenuInfo struct {
	Name string `form:"name" binding:"required"`
	Path string `form:"path" binding:"required"`
	ID uint `form:"id" binding:"required"`
	Component string `form:"component"`
	Icon string `form:"icon"`
}
func EditMenu(c *gin.Context) {
	var menuInfo EditMenuInfo

	if c.ShouldBind(&menuInfo) == nil {
		menu:=models.Menu{Name:menuInfo.Name,Path:menuInfo.Path,Component:menuInfo.Component,Icon:menuInfo.Icon}
		menu.ID=menuInfo.ID
		if menu2,err:=menuModel.UpdateMenu(menu);err==nil{
			result.SuccessWithData(c,e.GetMsg(e.SUCCESS),MenuManage{Icon:menu.Icon,Key:strconv.Itoa(int(menu.ID)),Path:menu2.Path,Title:menu2.Name,Component:menu2.Component})
		}else{
			result.Error(c,e.ERROR_CREATE_MENU)
		}
	}else{
		fmt.Println(c.ShouldBind(&menuInfo))
		fmt.Println(menuInfo)
		result.Error(c,e.INVALID_PARAMS)
	}	
}