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
}

func CreateMenu(c *gin.Context) {
	var menuInfo MenuInfo
	if c.ShouldBind(&menuInfo) == nil {
		menu:=models.Menu{Name:menuInfo.Name,Path:menuInfo.Path,ParentID:menuInfo.ParentID}
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
type TreeList struct {
	models.Menu
    Routes []*TreeList	`json:"routes"`
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